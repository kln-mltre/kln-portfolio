# Kylian Malartre

Source of [kylianmalartre.com](https://www.kylianmalartre.com). One static page, no build step: Vercel serves this folder as it is (`vercel.json` turns off the framework preset).

- `index.html`, `css/`, `js/`: the page, in plain ES modules. three.js (`vendor/three/`, MIT licence) draws the phone and the laptop, both modelled in code; the graph and the viewfinder are 2D canvases.
- `fonts/`: Malartre, a cut of Noto Serif Display under the SIL Open Font License 1.1 (`fonts/OFL.txt`). Like the original, it can be reused under the same licence.
- The scripts that make the fonts, the images and the screen captures stay in a separate workshop; the comments that name a `tools/` folder refer to it.

To look at it locally: `python3 -m http.server`, then open http://localhost:8000.

The previous version of the site (Next.js, bento grid) is kept at the tag `v1-bento`.
