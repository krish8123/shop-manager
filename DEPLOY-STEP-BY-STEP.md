# 🚀 Put Your Shop Manager Online — FREE & Permanent

Follow these in order. Total time: about **20 minutes, once**. Everything here is **100% free**.

You'll create 3 free accounts:
1. **MongoDB Atlas** → where your data is stored permanently
2. **GitHub** → where your app's code lives
3. **Render** → runs your app 24/7 and gives you a permanent link

Take it slow, one part at a time. ☕

---

# PART 1 — Free permanent database (MongoDB Atlas) 🗄️

This is where your products, sales and bills are saved forever.

1. Go to **https://www.mongodb.com/cloud/atlas/register** and sign up (Google sign-in is easiest).
2. When it asks about a cluster, choose the **FREE / M0** option → click **Create**.
   - Provider: any (AWS is fine). Region: pick one near India (e.g. Mumbai). → **Create Deployment**.
3. A **"Connect to..."** box appears asking to create a database user:
   - **Username:** `shopadmin`
   - **Password:** click **Autogenerate** (or type one) → **COPY AND SAVE IT** somewhere safe.
   - Click **Create Database User**.
4. Next it asks about network access. Click **Add My Current IP Address**, then also:
   - Choose **Allow Access from Anywhere** (or add `0.0.0.0/0`). This lets Render connect. → **Finish**.
5. Now get your connection link:
   - Click **Connect** (on your cluster) → **Drivers**.
   - You'll see a link like:
     `mongodb+srv://shopadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - **Copy it.** Replace `<password>` with the password you saved in step 3.
   - 👉 **Keep this final link handy — you'll paste it into Render in Part 3.**

✅ Part 1 done. Your database is ready.

---

# PART 2 — Put the code on GitHub 💾

1. Go to **https://github.com** and sign up (or log in).
2. Top-right **+** → **New repository**.
   - Repository name: `shop-manager`
   - Keep it **Public** (or Private — both work) → **Create repository**.
3. On the new page, click the link **"uploading an existing file"**.
4. From your `shop-manager` folder, drag in these items:
   - `server.js`
   - `package.json`
   - `.gitignore`
   - the **`public`** folder (with index.html, manifest.json, sw.js, icon files inside)
   - *(the guide `.md` files are optional)*
   - ❌ Do **NOT** upload `node_modules` or `data` (they're not needed).
5. Scroll down → click **Commit changes**.

✅ Part 2 done. Your code is on GitHub.

---

# PART 3 — Run it 24/7 on Render 🌐

1. Go to **https://render.com** → **Get Started** → sign in **with GitHub** (easiest).
2. Click **New +** → **Web Service**.
3. Connect your **`shop-manager`** repository (click **Connect**). Allow access if asked.
4. Fill in the settings:
   - **Name:** `shop-manager` (this becomes part of your web address)
   - **Region:** pick one near India (e.g. Singapore)
   - **Branch:** `main`
   - **Runtime / Language:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** **Free**
5. Scroll to **Environment Variables** → **Add Environment Variable**:
   - **Key:** `MONGODB_URI`
   - **Value:** paste the MongoDB link from Part 1 (with your real password in it)
6. Click **Create Web Service**.
7. Wait ~1–2 minutes while it builds. When you see **"Live"**, you'll have a link like:
   **`https://shop-manager-xxxx.onrender.com`**

✅ That's your permanent app link! Open it on any device, **Sign up once**, then **Log in** everywhere.

---

# 📲 Install it as an app on your devices

Open your Render link, then:
- **Android (Chrome):** menu ⋮ → **Install app**
- **iPhone (Safari):** Share → **Add to Home Screen**
- **Laptop (Chrome/Edge):** click the **install ⊕** icon in the address bar

---

# ✅ Quick check it's working
1. Open the link on your **laptop** → sign up → add one product.
2. Open the link on your **phone** → log in → the product is there. 🎉

---

# 💡 Good to know
- **Free Render sleeps** after 15 min of no use, so the **first** open after a break takes
  ~30 seconds to wake up. Then it's fast. (Totally fine for one shop.)
- Your data is safe in MongoDB even when the app sleeps or restarts.
- Want it to never sleep, or a custom name like `myshop.com`? Those are cheap paid upgrades —
  ask me when you're ready.

---

## 🆘 Stuck on any step?
Tell me **which part and step number** and what you see on screen — I'll get you unstuck.
Common ones:
- *"Application failed to respond"* on Render → usually the `MONGODB_URI` has a wrong/missing
  password, or you forgot **Allow Access from Anywhere** in Atlas (Part 1, step 4).
- *Can't log in from another device* → make sure you're opening the **Render link**, not a file.
