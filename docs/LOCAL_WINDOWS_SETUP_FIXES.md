# RouteIQ Local Windows Setup Fixes

## Problem 1: `unzip` not recognized

Use PowerShell:

```powershell
Expand-Archive -Path ".\RouteIQ_Productization_P37_to_P40_Final_MVP_Hardening_Build_Passed.zip" -DestinationPath ".\routeiq-final" -Force
```

## Problem 2: npm uses internal registry from sandbox lock file

Fix:

```powershell
npm config set registry https://registry.npmjs.org/
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm install --registry=https://registry.npmjs.org/
```

## Problem 3: UI appears like raw HTML

Fix Tailwind v3 locally:

```powershell
npm install -D tailwindcss@3.4.17 postcss@8.4.49 autoprefixer@10.4.20
Copy-Item ".\styles.css" ".\src\styles.css" -Force
npm run dev
```

## Correct run sequence

```powershell
cd "C:\Users\jiths\OneDrive\Desktop\RouteIQ\routeiq-final\RouteIQ_Productization_P37_to_P40_Final_MVP_Hardening_Build_Passed"
npm install --registry=https://registry.npmjs.org/
npm run build
npm run dev
```
