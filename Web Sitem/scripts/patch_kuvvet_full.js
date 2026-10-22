const fs = require('fs');

let content = fs.readFileSync('oyunlar/kuvvet-laboratuvari.html', 'utf8');

// 1. Three scene background
content = content.replace(
    /scene\.background = new THREE\.Color\(0xf1f5f9\);/g,
    'scene.background = new THREE.Color(0x0c1427);'
);
content = content.replace(
    /scene\.fog = new THREE\.FogExp2\(0xf1f5f9, 0\.016\);/g,
    'scene.fog = new THREE.FogExp2(0x0c1427, 0.014);'
);

// 2. buildLabEnvironment
const oldBuildLab = `        function buildLabEnvironment() {
            // Taban grid ızgarası (Temiz açık mavi/gri hatlar)
            const gridHelper = new THREE.GridHelper(50, 50, 0x0284c7, 0xcbd5e1);
            gridHelper.position.y = 0.01;
            scene.add(gridHelper);

            // Parlak modern beyaz laboratuvar zemini
            const floorGeo = new THREE.PlaneGeometry(60, 60);
            const floorMat = new THREE.MeshStandardMaterial({
                color: 0xf8fafc,
                roughness: 0.25,
                metalness: 0.15
            });
            const floorMesh = new THREE.Mesh(floorGeo, floorMat);
            floorMesh.rotation.x = -Math.PI / 2;
            floorMesh.position.y = -0.01;
            floorMesh.receiveShadow = true;
            scene.add(floorMesh);

            // Laboratuvar Deney Masası / Pisti (Açık modern gümüş-beyaz yüzey)
            const benchGeo = new THREE.BoxGeometry(22, 0.6, 3.8);
            const benchMat = new THREE.MeshStandardMaterial({
                color: 0xe2e8f0,
                metalness: 0.2,
                roughness: 0.25
            });
            labBench = new THREE.Mesh(benchGeo, benchMat);
            labBench.position.set(0, 0.3, 0);
            labBench.receiveShadow = true;
            scene.add(labBench);

            // Masa üzeri cetvel / mesafe çizgileri
            const trackLineGeo = new THREE.PlaneGeometry(20, 0.08);
            const trackLineMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7 });
            const trackLine = new THREE.Mesh(trackLineGeo, trackLineMat);
            trackLine.rotation.x = -Math.PI / 2;
            trackLine.position.set(0, 0.61, 0);
            scene.add(trackLine);

            // 0 Noktası İşareti (Merkez)
            const centerMarkGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.02, 16);
            const centerMarkMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
            const centerMark = new THREE.Mesh(centerMarkGeo, centerMarkMat);
            centerMark.position.set(0, 0.62, 0);
            scene.add(centerMark);
        }`;

const newBuildLab = `        function buildLabEnvironment() {
            // Taban grid ızgarası (Neon mavi eksenler & koyu zemin çizgileri)
            const gridHelper = new THREE.GridHelper(50, 50, 0x0284c7, 0x1e293b);
            gridHelper.position.y = 0.01;
            scene.add(gridHelper);

            // Derin modern bilim laboratuvarı zemini
            const floorGeo = new THREE.PlaneGeometry(60, 60);
            const floorMat = new THREE.MeshStandardMaterial({
                color: 0x080f1e,
                roughness: 0.35,
                metalness: 0.35
            });
            const floorMesh = new THREE.Mesh(floorGeo, floorMat);
            floorMesh.rotation.x = -Math.PI / 2;
            floorMesh.position.y = -0.01;
            floorMesh.receiveShadow = true;
            scene.add(floorMesh);

            // Laboratuvar Deney Masası / Pisti (Derin teknolojik yüzey)
            const benchGeo = new THREE.BoxGeometry(22, 0.6, 3.8);
            const benchMat = new THREE.MeshStandardMaterial({
                color: 0x111c33,
                metalness: 0.3,
                roughness: 0.25
            });
            labBench = new THREE.Mesh(benchGeo, benchMat);
            labBench.position.set(0, 0.3, 0);
            labBench.receiveShadow = true;
            scene.add(labBench);

            // Masa üzeri cetvel / parlak neon kılavuz çizgisi
            const trackLineGeo = new THREE.PlaneGeometry(20, 0.08);
            const trackLineMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 });
            const trackLine = new THREE.Mesh(trackLineGeo, trackLineMat);
            trackLine.rotation.x = -Math.PI / 2;
            trackLine.position.set(0, 0.61, 0);
            scene.add(trackLine);

            // 0 Noktası İşareti (Merkez Parlak Altın Nokta)
            const centerMarkGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.02, 16);
            const centerMarkMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
            const centerMark = new THREE.Mesh(centerMarkGeo, centerMarkMat);
            centerMark.position.set(0, 0.62, 0);
            scene.add(centerMark);
        }`;

if (content.includes(oldBuildLab)) {
    content = content.replace(oldBuildLab, newBuildLab);
    console.log('✔ buildLabEnvironment updated');
} else {
    console.log('⚠ oldBuildLab exact match not found');
}

