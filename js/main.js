import * as THREE from 'https://unpkg.com/three@0.126.0/build/three.module.js';
import { ARButton } from 'https://unpkg.com/three@0.126.0/examples/jsm/webxr/ARButton.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.126.0/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer;
let donut = null; // GLB-malli
let reticle;

init();

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.01, 20);

    renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1));

    document.body.appendChild(ARButton.createButton(renderer, { requiredFeatures:['hit-test'] }));

    // Reticle
    reticle = new THREE.Mesh(
        new THREE.RingGeometry(0.1,0.12,32).rotateX(-Math.PI/2),
        new THREE.MeshBasicMaterial({ color:0x00ff00 })
    );
    reticle.visible = false;
    scene.add(reticle);

    // GLB Loader
    const loader = new GLTFLoader();
    loader.load(
        'fbx/donut.glb',
        (gltf) => {
            donut = gltf.scene;
            donut.scale.set(0.005,0.005,0.005);
            donut.visible = false; // piilotetaan kunnes sijoitetaan reticlelle
            scene.add(donut);
            console.log("DONUT LOADED");
        },
        undefined,
        (err) => console.error("GLB error:", err)
    );

    renderer.setAnimationLoop(render);
}

function render(timestamp, frame) {
    if (frame && donut) {
        const session = renderer.xr.getSession();
        if (session) {
            // pakotetaan reticle näkyväksi (hit-test toteutus voi lisätä oikean paikan)
            reticle.visible = true;

            // sijoitetaan donitsi reticlelle automaattisesti
            donut.position.setFromMatrixPosition(reticle.matrix);
            donut.visible = true;
        }
    }
    renderer.render(scene,camera);
}
