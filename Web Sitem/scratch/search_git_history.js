const { execSync } = require('child_process');
const fs = require('fs');

console.log('=== SEARCHING GIT HISTORY FOR HISTORICAL SNAPSHOTS OF tubitak-runtime-store.json ===');

const logOutput = execSync('git log --format="%H|%ad|%s" --date=short -- data/tubitak-runtime-store.json', { encoding: 'utf8' });
const commits = logOutput.trim().split('\n').map(line => {
  const [hash, date, msg] = line.split('|');
  return { hash, date, msg };
});

console.log(`Found ${commits.length} commits affecting data/tubitak-runtime-store.json`);

// Check each commit for filled criteria of stu-zeynep and total records
commits.slice(0, 15).forEach((c, idx) => {
  try {
    const raw = execSync(`git show ${c.hash}:data/tubitak-runtime-store.json`, { maxBuffer: 50 * 1024 * 1024, encoding: 'utf8' });
    const json = JSON.parse(raw);
    const recs = json.records || {};
    const recKeys = Object.keys(recs);
    
    // Check zeynep filled
    let zeynepCount = 0;
    const zeynepItems = ['alacahan-camii', 'kangal-merkez-camii', 'cevre-kultur-sanat-evi', 'abdulvahabi-gazi-turbesi', 'muhurdarzade-konagi', 'semsi-sivasi-turbesi', 'yesil-konak', 'altinyayla-merkez-camii', 'seyh-coban-turbesi', 'abdi-aga-konagi', 'yildiz-koprusu', 'behram-pasa-hani', 'halil-rifat-pasa-koprusu'];
    
    const itemFilledMap = {};
    zeynepItems.forEach(id => {
      const filled = Object.entries(recs).filter(([k, v]) => k.startsWith(id + '__') && v.content && v.content.trim().length > 0);
      itemFilledMap[id] = filled.length;
      zeynepCount += filled.length;
    });

    console.log(`Commit ${c.hash.slice(0, 8)} (${c.date}) - Total recs: ${recKeys.length} | Zeynep filled: ${zeynepCount}`);
    if (zeynepCount > 103) {
      console.log(`  --> FOUND HIGHER COUNT IN ${c.hash}:`, itemFilledMap);
    }
  } catch(e) {
    console.log(`Error reading commit ${c.hash.slice(0, 8)}:`, e.message);
  }
});
