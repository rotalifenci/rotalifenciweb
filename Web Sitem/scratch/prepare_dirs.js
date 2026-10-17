const fs = require('fs');
const path = require('path');

const dirs = [
    'public/assets/slides',
    'assets/slides',
    '../public/assets/slides',
    '../assets/slides'
];

dirs.forEach(d => {
    fs.mkdirSync(d, { recursive: true });
    console.log('Created directory:', d);
});
