import * as THREE from 'https://unpkg.com/three@0.126.0/build/three.module.js';
import { ARButton } from 'https://unpkg.com/three@0.126.0/examples/jsm/webxr/ARButton.js';
import { FBXLoader } from 'https://unpkg.com/three@0.126.0/examples/jsm/loaders/FBXLoader.js';

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

    // FBX Loader – DoughNut
    const loader = new FBXLoader();
    loader.load(
        "../fbx/Cartoon_boy.fbx", // polku js-kansiosta fbxiin
        function(object) {
            object.scale.set(0.0025, 0.05, 0.05); // SUPER pieni
            object.position.set(0, 0, -1);          // todella lähellä kameraa
            scene.add(object);
            console.log("DoughNut FBX loaded:", object);
        },
        function(xhr) { console.log((xhr.loaded / xhr.total * 100) + "% loaded"); },
        function(error) { console.log("Error loading FBX:", error); }
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
