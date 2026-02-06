import * as THREE from 'https://unpkg.com/three@0.126.0/build/three.module.js';
import { ARButton } from 'https://unpkg.com/three@0.126.0/examples/jsm/webxr/ARButton.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.126.0/examples/jsm/loaders/GLTFLoader.js';


let camera, scene, renderer;

init();

function init() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);

    // Valot
    const ambient = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(0, 10, 10);
    scene.add(dirLight);

    const loader = new GLTFLoader();
    loader.load(
      "../fbx/donut.glb", // polku js-kansiosta glb:hen
      function(gltf) {
        const object = gltf.scene;
        object.scale.set(0.005, 0.005, 0.005);  // voit säätää tarvittaessa
        object.position.set(0, 0, -0.3);        // lähellä kameraa
        scene.add(object);
        console.log("DoughNut GLB loaded:", object);
      },
      function(xhr) { console.log((xhr.loaded / xhr.total * 100) + "% loaded"); },
      function(error) { console.log("Error loading GLB:", error); }
    );


    // ARButton
    const button = ARButton.createButton(renderer);
    document.body.appendChild(button);

    // Render loop
    renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
    });

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
