# Gurnaad Academy Website

Production-ready static website for Gurnaad Academy.

## Project structure

```text
public/          Files deployed to the website
  assets/        Optimized brand, portrait, and instrument artwork
  index.html     Website markup and content
  styles.css     Responsive design and animation
  script.js      Loader, reveals, and scroll interactions
docs/            Planning and creative-direction documents
design-source/   Generation intermediates and original logo source
vercel.json      Vercel deployment and security configuration
```

Only `public/` is deployed. The reference and generation files are excluded by `.vercelignore`.

## Local preview

From the project root:

```powershell
python -m http.server 4173 --directory public
```

Then open `http://localhost:4173/`.

## Deploy to Vercel

### Git workflow

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Leave the framework preset as **Other**. `vercel.json` already sets `public/` as the output directory.
4. Deploy. No environment variables or build command are required.

### Vercel CLI

```powershell
npx vercel
```

For the production deployment:

```powershell
npx vercel --prod
```

## Before public launch

- Confirm the final domain and add it in Vercel.
- Confirm academy statistics and contact details with Ustaad Ji.
- Test the site on a real iPhone and Android phone.
- Run a final accessibility and performance audit.
