import * as THREE from "https://cdn.skypack.dev/three";
import threejsOrbitControls from "https://cdn.skypack.dev/threejs-orbit-controls";
// import GLTFLoader from "https://cdn.skypack.dev/three-gltf-loader";
import { GLTFLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js";

//hdri
import { RGBELoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/RGBELoader.js";
import { RoughnessMipmapper } from "https://cdn.skypack.dev/three/examples/jsm/utils/RoughnessMipmapper.js";

const split = document.getElementById("split");
const clients = document.getElementById("clients");
const gear = document.getElementById("gear");

clients.addEventListener("mouseenter", (e) => {
    split.style.left = "0vw";
});
clients.addEventListener("mouseleave", (e) => {
    split.style.left = "-10vw";
});
gear.addEventListener("mouseenter", (e) => {
    split.style.left = "-20vw";
});
gear.addEventListener("mouseleave", (e) => {
    split.style.left = "-10vw";
});

//*******************************************//
//**************** THREE ********************//
//*******************************************//
// Canvas
const canvas = document.querySelector("canvas.webgl");

// SCENE
const scene = new THREE.Scene();

//HDRI

new RGBELoader().setPath("textures/").load("sticks.hdr", function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
    // use of RoughnessMipmapper is optional
    const roughnessMipmapper = new RoughnessMipmapper(renderer);
    roughnessMipmapper.dispose();
    render();
});

let midtown;

// GLTF
new GLTFLoader().load(
    "midtown2.gltf",
    (gltf) => {
        scene.add(gltf.scene);
        midtown = gltf.scene;
        gltf.scene.scale.set(0.03, 0.03, 0.03);
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
const pointLight = new THREE.PointLight(0x6495ed, 2, 150);
pointLight.position.set(0, 40, 0);
scene.add(pointLight);
const pointLight2 = new THREE.PointLight(0xff6f00, 2, 150);
pointLight2.position.set(0, -40, 0);
scene.add(pointLight2);

// helper
// const helperSize = 2;
// const pointLightHelper = new THREE.PointLightHelper(pointLight, helperSize);
// scene.add(pointLightHelper);

// RESIZING
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
const camera = new THREE.PerspectiveCamera(110, sizes.width / sizes.height, 1, 100);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 30;

scene.add(camera);

// Controls
const controls = new threejsOrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = false; //sd
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
// const clock = new THREE.Clock();

const tick = () => {
    // const elapsedTime = clock.getElapsedTime();
    if (midtown) {
        midtown.rotation.y += 0.003;
        midtown.rotation.x += 0.002;
        midtown.rotation.z += 0.001;
        // if (midtown.rotation.y > 33) {
        //     midtown.rotation.y = 0;
        // }
    }
    // controls.update();
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
