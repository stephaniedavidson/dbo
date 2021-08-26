import * as THREE from "https://cdn.skypack.dev/three";
import threejsOrbitControls from "https://cdn.skypack.dev/threejs-orbit-controls";
// import GLTFLoader from "https://cdn.skypack.dev/three-gltf-loader";
import { GLTFLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js";

//*******************************************//
//**************** THREE ********************//
//*******************************************//
// Canvas
const canvas = document.querySelector("canvas.webgl");

// SCENE
const scene = new THREE.Scene();

// OBJECTS

const loader = new GLTFLoader();
loader.load(
    // resource URL
    "rousseau.gltf",
    // called when the resource is loaded
    (gltf) => {
        scene.add(gltf.scene);
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
        console.log("An error happened");
    }
);

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshStandardMaterial({
        color: "#444444",
        metalness: 0,
        roughness: 0.5,
    })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */

const pointLight = new THREE.PointLight(0xffffff, 2, 100);
pointLight.position.set(2, 5, 0);
scene.add(pointLight);
// //helper
const helperSize = 1;
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

// Camera
const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height, 1, 100);
camera.position.x = 6;
// camera.position.y = 0;
scene.add(camera);

// Controls
const controls = new threejsOrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = false; //sd
controls.minPolarAngle = 1; //sd
controls.maxPolarAngle = Math.PI / 2; //sd
controls.minAzimuthAngle = -Math.PI / 2 + 2.5; //sd
controls.maxAzimuthAngle = Math.PI / 2 + 0.5; //sd
controls.target = new THREE.Vector3(0, 2, 0); //sd

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
    controls.update();
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();

//*******************************************//
//**************** MODAL ********************//
//*******************************************//

dragElement(document.getElementById("m0dal"));

function dragElement(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (document.getElementById(elmnt.id)) {
        document.getElementById(elmnt.id).onmousedown = dragMouseDown;
    } else {
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = elmnt.offsetTop - pos2 + "px";
        elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

document.getElementById("close").addEventListener("click", (event) => {
    document.getElementById("m0dal").style.display = "none";
});