// 3. Child Character creation & Tug-of-war figures
const oldBuildTug = `        // 🪢 3D HALAT ÇEKME HALATI VE MERKEZ İŞARETİ
        function buildTugRope() {
            const tugGroup = new THREE.Group();

            // Halat silindiri
            const ropeGeo = new THREE.CylinderGeometry(0.09, 0.09, 16, 16);
            const ropeMat = new THREE.MeshStandardMaterial({
                color: 0xd97706,
                roughness: 0.8
            });
            ropeMesh = new THREE.Mesh(ropeGeo, ropeMat);
            ropeMesh.rotation.z = Math.PI / 2;
            ropeMesh.position.y = 1.0;
            ropeMesh.castShadow = true;
            tugGroup.add(ropeMesh);

            // Halatın ortasındaki Kırmızı Kurdele / Bayrak İşareti
            const flagGeo = new THREE.ConeGeometry(0.25, 0.6, 16);
            const flagMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c });
            tugFlagMesh = new THREE.Mesh(flagGeo, flagMat);
            tugFlagMesh.position.set(0, 1.4, 0);
            tugFlagMesh.rotation.z = Math.PI;
            tugGroup.add(tugFlagMesh);

            // Sol Takım Temsili Figürleri (Kırmızı)
            const redTeamGroup = new THREE.Group();
            redTeamGroup.position.set(-6, 0.6, 0);
            const figureGeo = (typeof THREE.CapsuleGeometry === 'function')
                ? new THREE.CapsuleGeometry(0.3, 0.8, 4, 8)
                : new THREE.CylinderGeometry(0.3, 0.3, 1.2, 8);
            const redMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
            for(let i=0; i<3; i++) {
                const fig = new THREE.Mesh(figureGeo, redMat);
                fig.position.set(-i * 0.9, 0.7, 0);
                fig.castShadow = true;
                redTeamGroup.add(fig);
            }
            tugGroup.add(redTeamGroup);

            // Sağ Takım Temsili Figürleri (Mavi)
            const blueTeamGroup = new THREE.Group();
            blueTeamGroup.position.set(6, 0.6, 0);
            const blueMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6 });
            for(let i=0; i<3; i++) {
                const fig = new THREE.Mesh(figureGeo, blueMat);
                fig.position.set(i * 0.9, 0.7, 0);
                fig.castShadow = true;
                blueTeamGroup.add(fig);
            }
            tugGroup.add(blueTeamGroup);

            tugGroup.position.set(0, 0, 0);
            tugGroup.visible = false;
            scene.add(tugGroup);
            window.tugGroup = tugGroup;
        }`;

