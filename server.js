/* ============================================================
   Shop Manager — backend server
   - Serves the app (public/)
   - Real user accounts (email + password, hashed)
   - Cloud sync of each user's shop data
   - Bill photo uploads

   STORAGE:
   - If MONGODB_URI is set  -> uses MongoDB Atlas (permanent, for deployment)
   - Otherwise              -> uses local JSON files (for running on your PC)
   ============================================================ */
const express = require('express');
const crypto  = require('crypto');
const fs      = require('fs');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const IMG_DIR  = path.join(DATA_DIR, 'images');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SHOPS_FILE = path.join(DATA_DIR, 'shops.json');
fs.mkdirSync(IMG_DIR, { recursive: true });

/* =====================================================================
   STORAGE ABSTRACTION — same functions whether we use Mongo or files
   ===================================================================== */
const USE_MONGO = !!process.env.MONGODB_URI;
let mUsers, mShops, mImages;

async function initStore(){
  if(USE_MONGO){
    const { MongoClient } = require('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const dbm = client.db('shopmanager');
    mUsers  = dbm.collection('users');
    mShops  = dbm.collection('shops');
    mImages = dbm.collection('images');
    try{ await mUsers.createIndex({ email: 1 }, { unique: true }); }catch(e){}
    console.log('✅ Storage: MongoDB Atlas (permanent)');
  }else{
    console.log('✅ Storage: local JSON files');
  }
}

// ---- file-mode in-memory caches ----
function readJSON(file, fb){ try{ return JSON.parse(fs.readFileSync(file,'utf8')); }catch{ return fb; } }
function writeJSON(file, o){ fs.writeFileSync(file, JSON.stringify(o)); }
let fUsers = readJSON(USERS_FILE, {});
let fShops = readJSON(SHOPS_FILE, {});

// ---- user record: { email, salt, hash, uid, shop } ----
async function getUser(email){
  if(USE_MONGO) return await mUsers.findOne({ email });
  return fUsers[email] || null;
}
async function putUser(email, rec){
  if(USE_MONGO){ await mUsers.updateOne({ email }, { $set: rec }, { upsert:true }); return; }
  fUsers[email] = rec; writeJSON(USERS_FILE, fUsers);
}
async function getShop(uid){
  if(USE_MONGO){ const d = await mShops.findOne({ uid }); return d ? d.data : null; }
  return fShops[uid] || null;
}
async function putShop(uid, data){
  if(USE_MONGO){ await mShops.updateOne({ uid }, { $set:{ uid, data, updated:Date.now() } }, { upsert:true }); return; }
  fShops[uid] = data; writeJSON(SHOPS_FILE, fShops);
}
async function putImage(id, buffer){
  if(USE_MONGO){ await mImages.updateOne({ id }, { $set:{ id, data: buffer.toString('base64') } }, { upsert:true }); return; }
  fs.writeFileSync(path.join(IMG_DIR, id), buffer);
}
async function getImage(id){
  if(USE_MONGO){ const d = await mImages.findOne({ id }); return d ? Buffer.from(d.data,'base64') : null; }
  const p = path.join(IMG_DIR, path.basename(id));
  return fs.existsSync(p) ? fs.readFileSync(p) : null;
}

/* =====================================================================
   AUTH HELPERS
   ===================================================================== */
function hashPassword(pw, salt){ return crypto.scryptSync(pw, salt, 64).toString('hex'); }
function makeToken(uid){ const t = crypto.randomBytes(24).toString('hex'); tokens[t] = uid; return t; }
let tokens = {}; // token -> uid (in-memory sessions)
function authUid(req){ const t = (req.headers.authorization||'').replace('Bearer ','').trim(); return tokens[t] || null; }

app.use(express.json({ limit: '12mb' }));

/* =====================================================================
   ROUTES
   ===================================================================== */
app.get('/api/health', (req,res)=> res.json({ ok:true, cloud:true, store: USE_MONGO?'mongodb':'file' }));

app.post('/api/signup', async (req,res)=>{
  try{
    const email = String(req.body.email||'').trim().toLowerCase();
    const pw    = String(req.body.password||'');
    const shop  = String(req.body.shop||'').trim();
    if(!email || !email.includes('@')) return res.status(400).json({error:'Enter a valid email'});
    if(pw.length < 4) return res.status(400).json({error:'Password must be at least 4 characters'});
    if(await getUser(email)) return res.status(400).json({error:'That email already has an account — please log in'});
    const salt = crypto.randomBytes(16).toString('hex');
    const uid = 'u_' + crypto.randomBytes(8).toString('hex');
    await putUser(email, { email, salt, hash: hashPassword(pw, salt), uid, shop });
    await putShop(uid, { shopName: shop, products:[], sales:[], expenses:[], bills:[] });
    res.json({ token: makeToken(uid), email, shop });
  }catch(e){ res.status(500).json({error:'Server error, try again'}); }
});

app.post('/api/login', async (req,res)=>{
  try{
    const email = String(req.body.email||'').trim().toLowerCase();
    const pw    = String(req.body.password||'');
    const u = await getUser(email);
    if(!u) return res.status(400).json({error:'No account found with that email'});
    if(hashPassword(pw, u.salt) !== u.hash) return res.status(400).json({error:'Incorrect email or password'});
    res.json({ token: makeToken(u.uid), email, shop: u.shop });
  }catch(e){ res.status(500).json({error:'Server error, try again'}); }
});

app.post('/api/logout', (req,res)=>{
  delete tokens[(req.headers.authorization||'').replace('Bearer ','').trim()];
  res.json({ ok:true });
});

app.get('/api/data', async (req,res)=>{
  const uid = authUid(req);
  if(!uid) return res.status(401).json({error:'Not logged in'});
  const data = await getShop(uid);
  res.json({ data: data || { shopName:'', products:[], sales:[], expenses:[], bills:[] } });
});

app.post('/api/data', async (req,res)=>{
  const uid = authUid(req);
  if(!uid) return res.status(401).json({error:'Not logged in'});
  const data = req.body.data;
  if(!data || typeof data !== 'object') return res.status(400).json({error:'bad data'});
  await putShop(uid, data);
  res.json({ ok:true, updated: Date.now() });
});

app.post('/api/image', async (req,res)=>{
  const uid = authUid(req);
  if(!uid) return res.status(401).json({error:'Not logged in'});
  const m = String(req.body.image||'').match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
  if(!m) return res.status(400).json({error:'bad image'});
  const id = uid + '_' + crypto.randomBytes(6).toString('hex') + '.jpg';
  await putImage(id, Buffer.from(m[2], 'base64'));
  res.json({ url: '/img/' + id });
});

app.get('/img/:name', async (req,res)=>{
  const buf = await getImage(path.basename(req.params.name));
  if(!buf) return res.status(404).end();
  res.set('Content-Type','image/jpeg').send(buf);
});

/* static app */
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req,res)=> res.sendFile(path.join(__dirname, 'public', 'index.html')));

initStore().then(()=>{
  app.listen(PORT, '0.0.0.0', ()=> console.log('Shop Manager running on port ' + PORT));
}).catch(err=>{
  console.error('Storage init failed:', err.message);
  process.exit(1);
});
