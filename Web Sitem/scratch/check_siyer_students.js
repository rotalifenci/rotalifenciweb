const fs = require('fs');
const seed = JSON.parse(fs.readFileSync('data/tubitak-seed-data.json', 'utf8'));
const store = JSON.parse(fs.readFileSync('data/tubitak-runtime-store.json', 'utf8'));

const proj = seed.projects['proje-siyer'];
const students = proj.studentTeam || [];
const items = proj.items || [];

console.log('=== CHECKING SIYER PROJECT (571-632) ===');
console.log('Total items in siyer:', items.length);

students.forEach(stu => {
  const [startYear, endYear] = stu.range;
  const assigned = items.filter(it => it.year >= startYear && it.year <= endYear);
  
  let filledCount = 0;
  let startedCount = 0;
  
  assigned.forEach(it => {
    const itemRecords = Object.entries(store.records).filter(([k, v]) => k.startsWith(it.id + '__'));
    const filled = itemRecords.filter(([k, v]) => v.content && v.content.trim().length > 0);
    if (filled.length > 0) startedCount++;
    filledCount += filled.length;
  });
  console.log(`Student: ${stu.name} (${stu.id}) - Years [${startYear}-${endYear}] | Assigned: ${assigned.length} | Started: ${startedCount} | Filled records: ${filledCount}`);
});