const newBuildTug = `        // 🧒 3D ÇOCUK / ÇÖP ADAM KARAKTER ÜRETİCİ
        let redKids = [];
        let blueKids = [];
        let redTeamGroup, blueTeamGroup;

        function createChildFigure(teamColorHex, isRightTeam, kidIndex) {
            const kidGroup = new THREE.Group();

            const skinMat = new THREE.MeshStandardMaterial({ color: 0xfecba6, roughness: 0.6 });
            const shirtMat = new THREE.MeshStandardMaterial({ color: teamColorHex, roughness: 0.4 });
            const shortsMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
            const shoeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
            const capMat = new THREE.MeshStandardMaterial({ color: teamColorHex, roughness: 0.4 });
            const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });

            // 1. Gövde / Torso (Takım Tişörtü)
            const torsoGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.72, 12);
            const torso = new THREE.Mesh(torsoGeo, shirtMat);
            torso.position.y = 0.95;
            torso.castShadow = true;
            kidGroup.add(torso);

            // 2. Kafa / Head
            const headGeo = new THREE.SphereGeometry(0.27, 16, 16);
            const head = new THREE.Mesh(headGeo, skinMat);
            head.position.y = 1.48;
            head.castShadow = true;
            kidGroup.add(head);

            // 3. Şapka (Cap)
            const capDomeGeo = new THREE.SphereGeometry(0.28, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
            const capDome = new THREE.Mesh(capDomeGeo, capMat);
            capDome.position.y = 1.50;
            kidGroup.add(capDome);

            // Şapka Siperliği (Vizör - Rakip tarafa dönük)
            const visorGeo = new THREE.BoxGeometry(0.22, 0.03, 0.18);
            const visor = new THREE.Mesh(visorGeo, capMat);
            const visorOffset = isRightTeam ? -0.20 : 0.20;
            visor.position.set(visorOffset, 1.54, 0);
            visor.rotation.z = isRightTeam ? 0.25 : -0.25;
            kidGroup.add(visor);

            // 4. Gözler (Rakibe odaklanmış)
            const eyeGeo = new THREE.SphereGeometry(0.035, 8, 8);
            const eye1 = new THREE.Mesh(eyeGeo, eyeMat);
            const eye2 = new THREE.Mesh(eyeGeo, eyeMat);
            const eyeX = isRightTeam ? -0.22 : 0.22;
            eye1.position.set(eyeX, 1.50, 0.10);
            eye2.position.set(eyeX, 1.50, -0.10);
            kidGroup.add(eye1);
            kidGroup.add(eye2);

            // 5. Şort / Pantolon
            const shortsGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.26, 12);
            const shorts = new THREE.Mesh(shortsGeo, shortsMat);
            shorts.position.y = 0.58;
            kidGroup.add(shorts);

            // 6. Bacaklar (Halat çekme gergin basış açısı)
            const legGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.52, 8);
            // Ön bacak (Halata doğru)
            const frontLeg = new THREE.Mesh(legGeo, skinMat);
            frontLeg.position.set(isRightTeam ? -0.16 : 0.16, 0.28, 0.14);
            frontLeg.rotation.z = isRightTeam ? -0.32 : 0.32;
            frontLeg.castShadow = true;
            kidGroup.add(frontLeg);

            // Arka bacak (Geriye gerilmiş kuvvetli destek ayağı)
            const backLeg = new THREE.Mesh(legGeo, skinMat);
            backLeg.position.set(isRightTeam ? 0.22 : -0.22, 0.28, -0.14);
            backLeg.rotation.z = isRightTeam ? 0.42 : -0.42;
            backLeg.castShadow = true;
            kidGroup.add(backLeg);

            // Ayakkabılar (Spor ayakkabı)
            const shoeGeo = new THREE.BoxGeometry(0.22, 0.10, 0.13);
            const shoe1 = new THREE.Mesh(shoeGeo, shoeMat);
            shoe1.position.set(isRightTeam ? -0.26 : 0.26, 0.05, 0.14);
            kidGroup.add(shoe1);

            const shoe2 = new THREE.Mesh(shoeGeo, shoeMat);
            shoe2.position.set(isRightTeam ? 0.32 : -0.32, 0.05, -0.14);
            kidGroup.add(shoe2);

            // 7. Kollar & Eller (Halatı iki elle sımsıkı tutuyor)
            const armGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.52, 8);
            const arm1 = new THREE.Mesh(armGeo, shirtMat);
            arm1.position.set(isRightTeam ? -0.24 : 0.24, 0.96, 0.16);
            arm1.rotation.z = isRightTeam ? 1.25 : -1.25;
            kidGroup.add(arm1);

            const arm2 = new THREE.Mesh(armGeo, shirtMat);
            arm2.position.set(isRightTeam ? -0.24 : 0.24, 0.96, -0.16);
            arm2.rotation.z = isRightTeam ? 1.25 : -1.25;
            kidGroup.add(arm2);

            const handGeo = new THREE.SphereGeometry(0.075, 8, 8);
            const hand1 = new THREE.Mesh(handGeo, skinMat);
            hand1.position.set(isRightTeam ? -0.44 : 0.44, 0.96, 0.07);
            kidGroup.add(hand1);

            const hand2 = new THREE.Mesh(handGeo, skinMat);
            hand2.position.set(isRightTeam ? -0.44 : 0.44, 0.96, -0.07);
            kidGroup.add(hand2);

            // Geriye yaslanma açısı (Tug of war posture)
            kidGroup.rotation.z = isRightTeam ? 0.22 : -0.22;
            kidGroup.position.y = 0.05;

            kidGroup.userData = {
                baseZ: kidGroup.rotation.z,
                isRight: isRightTeam,
                index: kidIndex
            };

            return kidGroup;
        }

        // 🪢 3D HALAT ÇEKME HALATI VE MERKEZ İŞARETİ
        function buildTugRope() {
            const tugGroup = new THREE.Group();

            // Halat silindiri (Altın sarısı kalın halat)
            const ropeGeo = new THREE.CylinderGeometry(0.08, 0.08, 16, 16);
            const ropeMat = new THREE.MeshStandardMaterial({
                color: 0xf59e0b,
                roughness: 0.75,
                metalness: 0.1
            });
            ropeMesh = new THREE.Mesh(ropeGeo, ropeMat);
            ropeMesh.rotation.z = Math.PI / 2;
            ropeMesh.position.y = 1.0;
            ropeMesh.castShadow = true;
            tugGroup.add(ropeMesh);

            // Halatın ortasındaki Kırmızı Bayrak İşareti
            const flagGeo = new THREE.ConeGeometry(0.24, 0.6, 16);
            const flagMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c });
            tugFlagMesh = new THREE.Mesh(flagGeo, flagMat);
            tugFlagMesh.position.set(0, 1.4, 0);
            tugFlagMesh.rotation.z = Math.PI;
            tugGroup.add(tugFlagMesh);

            // Sol Takım: 3 Kırmızı Takım Çocuğu
            redTeamGroup = new THREE.Group();
            redTeamGroup.position.set(-2.5, 0.3, 0);
            redKids = [];
            for (let i = 0; i < 3; i++) {
                const kid = createChildFigure(0xef4444, false, i);
                kid.position.set(-i * 1.35, 0, 0);
                redKids.push(kid);
                redTeamGroup.add(kid);
            }
            tugGroup.add(redTeamGroup);

            // Sağ Takım: 3 Mavi Takım Çocuğu
            blueTeamGroup = new THREE.Group();
            blueTeamGroup.position.set(2.5, 0.3, 0);
            blueKids = [];
            for (let i = 0; i < 3; i++) {
                const kid = createChildFigure(0x0284c7, true, i);
                kid.position.set(i * 1.35, 0, 0);
                blueKids.push(kid);
                blueTeamGroup.add(kid);
            }
            tugGroup.add(blueTeamGroup);

            tugGroup.position.set(0, 0, 0);
            tugGroup.visible = false;
            scene.add(tugGroup);
            window.tugGroup = tugGroup;
        }`;

if (content.includes(oldBuildTug)) {
    content = content.replace(oldBuildTug, newBuildTug);
    console.log('✔ buildTugRope with cute child characters updated');
} else {
    console.log('⚠ oldBuildTug exact match not found');
}

