const fs = require('fs');
const seed = JSON.parse(fs.readFileSync('data/tubitak-seed-data.json', 'utf8'));
const store = JSON.parse(fs.readFileSync('data/tubitak-runtime-store.json', 'utf8'));

console.log('=== CHECKING ALL 3 PROJECTS FOR ALL STUDENTS ===');

Object.entries(seed.projects).forEach(([pId, proj]) => {
  console.log(`\n=================== PROJECT: ${pId} (${proj.title}) ===================`);
  const students = proj.studentTeam || [];
  const items = proj.items || [];
  const criteriaList = proj.criteriaList || [];

  students.forEach(stu => {
    let assigned = [];
    if (stu.range && Array.isArray(stu.range)) {
      assigned = items.slice(stu.range[0] - 1, stu.range[1]);
    } else {
      assigned = items.filter(it => it.assignedStudentId === stu.id);
    }

    let studentFilledTotal = 0;
    let startedItems = 0;
    let completedItems = 0;

    assigned.forEach(it => {
      const itemRecords = Object.entries(store.records).filter(([k, v]) => k.startsWith(it.id + '__'));
      const filled = itemRecords.filter(([k, v]) => v.content && v.content.trim().length > 0);
      if (filled.length > 0) startedItems++;
      if (filled.length >= criteriaList.length) completedItems++;
      studentFilledTotal += filled.length;
    });

    const totalPossible = assigned.length * criteriaList.length;
    const pct = totalPossible > 0 ? Math.round((studentFilledTotal / totalPossible) * 100) : 0;
    console.log(`Student: ${stu.name} (${stu.id}) - Range: [${stu.range ? stu.range.join('-') : 'N/A'}] | Assigned items: ${assigned.length} | Started: ${startedItems} | Completed: ${completedItems} | Filled: ${studentFilledTotal}/${totalPossible} (${pct}%)`);
  });
});
