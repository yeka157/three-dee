import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DragControls } from "three/addons/controls/DragControls.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

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
  "models/interior4.gltf",
  function (gltf) {
    const model = gltf.scene;
    model.position.set(0, 0, 0);
    model.scale.set(2, 2, 2);
    scene.add(model);

    const dragControls = new DragControls([model], camera, renderer.domElement);
    dragControls.addEventListener("dragstart", function () {
      controls.enabled = false;
    });
    dragControls.addEventListener("dragend", function () {
      controls.enabled = true;
    });

    animate();
  },
  undefined,
  function (e) {
    console.error(e);
  }
);

camera.position.set(0, 3, 5);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.enableZoom = false;

const keys = {};
const speed = 0.2;

window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

function animate() {
  requestAnimationFrame(animate);

  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  direction.y = 0;
  direction.normalize();

  const right = new THREE.Vector3();
  right.crossVectors(direction, new THREE.Vector3(0, 1, 0));

  if (keys["w"] || keys["ArrowUp"]) {
    camera.position.add(direction.clone().multiplyScalar(speed));
  }
  if (keys["s"] || keys["ArrowDown"]) {
    camera.position.add(direction.clone().multiplyScalar(-speed));
  }
  if (keys["a"] || keys["ArrowLeft"]) {
    camera.position.add(right.clone().multiplyScalar(-speed));
  }
  if (keys["d"] || keys["ArrowRight"]) {
    camera.position.add(right.clone().multiplyScalar(speed));
  }

  controls.update();
  renderer.render(scene, camera);
}