// 4. Force Arrows and Billboard Labels (Never mirrored!)
const oldArrowsSection = `        // 🏹 3D VEKTÖR KUVVET OKLARI (Yeşil: Sağ, Kırmızı: Sol, Mavi: Bileşke)
        function buildForceArrows() {
            // 1. Sağa Kuvvet Oku (Yeşil: F₁)
            rightArrowGroup = create3DArrow(0x10b981, 'right');
            scene.add(rightArrowGroup);

            // 2. Sola Kuvvet Oku (Kırmızı: F₂)
            leftArrowGroup = create3DArrow(0xef4444, 'left');
            scene.add(leftArrowGroup);

            // 3. Bileşke Kuvvet Oku (Mavi: R)
            netArrowGroup = create3DArrow(0x3b82f6, 'net');
            scene.add(netArrowGroup);

            // 4. Hız Yönü Oku (Açık Camgöbeği: Modül 3 için)
            velocityArrowGroup = create3DArrow(0x38bdf8, 'velocity');
            velocityArrowGroup.visible = false;
            scene.add(velocityArrowGroup);
        }

        // Ok Objesi Üretici Fonksiyonu
        function create3DArrow(colorHex, type) {
            const arrowGroup = new THREE.Group();

            // Gövde (Silindir)
            const shaftGeo = new THREE.CylinderGeometry(0.08, 0.08, 1, 16);
            const shaftMat = new THREE.MeshStandardMaterial({ color: colorHex, emissive: colorHex, emissiveIntensity: 0.35 });
            const shaftMesh = new THREE.Mesh(shaftGeo, shaftMat);
            shaftMesh.rotation.z = -Math.PI / 2;
            shaftMesh.position.x = 0.5;
            arrowGroup.add(shaftMesh);
            arrowGroup.userData.shaft = shaftMesh;

            // Ok Ucu (Koni)
            const headGeo = new THREE.ConeGeometry(0.24, 0.55, 16);
            const headMat = new THREE.MeshStandardMaterial({ color: colorHex, emissive: colorHex, emissiveIntensity: 0.5 });
            const headMesh = new THREE.Mesh(headGeo, headMat);
            headMesh.rotation.z = -Math.PI / 2;
            headMesh.position.x = 1.0;
            arrowGroup.add(headMesh);
            arrowGroup.userData.head = headMesh;

            // Ok Değer Levhası (Canvas Texture)
            const labelGeo = new THREE.PlaneGeometry(1.6, 0.55);
            const labelMat = new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide });
            const labelMesh = new THREE.Mesh(labelGeo, labelMat);
            labelMesh.position.set(0.6, 0.5, 0);
            arrowGroup.add(labelMesh);
            arrowGroup.userData.label = labelMesh;

            arrowGroup.userData.type = type;
            arrowGroup.userData.color = colorHex;
            return arrowGroup;
        }`;

const newArrowsSection = `        // 🏹 3D VEKTÖR KUVVET OKLARI & DÜZ YAZAN BILLBOARD ETİKETLER
        let rightArrowLabel, leftArrowLabel, netArrowLabel, velocityArrowLabel;

        function createBillboardLabelMesh() {
            const geo = new THREE.PlaneGeometry(2.1, 0.65);
            const mat = new THREE.MeshBasicMaterial({ transparent: true, side: THREE.FrontSide, depthTest: false });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.renderOrder = 999;
            mesh.visible = false;
            scene.add(mesh);
            return mesh;
        }

        function buildForceArrows() {
            // 1. Sağa Kuvvet Oku (Yeşil: F₁)
            rightArrowGroup = create3DArrow(0x10b981, 'right');
            scene.add(rightArrowGroup);
            rightArrowLabel = createBillboardLabelMesh();

            // 2. Sola Kuvvet Oku (Kırmızı: F₂)
            leftArrowGroup = create3DArrow(0xef4444, 'left');
            scene.add(leftArrowGroup);
            leftArrowLabel = createBillboardLabelMesh();

            // 3. Bileşke Kuvvet Oku (Mavi: R)
            netArrowGroup = create3DArrow(0x3b82f6, 'net');
            scene.add(netArrowGroup);
            netArrowLabel = createBillboardLabelMesh();

            // 4. Hız Yönü Oku (Açık Camgöbeği: Modül 3 için)
            velocityArrowGroup = create3DArrow(0x38bdf8, 'velocity');
            velocityArrowGroup.visible = false;
            scene.add(velocityArrowGroup);
            velocityArrowLabel = createBillboardLabelMesh();
        }

        // Ok Objesi Üretici Fonksiyonu (Ok geometrisi; etiketler harici ve düzdür)
        function create3DArrow(colorHex, type) {
            const arrowGroup = new THREE.Group();

            // Gövde (Silindir)
            const shaftGeo = new THREE.CylinderGeometry(0.09, 0.09, 1, 16);
            const shaftMat = new THREE.MeshStandardMaterial({ color: colorHex, emissive: colorHex, emissiveIntensity: 0.35 });
            const shaftMesh = new THREE.Mesh(shaftGeo, shaftMat);
            shaftMesh.rotation.z = -Math.PI / 2;
            shaftMesh.position.x = 0.5;
            arrowGroup.add(shaftMesh);
            arrowGroup.userData.shaft = shaftMesh;

            // Ok Ucu (Koni)
            const headGeo = new THREE.ConeGeometry(0.26, 0.58, 16);
            const headMat = new THREE.MeshStandardMaterial({ color: colorHex, emissive: colorHex, emissiveIntensity: 0.5 });
            const headMesh = new THREE.Mesh(headGeo, headMat);
            headMesh.rotation.z = -Math.PI / 2;
            headMesh.position.x = 1.0;
            arrowGroup.add(headMesh);
            arrowGroup.userData.head = headMesh;

            arrowGroup.userData.type = type;
            arrowGroup.userData.color = colorHex;
            return arrowGroup;
        }`;

if (content.includes(oldArrowsSection)) {
    content = content.replace(oldArrowsSection, newArrowsSection);
    console.log('✔ buildForceArrows with separate billboard labels updated');
} else {
    console.log('⚠ oldArrowsSection exact match not found');
}

