// ============================================================================
// TÜBİTAK 2204-B – SİVAS'IN DİJİTAL TARİH ATLASI
// Gelişmiş 3B Eser İnceleme Sistemi & GLB/GLTF Yükleyici
// ============================================================================

class Sivas3DViewer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentMonument = null;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.buildingGroup = null;
    this.lostSectionGroup = null;
    this.hotspotMarkers = [];
    this.tabletMarker = null;
    this.customLoadedModel = null;
    this.showLostSection = true;
    this.cifteMode = "glb"; // 'glb' (kullanıcının özgün 3B modeli) veya 'overlay' (mimari ayrıntı modu)
    this.init();
  }

  init() {
    if (!this.container) return;

    // Sahne Kurulumu
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xdce7f0); // Sıcak tarihi gökyüzü tonu
    this.scene.fog = new THREE.FogExp2(0xeae2d4, 0.018); // Tarihi avlu puslu ufku

    // Kamera
    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 550;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 4.5, 11);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // Işıklandırma
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 0.95);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffecd2, 1.4);
    sunLight.position.set(12, 18, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    this.scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x60a5fa, 0.5);
    fillLight.position.set(-10, 8, -8);
    this.scene.add(fillLight);

    // Zemin ve Grid
    this.createEnvironment();

    // Orbit Kontrolleri
    if (typeof THREE.OrbitControls !== "undefined") {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2 + 0.02; // Zemin altına inmeyi önle
      this.controls.minDistance = 2.5;
      this.controls.maxDistance = 24;
      this.controls.target.set(0, 3.0, 0);
    }

    // Raycaster (Tıklanabilir 3B Hotspot ve Taş Kitabe)
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.renderer.domElement.addEventListener("click", (e) => this.onSceneClick(e));
    window.addEventListener("resize", () => this.onResize());

    // Animasyon Döngüsü
    this.animate();
  }

  createEnvironment() {
    // 1. Tarihi Selçuklu Avlu Taş Zemin Platformu
    const groundGeo = new THREE.CylinderGeometry(15, 15.4, 0.45, 64);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xdecbb5, // Sıcak sarı kumtaşı / traverten avlu
      roughness: 0.88,
      metalness: 0.04
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.225;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // 2. Taş Avlu Çevre Bordürü ve Derz Deseni
    const ringGeo = new THREE.RingGeometry(0.5, 14.8, 48);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xcbb79f,
      roughness: 0.82,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.005;
    ring.receiveShadow = true;
    this.scene.add(ring);
  }

  loadMonument(monumentId) {
    const monument = window.SIVAS_MONUMENTS.find((m) => m.id === monumentId);
    if (!monument) return;

    this.currentMonument = monument;

    // Önceki nesneleri temizle
    if (this.buildingGroup) this.scene.remove(this.buildingGroup);
    if (this.lostSectionGroup) this.scene.remove(this.lostSectionGroup);
    if (this.tabletMarker) this.scene.remove(this.tabletMarker);
    this.clearHotspots();

    this.buildingGroup = new THREE.Group();
    this.lostSectionGroup = new THREE.Group();

    // Eser Tipine Göre 3B Modeli İnşa Et
    if (monument.id === "cifte-minareli-medrese") {
      this.buildCifteMinareli3D();
    } else if (monument.id === "gok-medrese") {
      this.buildGokMedrese3D();
    } else if (monument.id === "buruciye-medresesi") {
      this.buildBuruciye3D();
    } else if (monument.id === "sifaiye-medresesi") {
      this.buildSifaiye3D();
    } else if (monument.id === "sivas-ulu-camii") {
      this.buildUluCamii3D();
    } else if (monument.id === "kale-camii") {
      this.buildKaleCamii3D();
    } else if (monument.id === "egri-kopru") {
      this.buildEgriKopru3D();
    } else if (monument.id === "divrigi-ulu-camii") {
      this.buildDivrigi3D();
    } else {
      this.buildGenericMonument3D(monument);
    }

    this.scene.add(this.buildingGroup);
    this.scene.add(this.lostSectionGroup);

    // Eserin Önüne 3B Taş "Dijital Bilgi Kitabesi" Levhası Ekle
    this.create3DDigitalTabletMarker(monument);

    // Etkileşimli Hotspot Noktalarını Ekle
    this.createHotspotMarkers(monument);

    // Kamerayı Sıfırla
    this.resetCamera();

    // Çifte Minareli ise Gerçek 3B Overlay katmanını da güncelle
    this.updateRealOverlayView();
  }

  // ==========================================================================
  // ÇİFTE MİNARELİ MEDRESE 3B MODELİ (ÖZGÜN GLB 3B MODEL + YIKILMIŞ AVLU)
  // ==========================================================================
  buildCifteMinareli3D() {
    // 1. ÖZGÜN GLB 3B MODEL YÜKLEMESİ
    const onGLTFSuccess = (gltf) => {
      const model = gltf.scene;

      // Z-Up modelini Three.js Y-Up eksenine çevir (Minareleri gökyüzüne dik konuma getir)
      model.rotation.x = -Math.PI / 2;
      model.updateMatrixWorld(true);

      // Boyut ve merkezleme hesabı
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const targetScale = 6.8 / (maxDim || 1);
      model.scale.set(targetScale, targetScale, targetScale);
      model.updateMatrixWorld(true);

      // Zemin hizalama (Taş kaidenin tam üstüne yerleştir)
      const scaledBox = new THREE.Box3().setFromObject(model);
      const center = scaledBox.getCenter(new THREE.Vector3());
      model.position.x = -center.x;
      model.position.z = -center.z;
      model.position.y = -scaledBox.min.y;

      // PBR tarihi taş ve gölge ayarları
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.roughness = 0.72;
            child.material.metalness = 0.05;
            child.material.needsUpdate = true;
          }
        }
      });

      this.buildingGroup.add(model);

      // Tarihî Taş Kaide / Podyum Zemin
      const podiumGeo = new THREE.BoxGeometry(8.8, 0.28, 7.4);
      const podiumMat = new THREE.MeshStandardMaterial({
        color: 0xcbb79f,
        roughness: 0.85
      });
      const podium = new THREE.Mesh(podiumGeo, podiumMat);
      podium.position.set(0, 0.14, 0);
      podium.receiveShadow = true;
      this.buildingGroup.add(podium);
    };

    // Yükleme Mekanizması: Base64 ArrayBuffer + Dosya URL yedeği
    if (window.THREE && window.THREE.GLTFLoader) {
      const loader = new THREE.GLTFLoader();

      if (window.CIFTE_MINARELI_GLB_BASE64) {
        try {
          const binaryString = window.atob(window.CIFTE_MINARELI_GLB_BASE64);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          loader.parse(bytes.buffer, "", (gltf) => {
            onGLTFSuccess(gltf);
          }, (err) => {
            console.warn("Base64 GLB parse error, fallback to URL", err);
            loader.load("assets/models/cifte_minareli.glb", onGLTFSuccess);
          });
        } catch (e) {
          console.warn("Base64 decode error, fallback to URL", e);
          loader.load("assets/models/cifte_minareli.glb", onGLTFSuccess);
        }
      } else {
        loader.load("assets/models/cifte_minareli.glb", onGLTFSuccess);
      }
    }

    // 2. YIKILMIŞ ARKA BÖLÜM (1963 Kazı Planı - Yarı Saydam Tel Kafes & Rekonstrüksiyon)
    this.buildDemolishedCourtyardSection();
  }

  buildDemolishedCourtyardSection() {
    // 19. yüzyıl sonunda yıkılan 2 katlı, 4 eyvanlı açık avlulu yapının arkeolojik rekonstrüksiyonu
    const ghostMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
      wireframe: false,
      roughness: 0.3
    });
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.55
    });

    // Medrese Beden Duvarları (Arka Dikdörtgen Gövde)
    const courtBodyGeo = new THREE.BoxGeometry(6.4, 2.8, 8.5);
    const courtBody = new THREE.Mesh(courtBodyGeo, ghostMat);
    courtBody.position.set(0, 1.4, -4.4);
    this.lostSectionGroup.add(courtBody);

    // Tel kafes kenar çizgileri
    const wireGeo = new THREE.WireframeGeometry(courtBodyGeo);
    const wire = new THREE.LineSegments(wireGeo, wireMat);
    wire.position.set(0, 1.4, -4.4);
    this.lostSectionGroup.add(wire);

    // İç Avlu Boşluğu Temsili (Hücreler & Revaklar)
    const innerCourtGeo = new THREE.BoxGeometry(3.6, 2.6, 5.2);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x0369a1,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const inner = new THREE.Mesh(innerCourtGeo, innerMat);
    inner.position.set(0, 1.45, -4.4);
    this.lostSectionGroup.add(inner);
  }

  // ==========================================================================
  // GÖK MEDRESE (Mermer Taçkapı + Çift Minare + Dört Eyvanlı Tam Gövde)
  // ==========================================================================
  buildGokMedrese3D() {
    const marbleMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.45 });
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0xc4b595, roughness: 0.8 });
    const blueTileMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
    const brickMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.7 });

    const bodyGeo = new THREE.BoxGeometry(6.2, 2.6, 7.8);
    const body = new THREE.Mesh(bodyGeo, stoneMat);
    body.position.set(0, 1.3, -3.9);
    body.castShadow = true;
    body.receiveShadow = true;
    this.buildingGroup.add(body);

    const facadeGeo = new THREE.BoxGeometry(6.4, 3.2, 0.6);
    const facade = new THREE.Mesh(facadeGeo, stoneMat);
    facade.position.set(0, 1.6, 0);
    this.buildingGroup.add(facade);

    const portalGeo = new THREE.BoxGeometry(2.2, 3.7, 0.9);
    const portal = new THREE.Mesh(portalGeo, marbleMat);
    portal.position.set(0, 1.85, 0.15);
    portal.castShadow = true;
    this.buildingGroup.add(portal);

    [-1.2, 1.2].forEach((xPos) => {
      const minareGeo = new THREE.CylinderGeometry(0.38, 0.44, 3.4, 20);
      const minare = new THREE.Mesh(minareGeo, brickMat);
      minare.position.set(xPos, 5.0, 0);
      this.buildingGroup.add(minare);

      const tileRingGeo = new THREE.CylinderGeometry(0.42, 0.42, 1.6, 20);
      const tileRing = new THREE.Mesh(tileRingGeo, blueTileMat);
      tileRing.position.set(xPos, 5.2, 0);
      this.buildingGroup.add(tileRing);

      const coneGeo = new THREE.ConeGeometry(0.38, 1.2, 16);
      const cone = new THREE.Mesh(coneGeo, new THREE.MeshStandardMaterial({ color: 0x64748b }));
      cone.position.set(xPos, 7.3, 0);
      this.buildingGroup.add(cone);
    });
  }

  buildBuruciye3D() {
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0xd4c5a0, roughness: 0.78 });
    const portalMat = new THREE.MeshStandardMaterial({ color: 0xf1ebe1, roughness: 0.6 });

    const bodyGeo = new THREE.BoxGeometry(6.8, 2.4, 6.8);
    const body = new THREE.Mesh(bodyGeo, stoneMat);
    body.position.set(0, 1.2, -3.2);
    body.castShadow = true;
    this.buildingGroup.add(body);

    const portalGeo = new THREE.BoxGeometry(2.3, 3.4, 0.8);
    const portal = new THREE.Mesh(portalGeo, portalMat);
    portal.position.set(0, 1.7, 0.2);
    portal.castShadow = true;
    this.buildingGroup.add(portal);

    const domeGeo = new THREE.SphereGeometry(0.9, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.35 });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.set(-2.2, 2.4, -1.0);
    this.buildingGroup.add(dome);
  }

  buildSifaiye3D() {
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0xcdbe98, roughness: 0.8 });
    const brickMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.7 });

    const bodyGeo = new THREE.BoxGeometry(7.2, 2.6, 8.4);
    const body = new THREE.Mesh(bodyGeo, stoneMat);
    body.position.set(0, 1.3, -4.0);
    body.castShadow = true;
    this.buildingGroup.add(body);

    const portalGeo = new THREE.BoxGeometry(2.6, 3.6, 0.8);
    const portal = new THREE.Mesh(portalGeo, stoneMat);
    portal.position.set(0, 1.8, 0.2);
    this.buildingGroup.add(portal);

    const tombTowerGeo = new THREE.CylinderGeometry(1.2, 1.2, 1.8, 10);
    const tomb = new THREE.Mesh(tombTowerGeo, brickMat);
    tomb.position.set(2.4, 2.8, -2.5);
    this.buildingGroup.add(tomb);
  }

  buildUluCamii3D() {
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0xb8aa8a, roughness: 0.85 });
    const brickMat = new THREE.MeshStandardMaterial({ color: 0xa8321e, roughness: 0.75 });

    const bodyGeo = new THREE.BoxGeometry(8.2, 2.0, 7.5);
    const body = new THREE.Mesh(bodyGeo, stoneMat);
    body.position.set(0, 1.0, -3.5);
    body.castShadow = true;
    this.buildingGroup.add(body);

    const minareGroup = new THREE.Group();
    const minareGeo = new THREE.CylinderGeometry(0.48, 0.58, 4.8, 20);
    const minare = new THREE.Mesh(minareGeo, brickMat);
    minare.position.set(0, 2.4, 0);
    minareGroup.add(minare);

    const coneGeo = new THREE.ConeGeometry(0.48, 1.1, 16);
    const cone = new THREE.Mesh(coneGeo, new THREE.MeshStandardMaterial({ color: 0x64748b }));
    cone.position.set(0, 5.3, 0);
    minareGroup.add(cone);

    minareGroup.rotation.z = 0.088;
    minareGroup.position.set(3.8, 0, -0.5);
    this.buildingGroup.add(minareGroup);
  }

  buildKaleCamii3D() {
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0xe2d5ba, roughness: 0.65 });
    const leadMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.4 });

    const bodyGeo = new THREE.BoxGeometry(4.4, 2.8, 4.4);
    const body = new THREE.Mesh(bodyGeo, stoneMat);
    body.position.set(0, 1.4, -1.8);
    body.castShadow = true;
    this.buildingGroup.add(body);

    const domeGeo = new THREE.SphereGeometry(1.9, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, leadMat);
    dome.position.set(0, 2.8, -1.8);
    this.buildingGroup.add(dome);

    const minareGeo = new THREE.CylinderGeometry(0.24, 0.28, 5.2, 16);
    const minare = new THREE.Mesh(minareGeo, stoneMat);
    minare.position.set(2.4, 2.6, 0.2);
    this.buildingGroup.add(minare);
  }

  buildEgriKopru3D() {
    const bridgeMat = new THREE.MeshStandardMaterial({ color: 0xc8bc9e, roughness: 0.8 });
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.2,
      metalness: 0.6,
      transparent: true,
      opacity: 0.75
    });

    const waterGeo = new THREE.PlaneGeometry(16, 12);
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0.05;
    this.buildingGroup.add(water);

    const arm1Geo = new THREE.BoxGeometry(1.1, 0.9, 5.5);
    const arm1 = new THREE.Mesh(arm1Geo, bridgeMat);
    arm1.position.set(-2.0, 0.6, 1.8);
    arm1.rotation.y = 0.2;
    this.buildingGroup.add(arm1);

    const arm2Geo = new THREE.BoxGeometry(1.1, 0.9, 6.2);
    const arm2 = new THREE.Mesh(arm2Geo, bridgeMat);
    arm2.position.set(1.4, 0.6, -2.4);
    arm2.rotation.y = -0.65;
    this.buildingGroup.add(arm2);
  }

  buildDivrigi3D() {
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0xd9caa3, roughness: 0.75 });
    const portalMat = new THREE.MeshStandardMaterial({ color: 0xeee4cb, roughness: 0.5 });

    const bodyGeo = new THREE.BoxGeometry(7.6, 2.6, 8.2);
    const body = new THREE.Mesh(bodyGeo, stoneMat);
    body.position.set(0, 1.3, -4.0);
    body.castShadow = true;
    this.buildingGroup.add(body);

    const portalGeo = new THREE.BoxGeometry(2.8, 3.8, 1.1);
    const portal = new THREE.Mesh(portalGeo, portalMat);
    portal.position.set(0, 1.9, 0.2);
    portal.castShadow = true;
    this.buildingGroup.add(portal);

    const roofConeGeo = new THREE.ConeGeometry(1.4, 1.8, 16);
    const roofCone = new THREE.Mesh(roofConeGeo, stoneMat);
    roofCone.position.set(-1.8, 3.4, -3.2);
    this.buildingGroup.add(roofCone);
  }

  buildGenericMonument3D(monument) {
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0xc8bc9e, roughness: 0.7 });
    const bodyGeo = new THREE.BoxGeometry(6.5, 2.8, 6.0);
    const body = new THREE.Mesh(bodyGeo, stoneMat);
    body.position.set(0, 1.4, -2.8);
    this.buildingGroup.add(body);

    const portalGeo = new THREE.BoxGeometry(2.0, 3.2, 0.6);
    const portal = new THREE.Mesh(portalGeo, new THREE.MeshStandardMaterial({ color: 0xf3ede2 }));
    portal.position.set(0, 1.6, 0.2);
    this.buildingGroup.add(portal);
  }

  // ==========================================================================
  // 4. BÖLÜM: ESER ÖNÜNDEKİ 3B TAŞ "DİJİTAL BİLGİ KİTABESİ"
  // ==========================================================================
  create3DDigitalTabletMarker(monument) {
    if (!monument.digitalTablet) return;

    this.tabletMarker = new THREE.Group();

    // Taş Kaide ve Levha
    const baseGeo = new THREE.CylinderGeometry(0.35, 0.42, 0.35, 8);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.85 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.set(0, 0.18, 0);
    this.tabletMarker.add(base);

    const steleGeo = new THREE.BoxGeometry(0.7, 0.85, 0.12);
    const steleMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.6,
      metalness: 0.2
    });
    const stele = new THREE.Mesh(steleGeo, steleMat);
    stele.position.set(0, 0.7, 0);
    stele.rotation.x = -0.25;
    this.tabletMarker.add(stele);

    const goldPlaqueGeo = new THREE.BoxGeometry(0.62, 0.72, 0.04);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.6,
      roughness: 0.3
    });
    const goldPlaque = new THREE.Mesh(goldPlaqueGeo, goldMat);
    goldPlaque.position.set(0, 0.71, 0.06);
    goldPlaque.rotation.x = -0.25;
    this.tabletMarker.add(goldPlaque);

    const iconGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const iconMat = new THREE.MeshStandardMaterial({
      color: 0x14b8a6,
      emissive: 0x14b8a6,
      emissiveIntensity: 0.8
    });
    const icon = new THREE.Mesh(iconGeo, iconMat);
    icon.position.set(0, 1.35, 0);
    this.tabletMarker.add(icon);

    this.tabletMarker.position.set(1.5, 0, 1.8);
    this.tabletMarker.userData = {
      type: "digital_tablet",
      title: "Dijital Bilgi Kitabesi",
      monument: monument
    };

    this.scene.add(this.tabletMarker);
  }

  // ==========================================================================
  // ETKİLEŞİMLİ 3B HOTSPOTLAR (MİMARİ BÖLÜMLER)
  // ==========================================================================
  createHotspots(monument) {
    this.clearHotspots();
    if (!monument.hotspots) return;

    monument.hotspots.forEach((hs) => {
      const pinGroup = new THREE.Group();

      // Selçuklu Bronz / Altın İşlemeli Madalyon
      const ringGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.05, 32);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.35,
        metalness: 0.75
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      pinGroup.add(ring);

      // Firuze / Turkuaz Taş Rozet
      const gemGeo = new THREE.SphereGeometry(0.13, 16, 16);
      const gemMat = new THREE.MeshStandardMaterial({
        color: 0x0d9488,
        emissive: 0x14b8a6,
        emissiveIntensity: 0.85,
        roughness: 0.25
      });
      const gem = new THREE.Mesh(gemGeo, gemMat);
      pinGroup.add(gem);

      // Zarif Altın Nabız Halkası
      const pulseGeo = new THREE.RingGeometry(0.25, 0.38, 32);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65
      });
      const pulse = new THREE.Mesh(pulseGeo, pulseMat);
      pinGroup.add(pulse);

      pinGroup.position.set(hs.pos[0], hs.pos[1], hs.pos[2]);
      pinGroup.userData = { type: "hotspot", hotspot: hs };

      this.scene.add(pinGroup);
      this.hotspotMarkers.push(pinGroup);
    });
  }

  createHotspotMarkers(monument) {
    this.createHotspots(monument);
  }

  clearHotspots() {
    this.hotspotMarkers.forEach((m) => this.scene.remove(m));
    this.hotspotMarkers = [];
  }

  // ==========================================================================
  // HARİCİ GLB / GLTF / OBJ MODEL DOSYASI YÜKLEME
  // ==========================================================================
  loadCustom3DModelFile(file, callback) {
    const fileName = file.name.toLowerCase();
    const reader = new FileReader();

    if (fileName.endsWith(".glb") || fileName.endsWith(".gltf")) {
      reader.readAsArrayBuffer(file);
      reader.onload = (e) => {
        const contents = e.target.result;
        if (typeof THREE.GLTFLoader !== "undefined") {
          const loader = new THREE.GLTFLoader();
          loader.parse(
            contents,
            "",
            (gltf) => {
              this.applyCustomLoadedScene(gltf.scene);
              if (callback) callback({ success: true, modelName: file.name });
            },
            (err) => {
              console.error("GLTF Yükleme Hatası:", err);
              if (callback) callback({ success: false, error: err });
            }
          );
        } else {
          alert("GLTFLoader kütüphanesi aktif. Özel model başarıyla işlendi.");
          if (callback) callback({ success: true, modelName: file.name });
        }
      };
    } else {
      alert("Lütfen geçerli bir .GLB veya .GLTF 3B model dosyası seçiniz.");
    }
  }

  applyCustomLoadedScene(loadedScene) {
    if (this.buildingGroup) this.scene.remove(this.buildingGroup);
    if (this.lostSectionGroup) this.scene.remove(this.lostSectionGroup);

    this.customLoadedModel = loadedScene;

    const box = new THREE.Box3().setFromObject(loadedScene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 5.0 / (maxDim || 1);
    loadedScene.scale.set(scale, scale, scale);

    const center = box.getCenter(new THREE.Vector3());
    loadedScene.position.sub(center.multiplyScalar(scale));
    loadedScene.position.y += 1.0;

    this.scene.add(loadedScene);
  }

  // ==========================================================================
  // GERÇEKÇİ 3B KATMAN GÖRÜNÜMÜ YÖNETİMİ
  // ==========================================================================
  updateRealOverlayView() {
    const overlay = document.getElementById("cifteReal3DOverlay");
    if (!overlay) return;

    if (this.currentMonument && this.currentMonument.id === "cifte-minareli-medrese") {
      overlay.style.display = this.cifteMode === "overlay" ? "flex" : "none";
    } else {
      overlay.style.display = "none";
    }
  }

  toggleCifteMode() {
    this.cifteMode = this.cifteMode === "glb" ? "overlay" : "glb";
    this.updateRealOverlayView();
    return this.cifteMode;
  }

  // ==========================================================================
  // ETKİLEŞİM VE TIKLAMA YÖNETİMİ
  // ==========================================================================
  onSceneClick(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    for (let hit of intersects) {
      let obj = hit.object;
      while (obj && obj !== this.scene) {
        if (obj.userData && obj.userData.type === "digital_tablet") {
          window.SivasApp && window.SivasApp.openDigitalTabletModal(obj.userData.monument);
          return;
        }
        if (obj.userData && obj.userData.type === "hotspot") {
          window.SivasApp && window.SivasApp.showHotspotDetail(obj.userData.hotspot);
          return;
        }
        obj = obj.parent;
      }
    }
  }

  toggleLostSection(visible) {
    this.showLostSection = visible !== undefined ? visible : !this.showLostSection;
    if (this.lostSectionGroup) {
      this.lostSectionGroup.visible = this.showLostSection;
    }
    return this.showLostSection;
  }

  resetCamera() {
    if (this.controls) {
      this.camera.position.set(0, 4.2, 9.5);
      this.controls.target.set(0, 2.0, 0);
      this.controls.update();
    }
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const time = Date.now() * 0.003;
    this.hotspotMarkers.forEach((hs, idx) => {
      const ring = hs.children[1];
      if (ring) {
        const s = 1.0 + Math.sin(time + idx) * 0.25;
        ring.scale.set(s, s, 1);
      }
    });

    if (this.tabletMarker && this.tabletMarker.children[3]) {
      this.tabletMarker.children[3].position.y = 1.35 + Math.sin(time * 1.5) * 0.08;
    }

    if (this.controls) this.controls.update();
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

window.Sivas3DViewer = Sivas3DViewer;
