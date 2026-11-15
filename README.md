# Kylian Malartre

Source of [kylianmalartre.com](https://www.kylianmalartre.com). One static page, no build step: Vercel serves this folder as it is (`vercel.json` turns off the framework preset).

One function beside it: `api/active-users.mjs` reads UKit's active users for the figure of the page, in hundreds, from a function of UKit's database that lets nothing else out. It needs `SUPABASE_URL` and `SUPABASE_ANON_KEY`, UKit's publishable key (public by design; never its `service_role` key): in the Vercel project (production) and, to run it locally, in a `.env` that git ignores. Without them, or without an answer, the page keeps the figure written in it.

- `index.html`, `css/`, `js/`: the page, in plain ES modules. three.js (`vendor/three/`, MIT licence) draws the phone and the laptop, both modelled in code; the graph and the viewfinder are 2D canvases.
- `fonts/`: Malartre, a cut of Noto Serif Display (titles) and of Noto Serif (text), with the arrows of Instrument Sans, all under the SIL Open Font License 1.1 (`fonts/OFL*.txt`). Like the originals, they can be reused under the same licence.
- The scripts that make the fonts, the images and the screen captures stay in a separate workshop; the comments that name a `tools/` folder or a LISEZMOI refer to it.

To look at it locally: `python3 -m http.server`, then open http://localhost:8000 (the function does not run there: the written figure shows).

The previous version of the site (Next.js, bento grid) is kept at the tag `v1-bento`.
