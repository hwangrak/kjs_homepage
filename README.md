# KJS Electric

Cloudflare Worker: `red-tooth-ccf5`

Build: `npm run build`
Deploy: `npx wrangler deploy`
Production branch: `main`

Source baseline: Sites version 16, commit 75738f73360b8abb92042acf5ac0cd79a852b9b9.

`build.mjs` downloads binary assets from the public KJS Sites origin and verifies each file against `assets-manifest.json`. Downloaded assets are deployed with the site to Cloudflare; visitors do not depend on the Sites origin. Builds require the source origin to stay publicly available. Update the manifest when replacing source images. Failed downloads or checksum mismatches stop deployment.

Cloudflare Git integration connected on 2026-10-24. Pushes to `main` trigger the production build and deployment.
Company contact and inquiry recipient: `info@kjs-elec.kr`.

## 2026-11-12 photo consultation update

Home and contact pages now prioritize residential and small commercial photo inquiries. All pages include direct phone/Kakao actions, Busan service area and weekday consultation hours. Project reference photographs were removed; the 13 existing records remain as text cards and dialogs. No example small jobs or fabricated reviews were published.

`customer-reviews.json` intentionally starts empty. Publish an actual review only with `quote`, `region`, `buildingType`, `work`, `consent: true`, and `publish: true`. The home/contact review sections remain hidden until eligible records exist.

Canonical and sharing metadata use https://www.kjs-elec.kr. The existing /estimate/ build and binary-asset manifest are unchanged.
