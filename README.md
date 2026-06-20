# Ink — your free AI chat website

A clean, working AI chatbot website. Free to run, powered by Google's Gemini free tier, hosted free on Vercel.

---

## What's in this folder

```
ai-chat-site/
├── public/
│   └── index.html      ← the website (chat UI)
├── api/
│   └── chat.js          ← serverless function that talks to Gemini (keeps your key secret)
├── vercel.json
├── package.json
└── README.md            ← you are here
```

---

## Step 1 — Get a free Gemini API key (~2 minutes)

This is the one step that has to be done by you personally — agreeing to Google's terms isn't something I can do on your behalf.

1. Go to **https://aistudio.google.com/app/apikey**
2. Sign in with any Google account.
3. Click **"Create API key"**.
4. Accept the terms shown on screen (this is Google's terms for their API, not mine).
5. Copy the key that's generated — it looks like `AIzaSy...`.

The free tier (as of today) gives you a generous number of requests per day at no cost, no credit card required. If Google changes these limits later, you'll see it reflected as an error message in the chat ("Free tier rate limit hit").

---

## Step 2 — Put the code on GitHub

1. Create a free account at **https://github.com** if you don't have one.
2. Create a new repository (e.g. `my-ai-chat`).
3. Upload everything in this folder to that repository (drag-and-drop works fine on GitHub's web UI, or use `git push` if you're comfortable with git).

---

## Step 3 — Deploy on Vercel (free)

1. Go to **https://vercel.com** and sign up free (you can sign up directly with your GitHub account).
2. Click **"Add New" → "Project"**.
3. Select the GitHub repository you just created.
4. Before clicking Deploy, open **"Environment Variables"** and add:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** *(paste the key you copied in Step 1)*
5. Click **Deploy**.

In about a minute, Vercel gives you a live URL like `https://my-ai-chat.vercel.app` — that's your website, live and free.

---

## Step 4 — Test it

Open your new URL, type a message, hit enter. You should get a reply within a couple seconds.

If you see an error banner instead:
- **"Server is missing GEMINI_API_KEY"** → the environment variable wasn't saved before deploy. Go to your Vercel project → Settings → Environment Variables, add it, then go to Deployments and click "Redeploy".
- **"Free tier rate limit hit"** → you've hit Gemini's free quota for the moment. Wait a bit and try again.
- Anything else → check the Vercel project's "Logs" tab (under the Functions section) for the exact error.

---

## Costs — what's actually free here

| Piece | Cost |
|---|---|
| Vercel hosting | Free (Hobby plan covers this comfortably) |
| Gemini API, free tier | Free, with a daily request limit set by Google |
| Custom domain (optional) | Not required — your `.vercel.app` URL works as-is |

If your site gets enough traffic to exceed Gemini's free daily limit, the chat will show a clear rate-limit message rather than failing silently. At that point your options are: wait for the quota to reset daily, or add a paid API key later (the code already supports swapping `GEMINI_API_KEY` for any provider with small changes to `api/chat.js`).

---

## Customizing it

- **Name/branding:** edit the `<h1>Ink</h1>` and `<title>` in `public/index.html`.
- **Colors:** all colors are CSS variables at the top of the `<style>` block in `index.html` (`--paper`, `--ink`, `--clay`, `--sage`) — change those and the whole palette updates.
- **Starter prompts:** the four suggestion chips on the empty state are in `index.html` under `.prompts`.
- **System behavior / personality:** add a `systemInstruction` field to the Gemini request body in `api/chat.js` if you want the AI to follow a specific persona or rules.

---

## A note on "terms"

I built the website, the backend, and this guide. What I can't do is click "I agree" on Google's API terms or Vercel's terms of service for you — that has to come from an actual account holder, which is you. Step 1 and Step 3 above are the only two places you'll need to accept anything, and both are standard, free signups.
