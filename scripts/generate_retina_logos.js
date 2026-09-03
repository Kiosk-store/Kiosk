const sharp = require('sharp');
const fs = require('fs');

async function generate() {
  // Read the 4 vector paths from kiosk_emblem.svg
  const emblemSvg = fs.readFileSync('public/kiosk_emblem.svg', 'utf8');
  const pathMatches = [...emblemSvg.matchAll(/<path d="([^"]+)"/g)].map(m => m[1]);
  
  console.log('Found paths:', pathMatches.length);
  
  // 1. Update public/kiosk_logo.svg with the razor-sharp vector emblem
  const cleanEmblemSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 106 115" fill="none">
  <path d="${pathMatches[0]}" fill="#2563eb" />
  <path d="${pathMatches[1]}" fill="#2563eb" />
  <path d="${pathMatches[2]}" fill="#2563eb" />
  <path d="${pathMatches[3]}" fill="#2563eb" />
</svg>`;
  fs.writeFileSync('public/kiosk_logo.svg', cleanEmblemSvg);
  console.log('Updated public/kiosk_logo.svg with clean vector paths');

  // 2. Build full brand logo SVG (Emblem + "KIOSK" + Tagline)
  // Dimensions: 520 x 120
  // Left: Emblem scaled to 100x108 at x=10, y=6
  // Right: Wordmark "KIOSK" at x=125, y=72
  // Bottom: Tagline at x=128, y=100
  function buildLogoSvg(isDark) {
    const textColor = isDark ? '#ffffff' : '#0f172a';
    const taglineColor = isDark ? '#93c5fd' : '#2563eb';
    
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 120" width="520" height="120" fill="none">
  <!-- Brand Emblem -->
  <g transform="translate(10, 6) scale(0.92)">
    <path d="${pathMatches[0]}" fill="#2563eb" />
    <path d="${pathMatches[1]}" fill="#2563eb" />
    <path d="${pathMatches[2]}" fill="#2563eb" />
    <path d="${pathMatches[3]}" fill="#2563eb" />
  </g>
  
  <!-- Wordmark 'KIOSK' -->
  <text x="126" y="74" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="64" letter-spacing="-0.03em" fill="${textColor}">KIOSK</text>
  
  <!-- Tagline -->
  <text x="128" y="102" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="600" font-size="16" letter-spacing="0.02em" fill="${taglineColor}">we help build your digital success story</text>
</svg>`;
  }

  const logoLightSvg = buildLogoSvg(false);
  const logoDarkSvg = buildLogoSvg(true);

  fs.writeFileSync('public/logo.svg', logoLightSvg);
  fs.writeFileSync('public/logo-dark.svg', logoDarkSvg);
  console.log('Generated public/logo.svg and public/logo-dark.svg');

  // 3. Render 4x Retina PNG from the vector SVG (1560 x 360) so it is 100% crystal-sharp on Retina displays
  await sharp(Buffer.from(logoLightSvg), { density: 300 })
    .png()
    .toFile('public/logo.png');

  await sharp(Buffer.from(logoDarkSvg), { density: 300 })
    .png()
    .toFile('public/logo-dark.png');

  console.log('Successfully generated razor-sharp Retina public/logo.png and public/logo-dark.png');
}

generate();
