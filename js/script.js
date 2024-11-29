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
controls.activeLook = true; // Enable active look by default

// Lock the mouse for a true FPS experience
function lockMouse() {
  document.body.requestPointerLock();
}

// Handle mouse movement
document.body.addEventListener("click", lockMouse);

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

let isMouseMoving = false;
let mouseMoveTimeout;

document.addEventListener("mousemove", () => {
  isMouseMoving = true;
  if (mouseMoveTimeout) {
    clearTimeout(mouseMoveTimeout);
  }
  mouseMoveTimeout = setTimeout(() => {
    isMouseMoving = false; // Set to false after a period of inactivity
  }, 100); // Adjust the timeout duration as needed
});

const initialY = camera.position.y;

function animate() {
  requestAnimationFrame(animate);

  // Update controls
  if (isMouseMoving) {
    controls.update(0.1); // Pass delta time if needed
  }

  camera.position.y = initialY;

  renderer.render(scene, camera);
}

animate();
