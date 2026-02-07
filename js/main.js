import * as THREE from 'https://unpkg.com/three@0.126.0/build/three.module.js';
import { ARButton } from 'https://unpkg.com/three@0.126.0/examples/jsm/webxr/ARButton.js';
import { FBXLoader } from 'https://unpkg.com/three@0.126.0/examples/jsm/loaders/FBXLoader.js';

let scene, camera, renderer, donut;

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

    document.body.appendChild(ARButton.createButton(renderer));

    // FBX Loader
    const loader = new FBXLoader();
    loader.load(
        'fbx/DoughNut_FBX.fbx',
        (object) => {
            donut = object;
            donut.scale.set(0.005, 0.005, 0.005);
            donut.position.set(0, -0.2, -0.5);
            scene.add(donut);
            console.log("DONUT FBX loaded");
        },
        undefined,
        (err) => console.error("FBX error:", err)
    );

    renderer.setAnimationLoop(() => renderer.render(scene, camera));
}
