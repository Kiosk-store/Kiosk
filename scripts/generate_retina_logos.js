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

  // 2. Build prominent brand logo SVG with zero wasted padding and bold typography
  function buildLogoSvg(isDark) {
    const textColor = isDark ? '#ffffff' : '#090d16';
    const taglineColor = isDark ? '#60a5fa' : '#2563eb';
    
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 96" width="460" height="96" fill="none">
  <!-- Brand Emblem -->
  <g transform="translate(0, 0) scale(0.835)">
    <path d="${pathMatches[0]}" fill="#2563eb" />
    <path d="${pathMatches[1]}" fill="#2563eb" />
    <path d="${pathMatches[2]}" fill="#2563eb" />
    <path d="${pathMatches[3]}" fill="#2563eb" />
  </g>
  
  <!-- Wordmark 'KIOSK' -->
  <text x="100" y="61" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="68" letter-spacing="-0.035em" fill="${textColor}">KIOSK</text>
  
  <!-- Tagline -->
  <text x="102" y="87" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="700" font-size="17" letter-spacing="0.01em" fill="${taglineColor}">we help build your digital success story</text>
</svg>`;
  }

  const logoLightSvg = buildLogoSvg(false);
  const logoDarkSvg = buildLogoSvg(true);

  fs.writeFileSync('public/logo.svg', logoLightSvg);
  fs.writeFileSync('public/logo-dark.svg', logoDarkSvg);

  // 3. Render 4x Retina PNG from the vector SVG
  await sharp(Buffer.from(logoLightSvg), { density: 300 })
    .png()
    .toFile('public/logo.png');

  await sharp(Buffer.from(logoDarkSvg), { density: 300 })
    .png()
    .toFile('public/logo-dark.png');

  console.log('Successfully generated bold prominent Retina public/logo.png and public/logo-dark.png');
}

generate();
