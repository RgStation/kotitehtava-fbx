import { ARButton } from "https://unpkg.com/three@0.126.0/examples/jsm/webxr/ARButton.js";
import { FBXLoader } from "https://unpkg.com/three@0.126.0/examples/jsm/loaders/FBXLoader.js";

let camera, scene, renderer;

init();
function init() {
    const container = document.createElement("div");
    document.body.appendChild(container);

    // 1. Create scene
    scene = new THREE.Scene();

    // 2. Create camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);

    // 3. Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);

    // 4. Load FBX model - tästä copypaste
    const modelURL = "../fbx/DoughNut_FBX.fbx";
    const fbxLoader = new FBXLoader();

    fbxLoader.load(
        modelURL,
        function (object) {
            object.scale.set(0.005, 0.005, 0.005);
            object.position.set(0, 0, -2);
            scene.add(object);
            console.log("FBX model loaded:", object);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + "% loaded");
        },
        function (error) {
            console.log("Error loading FBX:", error);
        }
    );


    // 5. Add light screen
    const light = new THREE.HemisphereLight(0xffffff, 0x999999, 2);
    light.position.set(1, 1, 0.25);
    scene.add(light);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(0, 10, 10);
    scene.add(dirLight);


    animate();
    function animate() {
        renderer.setAnimationLoop(render);
    }

    function render() {
        renderer.render(scene,camera);
    }

    const button = ARButton.createButton(renderer);
    document.body.appendChild(button);
}
