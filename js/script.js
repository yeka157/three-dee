import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js"; // Import FirstPersonControls

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xffffff, 1);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

const loader = new GLTFLoader();

loader.load(
  "models/MILANO-test.gltf",
  function (gltf) {
    const model = gltf.scene;
    model.position.set(0, 0, 0);
    model.scale.set(2, 2, 2);
    scene.add(model);
  },
  undefined,
  function (e) {
    console.error(e);
  }
);

loader.load(
  "models/interior4.gltf",
  function (gltf) {
    const model = gltf.scene;
    model.position.set(15, 0, 0);
    model.scale.set(2, 2, 2);
    scene.add(model);
  },
  undefined,
  function (e) {
    console.error(e);
  }
);

camera.position.set(0, 1.6, 5); // Set camera height to simulate a first-person view

// Initialize FirstPersonControls
const controls = new FirstPersonControls(camera, renderer.domElement);
controls.movementSpeed = 0.2; // Adjust movement speed
controls.lookSpeed = 0.01; // Adjust look speed
controls.noFly = true; // Prevent flying
controls.lookVertical = true; // Allow vertical looking
controls.constrainVertical = true; // Constrain vertical looking
controls.verticalMin = Math.PI / 4; // Limit looking up
controls.verticalMax = Math.PI / 2; // Limit looking down
controls.autoForward = false;
controls.activeLook = false;

let isMouseMoving = false;
let lastMouseX = 0;
let lastMouseY = 0;
let mouseSpeed = 0;

function onMouseMove(event) {
  if (document.pointerLockElement) {
    const deltaX = event.movementX;
    const deltaY = event.movementY;

    // Calculate mouse speed
    mouseSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    controls.activeLook = true; // Enable active look when mouse is moved
  }
}

document.body.addEventListener("click", lockMouse);
document.addEventListener("mousemove", onMouseMove);

function animate() {
  requestAnimationFrame(animate);

  // checkMouseMovement();
  controls.lookSpeed = mouseSpeed * 0.01;
  // Update controls
  if (document.pointerLockElement) {
    controls.update(0.1); // Pass delta time if needed
  }

  renderer.render(scene, camera);
}

// Lock the mouse for a true FPS experience
function lockMouse() {
  document.body.requestPointerLock();
}

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
