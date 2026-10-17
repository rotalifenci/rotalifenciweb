const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\my pc\\.gemini\\antigravity\\brain\\76e370d0-33ce-4a14-8375-08210d748d8a';

const copies = [
    { src: path.join(brainDir, 'atmospheric_weather_events_1792258217772.jpg'), dst: 'slide_14_weather.jpg' }
];

const targetDirs = [
    'public/assets/slides',
    'assets/slides',
    '../public/assets/slides',
    '../assets/slides'
];

copies.forEach(({ src, dst }) => {
    if (fs.existsSync(src)) {
        targetDirs.forEach(dir => {
            const destPath = path.join(dir, dst);
            fs.copyFileSync(src, destPath);
            console.log(`Copied ${dst} -> ${destPath}`);
        });
    }
});
