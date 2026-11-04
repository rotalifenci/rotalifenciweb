const THREE = require('three');
const fs = require('fs');

global.FileReader = class FileReader {
  readAsArrayBuffer(blob) {
    if (blob && blob.arrayBuffer) {
      blob.arrayBuffer().then(ab => {
        this.result = ab;
        if (this.onloadend) this.onloadend();
      });
    } else {
      this.result = blob instanceof ArrayBuffer ? blob : new ArrayBuffer(0);
      if (this.onloadend) this.onloadend();
    }
  }
};

const { GLTFExporter } = require('three/examples/jsm/exporters/GLTFExporter.js');

async function testExport() {
  const scene = new THREE.Scene();
  const mat = new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.5 });
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat);
  scene.add(mesh);

  const exporter = new GLTFExporter();
  exporter.parse(scene, glb => {
    console.log('GLB exported successfully, byte length:', glb.byteLength);
  }, err => console.error(err), { binary: true });
}

testExport();
