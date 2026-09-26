# 📘 Shop Manager — Your App Guide

Your app is a **real web app with its own backend**: accounts, password login, and automatic
cloud sync across every device. No Firebase, no keys — it just works.

---

## ✅ Use it RIGHT NOW (live link)

While this workspace is running, a **live link** is shown to you (the preview).

1. Open that link on your **laptop** → click **Sign up** → create your email + password.
2. Open the **same link** on your **phone** → **Log in** with the same email + password.
3. Add a product on one device → it appears on the other. 🎉 That's live cloud sync.

> ⚠️ This particular preview link is temporary (it stays up while the workspace is active).
> To get a **permanent link that's always online for free**, do the 1-time deploy below.

---

## 📲 Install it like a real app (free, no Play Store)

Once you have a link open in the browser:

- **Android (Chrome):** menu ⋮ → **Install app** / **Add to Home screen**.
- **iPhone (Safari):** Share button → **Add to Home Screen**.
- **Laptop (Chrome/Edge):** click the **install icon ⊕** in the address bar.

It gets its own icon and opens full-screen — just like an app from the store.

---

## 🌐 Make it PERMANENT & FREE (about 10 minutes, once)

This puts your app online 24/7 with a fixed web address. Recommended host: **Render** (free).

### Step 1 — Get the project files
All your files are in the `shop-manager` folder:
`server.js`, `package.json`, and the `public/` folder. Download/keep this folder.

### Step 2 — Put the code on GitHub (free)
1. Create a free account at **https://github.com**.
2. Click **New repository** → name it `shop-manager` → **Create**.
3. Use the **“uploading an existing file”** link and drag in all the files
   (`server.js`, `package.json`, and the `public` folder). Commit.

### Step 3 — Deploy on Render (free)
1. Create a free account at **https://render.com** (you can sign in with GitHub).
2. Click **New → Web Service** → connect your `shop-manager` repository.
3. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance type:** Free
4. Click **Create Web Service**. After a minute you'll get a permanent link like
   `https://shop-manager-xxxx.onrender.com`.
5. Open that link on any device, sign up once, and log in everywhere. Done — forever, free.

> 💡 On Render's free tier the app may “sleep” after 15 min idle and take ~30 sec to wake
> on the first open. That's normal for free hosting and fine for a single shop.

### (Optional) Even simpler alternatives
- **Railway.app** or **Cyclic.sh** — same idea, connect GitHub → deploy.

---

## 🔐 About your data
- Each account's data is stored on the server in the `data/` folder (`users.json`, `shops.json`,
  and bill photos under `data/images/`).
- Passwords are **hashed** (never stored as plain text).
- Use **Data → Download backup** in the app now and then for an extra safety copy.

## ❓ Need help?
Ask me and I'll walk you through GitHub or Render step by step, or help with a custom domain
(like `myshop.com`) later.
