const fs = require('fs');

['js/app.js', '../js/app.js'].forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  const regex = /<!--\s*Sağ Görsel Kart \(Günün Vitrini\)[\s\S]*?<!--\s*📊 EĞİTİM AĞI/m;
  
  const replacement = `<!-- Sağ Görsel Kart (Rotalı Fenci Tanıtım Afişi) -->
                    <div class="lg:col-span-5 relative w-full flex items-center justify-center">
                        <div class="relative w-full max-w-[520px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-200/80 bg-white group transition-all duration-300 hover:shadow-red-500/15 hover:scale-[1.01] cursor-pointer" onclick="window.open('assets/rotali-fenci-tanitim.jpg', '_blank')" title="Büyütmek için tıklayın">
                            <img src="assets/rotali-fenci-tanitim.jpg" alt="Rotalı Fenci - Rotamız Fen!" class="w-full h-auto object-cover rounded-2xl block" loading="eager">
                        </div>
                    </div>
                </div>

            </div>
        </section>

        <!-- 📊 EĞİTİM AĞI`;

  if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('SUCCESS:', filePath);
  } else {
    console.log('REGEX DID NOT MATCH:', filePath);
  }
});
