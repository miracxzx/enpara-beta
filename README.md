# Enpara Beta PWA

Ekran goruntulerindeki iki temel mobil bankacilik ekranini referans alarak hazirlanmis statik demo web uygulamasi.

## Ozellikler

- Mobil odakli tek sayfa deneyim
- Iki ekran arasi gecis: `En Ozet` ve `SWIFT Transfer Detayi`
- `manifest.webmanifest` ile ana ekrana eklenebilir PWA yapisi
- `sw.js` ile temel offline cache
- GitHub Pages uyumlu goreli asset yolları

## Gelistirme

```powershell
npm.cmd run build
```

Build sonrasi cikti `dist/` klasorune yazilir.

## Pages yayinlama

Bu repo icindeki workflow, `main` branch'ine push geldikten sonra `dist/` ciktisini GitHub Pages'e deploy eder.
