import './style.scss'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Pane } from 'tweakpane';

const video = document.createElement('video');
video.muted = true;
video.loop = true;

const pane = new Pane({
  title: 'Settings',
});

const params = {
  offsetY: 0.5,
}

pane.addInput(params, 'offsetY', {
  min: 0,
  max: 1,
  step: 0.01,
});

let file = null;

const input = document.createElement('input');
input.setAttribute('type', 'file');
input.setAttribute('accept', 'video/mp4,video/x-m4v,video/*');
input.style.display = 'none';
input.style.position = 'fixed';
document.body.appendChild(input);

pane.addButton({
  title: 'Upload video'
}).on('click', () => {
  input.click();
})

input.oninput = (ev) => {
  file = input.files[0];
  if (file) video.src = URL.createObjectURL(file);
}

start()

function start() {
  video.play();

  const scene = new THREE.Scene();

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const canvasTexture = new THREE.CanvasTexture(canvas);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  camera.position.set(0, Number.EPSILON, 0);
  camera.rotation.set(0, Math.PI, 0);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const sphereGeometry = new THREE.SphereGeometry(500, 60, 20);
  const sphereMaterial = new THREE.MeshBasicMaterial({
    map: canvasTexture,
    side: THREE.DoubleSide
  });

  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  scene.add(sphere);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableRotate = true;
  controls.enableRotateX = false;
  controls.enableRotateZ = false;
  controls.target.set(0, 3, 0);
  controls.update();


  var planeGeometry = new THREE.PlaneGeometry(1000, 1000);
  var planeMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    side: THREE.DoubleSide
  });
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.set(0, -50, 0);
  sphere.position.set(0, -50, 0);
  plane.rotation.set(Math.PI / 2, 0, 0);
  scene.add(plane);

  controls.keys = {
    LEFT: 'ArrowLeft', //left arrow
    UP: 'ArrowUp', // up arrow
    RIGHT: 'ArrowRight', // right arrow
    BOTTOM: 'ArrowDown' // down arrow
  }

  controls.enablePan = true;
  controls.keyPanSpeed = 10;

  function render() {
    requestAnimationFrame(render);

    canvas.width = 1920;
    canvas.height = 1080;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    console.log(canvas.width, canvas.height);


    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height * params.offsetY);
    ctx.restore();

    controls.update();
    sphereMaterial.map.needsUpdate = true;
    renderer.render(scene, camera);
  }

  render();
}
