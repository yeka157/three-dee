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
directionalLight.position.set(10, 10, 10).normalize();
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
  "models/apartment.gltf",
  function (gltf) {
    const model = gltf.scene;

    model.position.set(15, 0, 0);
    model.scale.set(2, 2, 2);

    model.traverse((child) => {
      if (child.isMesh) {
        const material = child.material;

        if (child.name.includes("glass")) {
          material.transparent = true;
          material.opacity = 0.5; 
          material.ior = 1.5;
          material.envMapIntensity = 1;
        }
      }
    });
    // Add the model to the scene
    scene.add(model);
  },
  undefined,
  function (e) {
    console.error(e);
  }
);

camera.position.set(0, 2.5, 5); // Set camera height to simulate a first-person view

// Initialize FirstPersonControls
const controls = new FirstPersonControls(camera, renderer.domElement);
controls.movementSpeed = 1; // Adjust movement speed
controls.lookSpeed = 0.03; // Adjust look speed for better control
controls.noFly = true; // Prevent flying
controls.lookVertical = true; // Allow vertical looking
controls.constrainVertical = false; // Allow full vertical looking
controls.verticalMin = -Math.PI / 2; // Allow looking straight up
controls.verticalMax = Math.PI / 2; // Allow looking straight down
controls.autoForward = false;
controls.activeLook = true; // Enable active look by default

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Mouse movement variables
let isMouseMoving = false;
let mouseMoveTimeout;

document.addEventListener("mousemove", (event) => {
  isMouseMoving = true; // Set to true when mouse is moving
  if (mouseMoveTimeout) {
    clearTimeout(mouseMoveTimeout);
  }
  mouseMoveTimeout = setTimeout(() => {
    isMouseMoving = false; // Set to false after a period of inactivity
  }, 100);
});

const initialY = camera.position.y;

function animate() {
  requestAnimationFrame(animate);

  // Update controls for mouse movement
  controls.update(0.1); // Update controls based on mouse movement

  // Keep the camera's Y position constant
  camera.position.y = initialY;

  renderer.render(scene, camera);
}

animate();
