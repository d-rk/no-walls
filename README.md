# No Walls

Firefox extension (Android + desktop) that adds a "Ganzer Artikel" button to paywalled
news articles. The button opens the newest snapshot on archive.is.

Paywalls are detected via the schema.org flag `"isAccessibleForFree": false`.

**Install:** https://d-rk.github.io/no-walls/ (password protected)

## Development

```
npx web-ext run                      # desktop Firefox
npx web-ext run -t firefox-android --adb-device <id> --firefox-apk org.mozilla.firefox
npx web-ext lint
```

## Release

```
git tag v0.2.0 && git push origin v0.2.0
```

The `release` workflow sets the manifest version from the tag, signs the extension
as **unlisted** on addons.mozilla.org (it's never listed publicly) and deploys it to
GitHub Pages. The install page, `.xpi` and `updates.json` live in a folder named
`sha256(SITE_PASSWORD)`; the start page asks for the password and redirects there.
Installed copies update themselves.

Required repo secrets: `AMO_JWT_ISSUER`, `AMO_JWT_SECRET`
(from https://addons.mozilla.org/developers/addon/api/key/) and `SITE_PASSWORD`.
Changing the password moves the folder, so previously installed copies stop
getting updates until reinstalled.
