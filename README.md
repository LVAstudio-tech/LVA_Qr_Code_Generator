# LVA QR Code Generator

A Vite + React QR code utility for generating branded QR codes, saving URL history, and exporting PNG files for print workflows.

## Features

- URL input with live QR preview
- History sidebar (saved in localStorage)
- Foreground and background color controls
- Download QR as PNG

## Local Development

1. Install dependencies:
   npm install
2. Start dev server:
   npm run dev
3. Build production assets:
   npm run build

## GitHub Pages Deployment

This repository includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml`.

- Trigger: push to `main`
- Build output: `dist`
- Deployment target: GitHub Pages

For project-page hosting, Vite base path is configured to:

/LVA_Qr_Code_Generator/
