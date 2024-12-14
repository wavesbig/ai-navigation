const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_ICON = path.join(__dirname, '../public/icon-source.png');
const PUBLIC_DIR = path.join(__dirname, '../public');

async function generateIcons() {
  if (!fs.existsSync(SOURCE_ICON)) {
    console.error('Source icon not found:', SOURCE_ICON);
    process.exit(1);
  }

  const sizes = {
    'favicon.ico': 32,
    'apple-touch-icon.png': 180,
    'icon-192x192.png': 192,
    'icon-512x512.png': 512,
  };

  for (const [filename, size] of Object.entries(sizes)) {
    const outputPath = path.join(PUBLIC_DIR, filename);
    
    if (filename === 'favicon.ico') {
      await sharp(SOURCE_ICON)
        .resize(size, size)
        .toFormat('ico')
        .toFile(outputPath);
    } else {
      await sharp(SOURCE_ICON)
        .resize(size, size)
        .png()
        .toFile(outputPath);
    }
    
    console.log(`Generated ${filename} (${size}x${size})`);
  }
}

generateIcons().catch(console.error); 