// 5. High-res text canvas texture
const oldTextCanvas = `        // 🎨 Dinamik Yazı Dokusu (Billboard Canvas Texture)
        function createTextCanvasTexture(text, color = '#ffffff', bgColor = '#0284c7') {
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 80;
            const ctx = canvas.getContext('2d');

            ctx.fillStyle = bgColor;
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(4, 4, 248, 72, 14);
            else ctx.rect(4, 4, 248, 72);
            ctx.fill();

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 4;
            if (ctx.roundRect) ctx.roundRect(4, 4, 248, 72, 14);
            ctx.stroke();

            ctx.fillStyle = color;
            ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, 128, 42);

            const texture = new THREE.CanvasTexture(canvas);
            texture.minFilter = THREE.LinearFilter;
            return texture;
        }`;

const newTextCanvas = `        // 🎨 Dinamik Yazı Dokusu (Yüksek Çözünürlüklü ve Düz Okunan Canvas Texture)
        function createTextCanvasTexture(text, color = '#ffffff', bgColor = '#0284c7') {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 128;
            const ctx = canvas.getContext('2d');

            ctx.clearRect(0, 0, 512, 128);

            // Yuvarlak köşeli zemin rozeti
            ctx.fillStyle = bgColor;
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(8, 8, 496, 112, 26);
            else ctx.rect(8, 8, 496, 112);
            ctx.fill();

            // Beyaz net kontur
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 6;
            if (ctx.roundRect) ctx.roundRect(8, 8, 496, 112, 26);
            ctx.stroke();

            // Metin (Kesinlikle düz ve ortalanmış)
            ctx.fillStyle = color;
            ctx.font = 'bold 50px "Plus Jakarta Sans", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, 256, 64);

            const texture = new THREE.CanvasTexture(canvas);
            texture.minFilter = THREE.LinearFilter;
            return texture;
        }`;

if (content.includes(oldTextCanvas)) {
    content = content.replace(oldTextCanvas, newTextCanvas);
    console.log('✔ createTextCanvasTexture updated');
} else {
    console.log('⚠ oldTextCanvas exact match not found');
}

// 6. updateArrowVisuals logic to place billboard labels directly facing camera
const oldUpdateArrows = `        // 🔄 OKLARI GÜNCELLE VE YÖNLENDİR
        function updateArrowVisuals() {
            const scaleFactor = 0.14; // Newton başına uzunluk

            if (LAB.currentModule === 2) {
                // Halat çekme modunda okları halata göre hizala
                rightArrowGroup.visible = false;
                leftArrowGroup.visible = false;
                netArrowGroup.visible = false;
                velocityArrowGroup.visible = false;
                return;
            }

            const boxPos = mainBoxMesh.position;

            // 1. Sağa Uygulanan Yeşil Ok (F₁)
            if (LAB.forceRight > 0) {
                rightArrowGroup.visible = true;
                const len = Math.max(0.6, LAB.forceRight * scaleFactor);
                rightArrowGroup.position.set(boxPos.x + 1.0, boxPos.y + 0.9, boxPos.z);
                rightArrowGroup.rotation.y = 0; // Sağa dönük

                rightArrowGroup.userData.shaft.scale.set(1, len, 1);
                rightArrowGroup.userData.shaft.position.x = len / 2;
                rightArrowGroup.userData.head.position.x = len;
                
                // Etiket
                rightArrowGroup.userData.label.material.map = createTextCanvasTexture(\`F₁ = \${LAB.forceRight} N\`, '#ffffff', '#047857');
                rightArrowGroup.userData.label.material.needsUpdate = true;
                rightArrowGroup.userData.label.position.x = len / 2;
            } else {
                rightArrowGroup.visible = false;
            }

            // 2. Sola Uygulanan Kırmızı Ok (F₂)
            if (LAB.forceLeft > 0) {
                leftArrowGroup.visible = true;
                const len = Math.max(0.6, LAB.forceLeft * scaleFactor);
                leftArrowGroup.position.set(boxPos.x - 1.0, boxPos.y + 0.9, boxPos.z);
                leftArrowGroup.rotation.y = Math.PI; // Sola dönük

                leftArrowGroup.userData.shaft.scale.set(1, len, 1);
                leftArrowGroup.userData.shaft.position.x = len / 2;
                leftArrowGroup.userData.head.position.x = len;

                leftArrowGroup.userData.label.material.map = createTextCanvasTexture(\`F₂ = \${LAB.forceLeft} N\`, '#ffffff', '#b91c1c');
                leftArrowGroup.userData.label.material.needsUpdate = true;
                leftArrowGroup.userData.label.position.x = len / 2;
            } else {
                leftArrowGroup.visible = false;
            }

            // 3. Bileşke Mavi Ok (R)
            const netF = LAB.forceRight - LAB.forceLeft;
            const netMag = Math.abs(netF);

            if (netMag > 0) {
                netArrowGroup.visible = true;
                const len = Math.max(0.7, netMag * scaleFactor);
                // Kutunun hemen üstünde göster
                netArrowGroup.position.set(boxPos.x, boxPos.y + 2.3, boxPos.z);
                netArrowGroup.rotation.y = netF > 0 ? 0 : Math.PI;

                netArrowGroup.userData.shaft.scale.set(1, len, 1);
                netArrowGroup.userData.shaft.position.x = len / 2;
                netArrowGroup.userData.head.position.x = len;

                const dirText = netF > 0 ? 'Sağa' : 'Sola';
                netArrowGroup.userData.label.material.map = createTextCanvasTexture(\`R = \${netMag} N \${dirText}\`, '#ffffff', '#1d4ed8');
                netArrowGroup.userData.label.material.needsUpdate = true;
                netArrowGroup.userData.label.position.x = len / 2;
            } else {
                netArrowGroup.visible = false;
            }

            // 4. Modül 3: Hız Yönü Oku (Hareket Vektörü vs Bileşke Kuvvet)
            if (LAB.currentModule === 3 && Math.abs(LAB.m3Velocity) > 0.05) {
                velocityArrowGroup.visible = true;
                const vLen = Math.min(3.5, Math.max(0.6, Math.abs(LAB.m3Velocity) * 0.4));
                velocityArrowGroup.position.set(boxPos.x, boxPos.y + 3.2, boxPos.z);
                velocityArrowGroup.rotation.y = LAB.m3Velocity > 0 ? 0 : Math.PI;

                velocityArrowGroup.userData.shaft.scale.set(1, vLen, 1);
                velocityArrowGroup.userData.shaft.position.x = vLen / 2;
                velocityArrowGroup.userData.head.position.x = vLen;

                const vDir = LAB.m3Velocity > 0 ? 'Sağa' : 'Sola';
                velocityArrowGroup.userData.label.material.map = createTextCanvasTexture(\`Hız: \${vDir}\`, '#ffffff', '#0284c7');
                velocityArrowGroup.userData.label.material.needsUpdate = true;
                velocityArrowGroup.userData.label.position.x = vLen / 2;
            } else {
                velocityArrowGroup.visible = false;
            }
        }`;

