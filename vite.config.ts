import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = env.VITE_SITE_URL?.replace(/\/$/, "");
  if (
    siteUrl &&
    !/^https:\/\/[a-z\d.-]+(?::\d+)?(?:\/[a-z\d/_-]*)?$/i.test(siteUrl)
  ) {
    throw new Error(
      "VITE_SITE_URL must be a public HTTPS URL without query parameters.",
    );
  }
  return {
    base: siteUrl ? `${new URL(siteUrl).pathname.replace(/\/$/, "")}/` : "./",
    plugins: [
      react(),
      {
        name: "social-metadata",
        transformIndexHtml(html) {
          if (!siteUrl) return html;
          return html.replace(
            "</head>",
            `\n<link rel="canonical" href="${siteUrl}/" />\n<meta property="og:url" content="${siteUrl}/" />\n<meta property="og:image" content="${siteUrl}/social-preview.png" />\n<meta name="twitter:image" content="${siteUrl}/social-preview.png" />\n</head>`,
          );
        },
      },
    ],
  };
});
