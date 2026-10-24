const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const sunPath = path.resolve(__dirname, '..', 'images', 'sun.jpg');
    const earthPath = path.resolve(__dirname, '..', 'images', 'earth.jpg');
    const moonPath = path.resolve(__dirname, '..', 'images', 'moon.jpg');

    const sun = fs.existsSync(sunPath) ? 'data:image/jpeg;base64,' + fs.readFileSync(sunPath).toString('base64') : '';
    const earth = fs.existsSync(earthPath) ? 'data:image/jpeg;base64,' + fs.readFileSync(earthPath).toString('base64') : '';
    const moon = fs.existsSync(moonPath) ? 'data:image/jpeg;base64,' + fs.readFileSync(moonPath).toString('base64') : '';

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    return res.status(200).json({ success: true, assets: { sun, earth, moon } });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
