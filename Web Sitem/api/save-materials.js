// Vercel Serverless Function: api/save-materials.js
// Delegates directly to api/sync.js for permanent Gist + GitHub repo persistence
module.exports = require("./sync.js");
