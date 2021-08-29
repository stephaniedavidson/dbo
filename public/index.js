import * as THREE from "https://cdn.skypack.dev/three";
// import threejsOrbitControls from "https://cdn.skypack.dev/threejs-orbit-controls";
// import GLTFLoader from "https://cdn.skypack.dev/three-gltf-loader";
import { GLTFLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js";
import "./modal.js";

//*******************************************//
//**************** THREE ********************//
//*******************************************//
// Canvas
const canvas = document.querySelector("canvas.webgl");

// SCENE
const scene = new THREE.Scene();

let tubeGltf;

// GLTF
new GLTFLoader().load(
    "rousseau_tube.gltf",
    (gltf) => {
        scene.add(gltf.scene);
        tubeGltf = gltf.scene;
        gltf.scene.scale.set(0.02, 0.02, 0.02);
        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
        console.log(error);
    }
);

// LIGHTS
const pointLight = new THREE.PointLight(0xffffff, 2, 100);
pointLight.position.set(0, 5, 0);
pointLight.distance = 30;
scene.add(pointLight);

// helper
const helperSize = 2;
const pointLightHelper = new THREE.PointLightHelper(pointLight, helperSize);
scene.add(pointLightHelper);

// SIZES
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// CAMERA
const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height, 1, 100);
camera.position.x = 0;
camera.position.y = 0;
scene.add(camera);

// Controls
// const controls = new threejsOrbitControls(camera, canvas);
// controls.enableDamping = true;
// controls.enableZoom = false; //sd
// controls.minPolarAngle = 1; //sd
// controls.maxPolarAngle = Math.PI / 2; //sd
// controls.minAzimuthAngle = -Math.PI / 2 + 2.5; //sd
// controls.maxAzimuthAngle = Math.PI / 2 + 0.5; //sd
// controls.target = new THREE.Vector3(0, 2, 0); //sd

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    // gltf.position.z = Math.sin(elapsedTime / 10);
    if (tubeGltf) {
        tubeGltf.position.z += elapsedTime / 100;
    }
    // controls.update();
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
