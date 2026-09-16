# Set up GitHub and publish the visual

The website, BR-UK assets and GitHub Actions workflows are committed and pushed to the public repository [MaggieGuanyuYang/BR-UK_capability_building_workshops](https://github.com/MaggieGuanyuYang/BR-UK_capability_building_workshops). Local manuscripts, dependencies, build output and environment files are ignored by Git.

## 1. Repository setup — complete

The repository is ready with:

- **Owner:** `MaggieGuanyuYang`
- **Repository name:** `BR-UK_capability_building_workshops`
- **Description:** `Interactive BR-UK research-to-action explorer based on Table 3 of Yang et al., PLOS One (2026).`
- **Visibility:** Public, which supports GitHub Pages on a free account.
- **Default branch:** `main`.
- **Local connection:** `origin` points to the repository and `main` tracks `origin/main`.

The **Check website** workflow builds and tests pushed code. The separate deployment workflow publishes only when you run it. Continue with step 2 for the first publication.

## 2. Enable GitHub Pages

1. Open the repository’s [Settings → Pages](https://github.com/MaggieGuanyuYang/BR-UK_capability_building_workshops/settings/pages).
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.

## 3. Publish the website

1. Open [Actions → Deploy to GitHub Pages](https://github.com/MaggieGuanyuYang/BR-UK_capability_building_workshops/actions/workflows/deploy-pages.yml).
2. Click **Run workflow**, keep the branch as **main**, then click the green **Run workflow** button.
3. Wait for the build, tests and deployment to show green checks. Open the website address shown by the deployment.

With this owner and repository name, the expected public address is:

**https://maggieguanyuyang.github.io/BR-UK_capability_building_workshops/**

The workflow gets the real public URL from GitHub Pages. It sets the repository path for scripts, fonts and the logo, and adds the canonical URL and absolute social-preview image URL. No token or secret needs to be entered manually.

Before sharing the public link, check that the logo loads, choose an audience, open a strategy, and save a plan. Add the working URL to `linkedin-post.md`, and attach `public/linkedin-post.png` to your LinkedIn post.

## 4. Publish later updates

After editing the site, run:

```sh
npm run build
npm test
git add src public README.md PUBLISHING.md
git commit -m "Update the research visual"
git push
```

Then repeat **Actions → Deploy to GitHub Pages → Run workflow**. Publishing is manual so a code push by itself does not replace the public visual. If the header or social graphic changes, regenerate the images with `npm run export:social` while the local dev server is running before committing.

## Reference

- [GitHub: configuring the publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [GitHub: using custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Vite: GitHub Pages deployment](https://vite.dev/guide/static-deploy#github-pages)