const newUpdateArrows = `        // 🔄 OKLARI VE ASLA TERS DÖNMEYEN DÜZ ETİKETLERİ GÜNCELLE
        function updateArrowVisuals() {
            const scaleFactor = 0.14; // Newton başına uzunluk

            if (LAB.currentModule === 2) {
                // Halat çekme modunda kutu oklarını gizle
                if (rightArrowGroup) rightArrowGroup.visible = false;
                if (leftArrowGroup) leftArrowGroup.visible = false;
                if (netArrowGroup) netArrowGroup.visible = false;
                if (velocityArrowGroup) velocityArrowGroup.visible = false;
                if (rightArrowLabel) rightArrowLabel.visible = false;
                if (leftArrowLabel) leftArrowLabel.visible = false;
                if (netArrowLabel) netArrowLabel.visible = false;
                if (velocityArrowLabel) velocityArrowLabel.visible = false;
                return;
            }

            const boxPos = mainBoxMesh.position;

            // 1. Sağa Uygulanan Yeşil Ok (F₁)
            if (LAB.forceRight > 0) {
                rightArrowGroup.visible = true;
                const len = Math.max(0.6, LAB.forceRight * scaleFactor);
                rightArrowGroup.position.set(boxPos.x + 1.0, boxPos.y + 0.9, boxPos.z);
                rightArrowGroup.rotation.y = 0; // Sağa dönük ok

                rightArrowGroup.userData.shaft.scale.set(1, len, 1);
                rightArrowGroup.userData.shaft.position.x = len / 2;
                rightArrowGroup.userData.head.position.x = len;
                
                // Etiket: Düz, simetrik/ters dönmeyen billboard
                if (rightArrowLabel) {
                    rightArrowLabel.visible = true;
                    rightArrowLabel.position.set(boxPos.x + 1.0 + len / 2, boxPos.y + 1.65, boxPos.z);
                    rightArrowLabel.material.map = createTextCanvasTexture(\`F₁ = \${LAB.forceRight} N\`, '#ffffff', '#047857');
                    rightArrowLabel.material.needsUpdate = true;
                    if (camera) rightArrowLabel.quaternion.copy(camera.quaternion);
                }
            } else {
                rightArrowGroup.visible = false;
                if (rightArrowLabel) rightArrowLabel.visible = false;
            }

            // 2. Sola Uygulanan Kırmızı Ok (F₂)
            if (LAB.forceLeft > 0) {
                leftArrowGroup.visible = true;
                const len = Math.max(0.6, LAB.forceLeft * scaleFactor);
                leftArrowGroup.position.set(boxPos.x - 1.0, boxPos.y + 0.9, boxPos.z);
                leftArrowGroup.rotation.y = Math.PI; // Sola dönük ok

                leftArrowGroup.userData.shaft.scale.set(1, len, 1);
                leftArrowGroup.userData.shaft.position.x = len / 2;
                leftArrowGroup.userData.head.position.x = len;

                // Etiket: Sola bakan ok üzerinde AMA ASLA TERS DÖNMEYEN DÜZ YAZI!
                if (leftArrowLabel) {
                    leftArrowLabel.visible = true;
                    leftArrowLabel.position.set(boxPos.x - 1.0 - len / 2, boxPos.y + 1.65, boxPos.z);
                    leftArrowLabel.material.map = createTextCanvasTexture(\`F₂ = \${LAB.forceLeft} N\`, '#ffffff', '#b91c1c');
                    leftArrowLabel.material.needsUpdate = true;
                    if (camera) leftArrowLabel.quaternion.copy(camera.quaternion);
                }
            } else {
                leftArrowGroup.visible = false;
                if (leftArrowLabel) leftArrowLabel.visible = false;
            }

            // 3. Bileşke Mavi Ok (R)
            const netF = LAB.forceRight - LAB.forceLeft;
            const netMag = Math.abs(netF);

            if (netMag > 0) {
                netArrowGroup.visible = true;
                const len = Math.max(0.7, netMag * scaleFactor);
                netArrowGroup.position.set(boxPos.x, boxPos.y + 2.3, boxPos.z);
                netArrowGroup.rotation.y = netF > 0 ? 0 : Math.PI;

                netArrowGroup.userData.shaft.scale.set(1, len, 1);
                netArrowGroup.userData.shaft.position.x = len / 2;
                netArrowGroup.userData.head.position.x = len;

                const dirText = netF > 0 ? 'Sağa' : 'Sola';
                const sign = netF > 0 ? 1 : -1;
                if (netArrowLabel) {
                    netArrowLabel.visible = true;
                    netArrowLabel.position.set(boxPos.x + (sign * len / 2), boxPos.y + 3.05, boxPos.z);
                    netArrowLabel.material.map = createTextCanvasTexture(\`R = \${netMag} N \${dirText}\`, '#ffffff', '#1d4ed8');
                    netArrowLabel.material.needsUpdate = true;
                    if (camera) netArrowLabel.quaternion.copy(camera.quaternion);
                }
            } else {
                netArrowGroup.visible = false;
                if (netArrowLabel) netArrowLabel.visible = false;
            }

            // 4. Modül 3: Hız Yönü Oku
            if (LAB.currentModule === 3 && Math.abs(LAB.m3Velocity) > 0.05) {
                velocityArrowGroup.visible = true;
                const vLen = Math.min(3.5, Math.max(0.6, Math.abs(LAB.m3Velocity) * 0.4));
                velocityArrowGroup.position.set(boxPos.x, boxPos.y + 3.2, boxPos.z);
                velocityArrowGroup.rotation.y = LAB.m3Velocity > 0 ? 0 : Math.PI;

                velocityArrowGroup.userData.shaft.scale.set(1, vLen, 1);
                velocityArrowGroup.userData.shaft.position.x = vLen / 2;
                velocityArrowGroup.userData.head.position.x = vLen;

                const vDir = LAB.m3Velocity > 0 ? 'Sağa' : 'Sola';
                if (velocityArrowLabel) {
                    velocityArrowLabel.visible = true;
                    velocityArrowLabel.position.set(boxPos.x, boxPos.y + 3.8, boxPos.z);
                    velocityArrowLabel.material.map = createTextCanvasTexture(\`Hız: \${vDir}\`, '#ffffff', '#0284c7');
                    velocityArrowLabel.material.needsUpdate = true;
                    if (camera) velocityArrowLabel.quaternion.copy(camera.quaternion);
                }
            } else {
                velocityArrowGroup.visible = false;
                if (velocityArrowLabel) velocityArrowLabel.visible = false;
            }
        }`;

