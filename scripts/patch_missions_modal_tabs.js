// scripts/patch_missions_modal_tabs.js
const fs = require('fs');
let html = fs.readFileSync('oyunlar/kozmik-kasif-3d.html', 'utf8');

// Update modal header text and total count
html = html.replace('10 Bilimsel Araştırma Görevini Tamamla, Resmi Kâşif Sertifikanı Al!', '20 Ay Krateri ve Fen Görevlerini Tamamla, Resmi Kâşif Sertifikanı Al!');
html = html.replace('<strong class="text-amber-400 font-orbitron" id="modal-completed-count">0</strong> / 10', '<strong class="text-amber-400 font-orbitron" id="modal-completed-count">0</strong> / 27');

const oldOpenMissionsModalRegex = /function openMissionsModal\(\) \{[\s\S]*?function goToMissionStation\(stationName, missionId\) \{[\s\S]*?openQuestionModal\(missionId\);\s*\}, 300\);\s*\}/;

const newOpenMissionsModalCode = `let currentMissionFilter = 'all';

        function setMissionFilter(filter) {
            currentMissionFilter = filter;
            renderMissionsList();
        }

        function openMissionsModal() {
            playSound('beep');
            renderMissionsList();
            document.getElementById('modal-missions').classList.remove('hidden');
            document.getElementById('modal-missions').classList.add('flex');
        }

        function renderMissionsList() {
            const list = document.getElementById('missions-list-container');
            list.innerHTML = '';

            // Filter Tabs
            const tabsContainer = document.createElement('div');
            tabsContainer.className = 'flex flex-wrap gap-1.5 pb-2 border-b border-slate-800 text-xs font-bold';
            
            const tabs = [
                { id: 'all', label: 'Tümü (27)' },
                { id: 'moon', label: 'Ay Kraterleri (20)' },
                { id: 'sun', label: 'Güneş Gözlemevi (3)' },
                { id: 'orbit', label: 'Ay Evreleri (3)' },
                { id: 'scale', label: 'Kozmik Ölçek (1)' }
            ];

            tabs.forEach(t => {
                const btn = document.createElement('button');
                btn.className = 'px-3 py-1 rounded-xl transition-all cursor-pointer ' + (
                    currentMissionFilter === t.id 
                        ? 'bg-amber-500 text-slate-950 shadow-md font-black' 
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                );
                btn.innerText = t.label;
                btn.onclick = () => setMissionFilter(t.id);
                tabsContainer.appendChild(btn);
            });
            list.appendChild(tabsContainer);

            const filteredMissions = MISSIONS.filter(m => {
                if (currentMissionFilter === 'all') return true;
                return m.station === currentMissionFilter;
            });

            filteredMissions.forEach(m => {
                const isDone = completedMissions.has(m.id);
                const card = document.createElement('div');
                card.className = 'p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ' + (
                    isDone 
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-white' 
                        : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                );

                const badgeHtml = (isDone && m.shortAns) 
                    ? '<span class="inline-block mt-1 text-[10px] text-amber-300 font-bold bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-md">Kısa Cevap: ' + m.shortAns + '</span>' 
                    : '';

                card.innerHTML = \`
                    <div class="flex items-center gap-3 min-w-0">
                        <div class="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center font-bold text-sm \${
                            isDone ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                        }">
                            \${isDone ? '<i class="fa-solid fa-check"></i>' : m.id}
                        </div>
                        <div class="min-w-0">
                            <h4 class="font-bold text-xs sm:text-sm \${isDone ? 'text-emerald-300' : 'text-slate-200'} truncate">\${m.title}</h4>
                            <p class="text-[11px] text-slate-400 truncate">\${m.shortDesc}</p>
                            \${badgeHtml}
                        </div>
                    </div>
                    <button onclick="goToMissionStation('\${m.station}', \${m.id})" class="shrink-0 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 font-bold text-xs transition-all cursor-pointer">
                        \${isDone ? 'İncele' : 'Göreve Git'}
                    </button>
                \`;
                list.appendChild(card);
            });
        }

        function closeMissionsModal() {
            document.getElementById('modal-missions').classList.add('hidden');
            document.getElementById('modal-missions').classList.remove('flex');
        }

        function goToMissionStation(stationName, missionId) {
            closeMissionsModal();
            switchStation(stationName);
            if (stationName === 'moon' && typeof MOON_CRATERS !== 'undefined') {
                const targetCrater = MOON_CRATERS.find(c => c.id === missionId);
                if (targetCrater) {
                    rover.pos.set(targetCrater.x, 0.4 + getMoonTerrainHeight(targetCrater.x, targetCrater.z), targetCrater.z);
                    rover.speed = 0;
                    rover.angle = 0;
                    rover.yVel = 0;
                }
            }
            setTimeout(() => {
                openQuestionModal(missionId);
            }, 300);
        }`;

if (oldOpenMissionsModalRegex.test(html)) {
    html = html.replace(oldOpenMissionsModalRegex, newOpenMissionsModalCode);
    console.log('Successfully updated openMissionsModal and filter tabs.');
} else {
    console.warn('Could not match oldOpenMissionsModalRegex!');
}

fs.writeFileSync('oyunlar/kozmik-kasif-3d.html', html);
console.log('Saved changes.');
