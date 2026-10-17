const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\my pc\\.gemini\\antigravity\\brain\\76e370d0-33ce-4a14-8375-08210d748d8a';

const copies = [
    { src: path.join(brainDir, 'sun_surface_sunspots_1792258144012.jpg'), dst: 'slide_13_sunspots.jpg' },
    { src: path.join(brainDir, 'galileo_galilei_1610_telescope_1792258144520.jpg'), dst: 'slide_13_galileo.jpg' },
    { src: path.join(brainDir, 'sun_warming_earth_1792258145408.jpg'), dst: 'slide_14_sun_earth.jpg' },
    { src: path.join(brainDir, 'photosynthesis_visualization_1792258143942.jpg'), dst: 'slide_14_photosynthesis.jpg' },
    { src: path.join(brainDir, 'water_cycle_concept_art_1792258146264.jpg'), dst: 'slide_14_water_cycle.jpg' }
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
    } else {
        console.warn(`File not found yet: ${src}`);
    }
});
