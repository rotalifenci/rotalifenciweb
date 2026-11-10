const fs = require('fs');

const cssPath = 'css/styles.css';
let css = fs.readFileSync(cssPath, 'utf8');

const sIdx = css.indexOf('.district-polygon {');
const eIdx = css.indexOf('/* ========================================================================== */\n/* Vektörel Kültürel Atlas Modu', sIdx);

const newDistrictStyles = `.district-polygon {
  stroke: #9a6b3c;
  stroke-width: 1.2px;
  stroke-linejoin: round;
  stroke-linecap: round;
  transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  pointer-events: all;
}

.district-polygon:hover {
  fill: #fef08a !important;
  stroke: #d97706 !important;
  stroke-width: 2.5px !important;
  filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.75));
}

.district-polygon.selected-district {
  fill: #fde68a !important;
  stroke: #b45309 !important;
  stroke-width: 3.5px !important;
  filter: drop-shadow(0 0 16px rgba(217, 119, 6, 0.95));
}

.district-badge-group {
  display: block !important;
  pointer-events: none;
  user-select: none;
}

.district-svg-label {
  font-family: 'Cinzel', 'Playfair Display', serif;
  font-size: 11px;
  font-weight: 800;
  fill: #1e1b4b;
  paint-order: stroke fill;
  stroke: #ffffff;
  stroke-width: 3.5px;
  stroke-linejoin: round;
  letter-spacing: 0.3px;
}

.district-svg-count {
  font-family: 'Inter', sans-serif;
  font-size: 9px;
  font-weight: 800;
  fill: #b45309;
  paint-order: stroke fill;
  stroke: #ffffff;
  stroke-width: 2.5px;
}

.river-path {
  fill: none;
  stroke: #38bdf8;
  stroke-width: 2px;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.8;
  filter: drop-shadow(0 0 2px rgba(56, 189, 248, 0.5));
}
`;

css = css.substring(0, sIdx) + newDistrictStyles + css.substring(eIdx);
fs.writeFileSync(cssPath, css, 'utf8');
console.log('css/styles.css updated with authentic district polygon styles.');
