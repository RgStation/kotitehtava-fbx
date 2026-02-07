import * as THREE from "https://unpkg.com/three@0.126.0/build/three.module.js";
import { ARButton } from "https://unpkg.com/three@0.126.0/examples/jsm/webxr/ARButton.js";
import { GLTFLoader } from "https://unpkg.com/three@0.126.0/examples/jsm/loaders/GLTFLoader.js";

let scene, camera, renderer;

init();

function init() {

  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.01,
    20
  );

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.xr.enabled = true;
  document.body.appendChild(renderer.domElement);

  // Valot (tärkeä AR:ssa)
  scene.add(new THREE.AmbientLight(0xffffff, 2));

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(1, 2, 3);
  scene.add(dirLight);

  // 🔥 GLB DONITSI
  const loader = new GLTFLoader();
  loader.load(
    "/fbx/donut.glb",
    (gltf) => {
      const donut = gltf.scene;

      donut.scale.set(0.005, 0.005, 0.005); // juuri sopiva AR:ään
      donut.position.set(0, -0.2, -0.3);       // suoraan kameran eteen

      scene.add(donut);
      console.log("DoughNut GLB loaded");
    },
    undefined,
    (error) => {
      console.error("GLB error:", error);
    }
  );

  // ARButton
  document.body.appendChild(ARButton.createButton(renderer));

  // Render loop
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
}