if (content.includes(oldUpdateArrows)) {
    content = content.replace(oldUpdateArrows, newUpdateArrows);
    console.log('✔ updateArrowVisuals with non-mirrored labels updated');
} else {
    console.log('⚠ oldUpdateArrows exact match not found');
}

// 7. Modül 1 toggleM1Play and resetPhysicsBox
const oldResetPhysics = `        function resetPhysicsBox() {
            LAB.boxX = 0;
            LAB.boxVelocity = 0;
            LAB.boxAccel = 0;
            if (mainBoxMesh) mainBoxMesh.position.x = 0;
            updateArrowVisuals();
        }`;

const newResetPhysics = `        function toggleM1Play() {
            LAB.isSimPlaying = !LAB.isSimPlaying;
            const btn = document.getElementById('btn-m1-play');
            const txt = document.getElementById('btn-m1-play-text');
            const icon = document.getElementById('btn-m1-play-icon');
            if (LAB.isSimPlaying) {
                if (btn) btn.className = 'flex-1 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer';
                if (txt) txt.textContent = 'Durdur';
                if (icon) icon.className = 'fa-solid fa-pause';
            } else {
                if (btn) btn.className = 'flex-1 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer';
                if (txt) txt.textContent = 'Hareketi Başlat';
                if (icon) icon.className = 'fa-solid fa-play';
            }
        }

        function resetPhysicsBox() {
            LAB.boxX = 0;
            LAB.boxVelocity = 0;
            LAB.boxAccel = 0;
            LAB.isSimPlaying = false;
            if (mainBoxMesh) mainBoxMesh.position.x = 0;
            const btn = document.getElementById('btn-m1-play');
            const txt = document.getElementById('btn-m1-play-text');
            const icon = document.getElementById('btn-m1-play-icon');
            if (btn) btn.className = 'flex-1 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer';
            if (txt) txt.textContent = 'Hareketi Başlat';
            if (icon) icon.className = 'fa-solid fa-play';
            updateArrowVisuals();
        }`;

if (content.includes(oldResetPhysics)) {
    content = content.replace(oldResetPhysics, newResetPhysics);
    console.log('✔ toggleM1Play & resetPhysicsBox updated');
} else {
    console.log('⚠ oldResetPhysics exact match not found');
}

// 8. Update animate loop to heave kids and billboard labels
const oldAnimateLoop = `            // Modül 2 Halat Çekme Fizik İlerlemesi
            if (LAB.currentModule === 2 && LAB.isTugRunning) {
                const tugNet = LAB.tugBlue - LAB.tugRed; // Sağ (Mavi) - Sol (Kırmızı)
                const tugAccel = tugNet / 8; // Efektif halat kütlesi
                LAB.tugVelocity += tugAccel * delta;
                LAB.tugVelocity *= 0.98;
                LAB.tugRopeOffset += LAB.tugVelocity * delta;

                // Halat sınırları
                if (LAB.tugRopeOffset > 4.2) {
                    LAB.tugRopeOffset = 4.2;
                    concludeTugRace('mavi');
                } else if (LAB.tugRopeOffset < -4.2) {
                    LAB.tugRopeOffset = -4.2;
                    concludeTugRace('kirmizi');
                }

                if (ropeMesh) ropeMesh.position.x = LAB.tugRopeOffset;
                if (tugFlagMesh) tugFlagMesh.position.x = LAB.tugRopeOffset;
            }`;

