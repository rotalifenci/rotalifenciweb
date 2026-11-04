const sharp = require('sharp');

async function checkSlices() {
  const { data, info } = await sharp('public/assets/images/eren_raw.png')
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  [60, 120, 200, 300, 400, 480].forEach(y => {
    let str = '';
    for (let x = 0; x < w; x += 20) {
      const idx = (y * w + x) * 3;
      str += `[${x}:${data[idx]},${data[idx+1]},${data[idx+2]}] `;
    }
    console.log('y=' + y + ':', str);
  });
}
checkSlices();
