import * as THREE from 'https://unpkg.com/three@0.126.0/build/three.module.js';
import { ARButton } from 'https://unpkg.com/three@0.126.0/examples/jsm/webxr/ARButton.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.126.0/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, reticle;

init();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1));

    // ARButton
    document.body.appendChild(ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] }));

    // GLB Loader
    const loader = new GLTFLoader();
    let donut;
    loader.load(
        'fbx/donut.glb',
        (gltf) => { donut = gltf.scene; donut.scale.set(0.005, 0.005, 0.005); },
        undefined,
        (err) => console.error(err)
    );

    // Reticle (paikka mihin asetetaan objekti)
    reticle = new THREE.Mesh(
        new THREE.RingGeometry(0.1, 0.12, 32).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    reticle.visible = false;
    scene.add(reticle);

    const controller = renderer.xr.getController(0);
    controller.addEventListener('select', () => {
        if (donut && reticle.visible) {
            donut.position.setFromMatrixPosition(reticle.matrix);
            scene.add(donut);
        }
    });
    scene.add(controller);

    renderer.setAnimationLoop(render);
}

function render(timestamp, frame) {
    if (frame) {
        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();

        if (session) {
            const viewerSpace = renderer.xr.getReferenceSpace();
            session.requestAnimationFrame(() => {});

            // Tähän voisi lisätä hit-test logiikan reticlelle (Three.js ARButton tekee tämän)
            reticle.visible = true; // pakotetaan näkyviin testissä
        }
    }

    renderer.render(scene, camera);
}
