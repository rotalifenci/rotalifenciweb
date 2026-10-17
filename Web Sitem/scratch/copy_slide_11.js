const fs = require('fs');
const path = require('path');

const src = 'C:\\Users\\my pc\\.gemini\\antigravity\\brain\\76e370d0-33ce-4a14-8375-08210d748d8a\\earth_sun_distance_perspective_1792259676959.jpg';
const dstDirs = [
    'public/assets/slides',
    'assets/slides',
    '../public/assets/slides',
    '../assets/slides'
];

if (fs.existsSync(src)) {
    dstDirs.forEach(dir => {
        const dest = path.join(dir, 'slide_11_perspective.jpg');
        fs.copyFileSync(src, dest);
        console.log('Copied to:', dest);
    });
} else {
    console.log('Source not found:', src);
}