const newAnimateLoop = `            // Modül 2 Halat Çekme Fizik İlerlemesi
            if (LAB.currentModule === 2) {
                if (LAB.isTugRunning) {
                    const tugNet = LAB.tugBlue - LAB.tugRed;
                    const tugAccel = tugNet / 8;
                    LAB.tugVelocity += tugAccel * delta;
                    LAB.tugVelocity *= 0.98;
                    LAB.tugRopeOffset += LAB.tugVelocity * delta;

                    // Halat sınırları
                    if (LAB.tugRopeOffset > 4.2) {
                        LAB.tugRopeOffset = 4.2;
                        concludeTugRace('mavi');
                    } else if (LAB.tugRopeOffset < -4.2) {
                        LAB.tugRopeOffset = -4.2;
                        concludeTugRace('kirmizi');
                    }

                    // Çocukların halat çekme gayreti animasyonu (heave & pull)
                    const timePhase = clock.getElapsedTime() * 7;
                    if (Array.isArray(redKids)) {
                        redKids.forEach((kid, i) => {
                            kid.rotation.z = -0.22 + Math.sin(timePhase + i * 0.4) * 0.06;
                        });
                    }
                    if (Array.isArray(blueKids)) {
                        blueKids.forEach((kid, i) => {
                            kid.rotation.z = 0.22 - Math.sin(timePhase + i * 0.4) * 0.06;
                        });
                    }
                }

                if (ropeMesh) ropeMesh.position.x = LAB.tugRopeOffset;
                if (tugFlagMesh) tugFlagMesh.position.x = LAB.tugRopeOffset;
                if (redTeamGroup) redTeamGroup.position.x = -2.5 + LAB.tugRopeOffset;
                if (blueTeamGroup) blueTeamGroup.position.x = 2.5 + LAB.tugRopeOffset;
            }`;

if (content.includes(oldAnimateLoop)) {
    content = content.replace(oldAnimateLoop, newAnimateLoop);
    console.log('✔ animate loop for kids updated');
} else {
    console.log('⚠ oldAnimateLoop exact match not found');
}

// 9. Ensure labels billboard every frame in animate()
const oldControlsUpdate = `            // Orbit kontrollerini güncelle
            if (controls && typeof controls.update === 'function') {
                try { controls.update(); } catch(e) {}
            }`;

const newControlsUpdate = `            // Orbit kontrollerini güncelle
            if (controls && typeof controls.update === 'function') {
                try { controls.update(); } catch(e) {}
            }

            // Düz yazan etiketleri kameraya her karede hizala (Asla ayna/ters dönmez)
            if (camera) {
                if (rightArrowLabel && rightArrowLabel.visible) rightArrowLabel.quaternion.copy(camera.quaternion);
                if (leftArrowLabel && leftArrowLabel.visible) leftArrowLabel.quaternion.copy(camera.quaternion);
                if (netArrowLabel && netArrowLabel.visible) netArrowLabel.quaternion.copy(camera.quaternion);
                if (velocityArrowLabel && velocityArrowLabel.visible) velocityArrowLabel.quaternion.copy(camera.quaternion);
            }`;

if (content.includes(oldControlsUpdate)) {
    content = content.replace(oldControlsUpdate, newControlsUpdate);
    console.log('✔ billboard labels camera alignment in animate loop updated');
} else {
    console.log('⚠ oldControlsUpdate exact match not found');
}

// 10. Update resetTugRace
const oldResetTug = `        function resetTugRace() {
            LAB.tugRopeOffset = 0;
            LAB.tugVelocity = 0;
            LAB.isTugRunning = false;
            if (ropeMesh) ropeMesh.position.x = 0;
            if (tugFlagMesh) tugFlagMesh.position.x = 0;
            const btn = document.getElementById('btn-tug-action');
            if (btn) btn.innerHTML = '<i class="fa-solid fa-play"></i> <span>Yarışmayı Başlat</span>';
            const res = document.getElementById('tug-result-announcement');
            if (res) res.classList.add('hidden');
        }`;

const newResetTug = `        function resetTugRace() {
            LAB.tugRopeOffset = 0;
            LAB.tugVelocity = 0;
            LAB.isTugRunning = false;
            if (ropeMesh) ropeMesh.position.x = 0;
            if (tugFlagMesh) tugFlagMesh.position.x = 0;
            if (redTeamGroup) redTeamGroup.position.x = -2.5;
            if (blueTeamGroup) blueTeamGroup.position.x = 2.5;
            if (Array.isArray(redKids)) redKids.forEach(k => k.rotation.z = -0.22);
            if (Array.isArray(blueKids)) blueKids.forEach(k => k.rotation.z = 0.22);
            const btn = document.getElementById('btn-tug-action');
            if (btn) btn.innerHTML = '<i class="fa-solid fa-play"></i> <span>Yarışmayı Başlat</span>';
            const res = document.getElementById('tug-result-announcement');
            if (res) res.classList.add('hidden');
        }`;

if (content.includes(oldResetTug)) {
    content = content.replace(oldResetTug, newResetTug);
    console.log('✔ resetTugRace updated');
} else {
    console.log('⚠ oldResetTug exact match not found');
}

fs.writeFileSync('oyunlar/kuvvet-laboratuvari.html', content, 'utf8');
console.log('🎉 ALL KUVVET LAB ENHANCEMENTS APPLIED SUCCESSFULLY!');
