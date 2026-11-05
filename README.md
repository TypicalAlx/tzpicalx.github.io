# Alexander Nguyen — Portfolio

Plain HTML, CSS and JavaScript. No build step: open `index.html` in a browser, or run a tiny local server:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Files

```
index.html          Home: hero, About, languages carousel, IT + Photography sections, contact
it-projects.html    Project index + StreamFinder case study
photography.html    Filters, featured shot, series, gallery, full-screen lightbox
css/styles.css      All styles. Colors and fonts live in :root at the top
js/main.js          Mobile menu, scroll reveals, marquee, carousel (every page)
js/photography.js   Photo list, filters and lightbox
assets/photos/      Your photos
assets/streamfinder/ StreamFinder screen exports
```

## Common edits

| To change… | Edit |
|---|---|
| Add a photo to the gallery | Put it in `assets/photos/`, add a line to `PHOTOS` in `js/photography.js`. A new `category` makes a new filter button automatically. |
| Your portrait (About) | Save as `assets/photos/portrait.jpg` — it appears automatically |
| StreamFinder screens | In Figma, export the frames as PNG to `assets/streamfinder/` named `welcome.png`, `home.png`, `search-results.png`, `movie-details.png`, plus `cover.png` for the Home page cover |
| Resume button | Save your resume as `assets/resume.pdf` |
| Email + social links | Footer of each page (contact@tzpicalx.com, tzpicalx links) |
| Bio, languages list | `index.html` (About and Languages sections) |
| Accent color | `--amber` in `css/styles.css` |

## Putting it online (free)

**GitHub Pages:** create a repo, upload these files, then Settings → Pages → deploy from the `main` branch.
**Netlify:** drag this folder onto app.netlify.com/drop.

Both let you connect a custom domain later (add the domain in the host's settings, then point your DNS records to it).
