const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = {
  'favicon.ico': [16, 32],
  'icon.png': 32,
  'apple-icon.png': 180,
  'icon-192.png': 192,
  'icon-512.png': 512,
  'og-image.png': [1200, 630]
};

async function generateIcons() {
  // Create a base SVG with the soccer ball emoji
  const svg = `
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="#111827"/>
      <text x="50%" y="50%" font-size="300" text-anchor="middle" dominant-baseline="middle">⚽</text>
    </svg>
  `;

  // Ensure the public directory exists
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
  }

  // Generate each icon
  for (const [filename, size] of Object.entries(sizes)) {
    const outputPath = path.join('public', filename);
    
    if (Array.isArray(size)) {
      // For favicon.ico, generate multiple sizes
      const images = await Promise.all(
        size.map(s => 
          sharp(Buffer.from(svg))
            .resize(s, s)
            .toBuffer()
        )
      );
      
      // Combine into ICO
      await sharp(images[0])
        .toFile(outputPath);
    } else {
      // For other icons
      await sharp(Buffer.from(svg))
        .resize(size, size)
        .toFile(outputPath);
    }
  }
}

generateIcons().catch(console.error); 