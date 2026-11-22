const fs = require('fs');
const path = require('path');

const backupFiles = [
  'backups/gist-snapshot-1795370489523/tubitak-runtime-store.json',
  'backups/raw_gist_recovery.json',
  '../backups/tubitak-runtime-store-pre-92-backup.json',
  'backups/emergency-recovery-1794735732327/tubitak-runtime-store.json',
  '../backups/pre-recovery-2026-11-11/tubitak-runtime-store.json'
];

backupFiles.forEach(file => {
  if (fs.existsSync(file)) {
    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      const recs = data.records || (data.files && data.files['tubitak-runtime-store.json'] ? JSON.parse(data.files['tubitak-runtime-store.json'].content).records : {});
      const keys = Object.keys(recs || {});
      const filled = Object.values(recs || {}).filter(r => r.content && r.content.trim().length > 0);
      console.log(`File [${file}]: Total records: ${keys.length}, Filled: ${filled.length}`);
      
      // Check zeynep
      const zeynepFilled = filled.filter(r => r.studentId === 'stu-zeynep' || (r.studentName && r.studentName.includes('Zeynep')));
      console.log(`  Zeynep filled in [${file}]: ${zeynepFilled.length}`);
    } catch(e) {
      console.log(`File [${file}] parse error:`, e.message);
    }
  } else {
    console.log(`File [${file}] DOES NOT EXIST`);
  }
});
