======================================================
  KRYVLABS — HOW TO ADD YOUR LOGO & FAVICON
======================================================

DROP YOUR FILES HERE IN /public/ :

1. MAIN LOGO (shown in top-left header):
   File: /public/logo.png  (or logo.svg)
   Size: any, will be auto-sized to 28x28px
   → If file not found, falls back to "K" letter in teal

2. FAVICON (browser tab icon):
   File: /public/favicon.svg  → replace this file with your SVG logo
   OR
   File: /public/favicon.ico  → traditional .ico format (also works)
   → Update index.html line: <link rel="icon" ... href="/your-file" />

3. PWA APP ICONS (for "Add to Home Screen"):
   File: /public/icons/icon-192.png  → 192×192px PNG
   File: /public/icons/icon-512.png  → 512×512px PNG
   → These appear when users install KRYVLABS as a PWA on mobile

QUICK CHECKLIST:
  [ ] Put logo.png in /public/
  [ ] Replace favicon.svg with your actual SVG logo
  [ ] Add icon-192.png and icon-512.png to /public/icons/
  [ ] Deploy — done!

======================================================
