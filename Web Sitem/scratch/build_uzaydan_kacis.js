// scratch/build_uzaydan_kacis.js
// Complete standalone generator for uzaydan-kacis-3d.html
const fs = require('fs');
const path = require('path');
const gameData = require('./parts/game_data.js');
const roomData = require('./parts/room_puzzles.js');

const targetFile = path.join(__dirname, '..', 'oyunlar', 'uzaydan-kacis-3d.html');

console.log("Generating 8-Room 3D Escape Room into:", targetFile);