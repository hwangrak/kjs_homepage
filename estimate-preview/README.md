# KJS estimator browser preview v0.5.0

Public preview route: `/estimate/`.

The twenty `part-XX.txt` files concatenate to one base64-encoded Brotli archive of the existing standalone v0.5.0 HTML. They are a transfer format, not encrypted data. `node build-estimate-preview.mjs` reconstructs `dist/estimate/index.html` using only Node built-ins and stops on a byte-count or SHA-256 mismatch. No external download is required for this preview.

Expected reconstructed length: 398502 bytes.
SHA-256: fc65082c74d54fa9c9a3b033956121cf403b617886dfac3770dca7a08d798e3d

The existing homepage build and validation then run unchanged. Existing homepage pages, navigation and business content are not edited. No estimator link is added to the public navigation.

The browser-only estimator has no operating login, cloud storage, customer messaging, or external API requests. Use sample data only. Saved drafts remain in this browser, and clearing browser data removes them. Prices and wages remain explicitly labelled as research/reference values, not verified official current rates. No customer database, credentials, or font files are included.

Deployment-only adjustments to the original standalone HTML: noindex/nofollow/noarchive and no-referrer metadata; mobile-preview title; removal of the missing manifest link; equivalent JavaScript escape for template h1 markup so the homepage static validator does not miscount it; accessible noscript heading. Calculator, catalog and UI functionality are unchanged.
