# RouteIQ Frontend Staging Setup

## Static frontend build

```bash
npm install --registry=https://registry.npmjs.org/
npm run build
```

Deploy the `dist/` folder to Vercel, Netlify, Cloudflare Pages, or Render Static Site.

## Environment mode

For first staging pass, keep mock/API-safe mode. Do not enable paid map calls from frontend.

## Local Windows note

If npm tries to use an internal registry URL from an old lock file, delete `package-lock.json` and reinstall:

```powershell
npm config set registry https://registry.npmjs.org/
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm install --registry=https://registry.npmjs.org/
```
