# Set up GitHub and publish the visual

The project is prepared for a GitHub repository named `MaggieGuanyuYang/PLOS_One_Paper_Distribution`. The local `main` branch contains the website, its BR-UK assets, and the GitHub Actions workflows. Local manuscripts, dependencies, build output and environment files are ignored by Git.

## 1. Create the repository

On [GitHub’s new repository page](https://github.com/new), use:

- **Owner:** `MaggieGuanyuYang`
- **Repository name:** `PLOS_One_Paper_Distribution`
- **Description:** `Interactive BR-UK research-to-action explorer based on Table 3 of Yang et al., PLOS One (2026).`
- **Visibility:** Public for GitHub Pages on a free account. Private repositories require an eligible paid plan for Pages.
- Leave the options to add a README, `.gitignore` and licence unchecked: the local project already contains its files and commit history.

Once the empty repository exists, connect and push the local project if this has not already been done:

```sh
cd '/Users/maggieyang/Desktop/ai coding/PLOS_One_Paper_Distribution'
git remote add origin https://github.com/MaggieGuanyuYang/PLOS_One_Paper_Distribution.git
git push -u origin main
```

If `origin` already exists, skip `git remote add origin`. The **Check website** workflow will build and test the pushed code. This check does not publish the website.

## 2. Enable GitHub Pages

1. Open the repository’s **Settings** tab.
2. Choose **Pages** in the left sidebar.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.

## 3. Publish the website

1. Open the repository’s **Actions** tab.
2. Select **Deploy to GitHub Pages** in the left sidebar.
3. Click **Run workflow**, keep the branch as **main**, then click the green **Run workflow** button.
4. Wait for the build, tests and deployment to show green checks. Open the website address shown by the deployment.

With this owner and repository name, the expected public address is:

**https://maggieguanyuyang.github.io/PLOS_One_Paper_Distribution/**

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
