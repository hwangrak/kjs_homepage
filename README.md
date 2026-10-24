# KJS Electric

Cloudflare Worker: `red-tooth-ccf5`

Build: `npm run build`
Deploy: `npx wrangler deploy`
Production branch: `main`

Source baseline: Sites version 16, commit 75738f73360b8abb92042acf5ac0cd79a852b9b9.

`build.mjs` downloads binary assets from the public KJS Sites origin and verifies each file against `assets-manifest.json`. Downloaded assets are deployed with the site to Cloudflare; visitors do not depend on the Sites origin. Builds require the source origin to stay publicly available. Update the manifest when replacing source images. Failed downloads or checksum mismatches stop deployment.

Cloudflare Git integration connected on 2026-10-24. Pushes to `main` trigger the production build and deployment.
Company contact and inquiry recipient: `info@kjs-elec.kr`.
