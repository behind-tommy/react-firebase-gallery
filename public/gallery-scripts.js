// Import three.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
import { PointerLockControls } from '/three-libraries/PointerLockControls.js';
import { GLTFLoader } from '/three-libraries/GLTFLoader.js';

// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyCpDHNdkF12eCTW3D5W1FgkF0_KkOHqN4c",
    authDomain: "ai-gallery-55b8b.firebaseapp.com",
    projectId: "ai-gallery-55b8b",
    storageBucket: "ai-gallery-55b8b.appspot.com",
    messagingSenderId: "1047560914198",
    appId: "1:1047560914198:web:a99e37dc0bac88f7423c37",
    measurementId: "G-J6VRHFYEET"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Loader to load models
const loader = new GLTFLoader();

// ---------------------------------------- Section: Welcome ---------------------------------------- //

// Ensure this function runs after the scene has loaded or a delay
const joystickContainer = document.getElementById("joystick-container");

function fadeOutOverlay() {
    const overlay = document.getElementById("welcomeOverlay");
    overlay.style.opacity = '0'; // Trigger CSS transition to fade out

    // Remove overlay from display after fade-out completes
    setTimeout(() => {
        overlay.style.display = 'none';
        joystickContainer.style.opacity = '1';
    }, 1000); // 2 seconds matches the transition time
}

// Call this function once your scene is ready to display
setTimeout(fadeOutOverlay, 3000); // Adjust timing as needed


// ---------------------------------------- Section: Gallery layout ---------------------------------------- //

// Setup the scene & camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadow maps for the renderer
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Use PCF Soft Shadows for better quality
// renderer.shadowMap.type = THREE.BasicShadowMap; // Use PCF Soft Shadows for better quality?
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Limit to 1.5 or even 1
document.getElementById("gallery").appendChild(renderer.domElement);

renderer.outputEncoding = THREE.sRGBEncoding;

  

// Define outer gallery bounds first (floor, outer walls)
const galleryWidth = 30;
const galleryHeight = 6;
const galleryDepth = 35;

// -------------- Gallery Textures -------------- //

// Create a texture loader
const textureLoader = new THREE.TextureLoader();

// // Load each texture from your file paths
// const woodTexture = textureLoader.load('/models/textures/gallery/WoodFloor039_1K-JPG_Color.jpg');           // Base color texture
// const woodNormalTexture = textureLoader.load('/models/textures/gallery/WoodFloor039_1K-JPG_NormalGL.jpg');    // Normal map
// const woodAOTexture = textureLoader.load('/models/textures/gallery/WoodFloor039_1K-JPG_AmbientOcclusion.jpg');            // Ambient Occlusion map
// const woodRoughnessTexture = textureLoader.load('/models/textures/gallery/WoodFloor039_1K-JPG_Roughness.jpg'); // Roughness map

const marbleTexture = textureLoader.load('/models/textures/gallery/Marble019_1K-JPG_Color.jpg');           // Base color texture
const marbleNormalTexture = textureLoader.load('/models/textures/gallery/Marble019_1K-JPG_NormalGL.jpg');    // Normal map
const marbleRoughnessTexture = textureLoader.load('/models/textures/gallery/Marble019_1K-JPG_Roughness.jpg'); // Roughness map


// // Set texture wrapping and repeat as needed
// woodTexture.wrapS = THREE.RepeatWrapping;
// woodTexture.wrapT = THREE.RepeatWrapping;
// woodNormalTexture.wrapS = THREE.RepeatWrapping;
// woodNormalTexture.wrapT = THREE.RepeatWrapping;
// woodAOTexture.wrapS = THREE.RepeatWrapping;
// woodAOTexture.wrapT = THREE.RepeatWrapping;
// woodRoughnessTexture.wrapS = THREE.RepeatWrapping;
// woodRoughnessTexture.wrapT = THREE.RepeatWrapping;

// Set texture wrapping and repeat as needed
marbleTexture.wrapS = THREE.RepeatWrapping;
marbleTexture.wrapT = THREE.RepeatWrapping;
marbleNormalTexture.wrapS = THREE.RepeatWrapping;
marbleNormalTexture.wrapT = THREE.RepeatWrapping;
marbleRoughnessTexture.wrapS = THREE.RepeatWrapping;
marbleRoughnessTexture.wrapT = THREE.RepeatWrapping;

// -------------- Create Floor -------------- //


// // Scale the textures to match the floor dimensions if needed
// woodTexture.repeat.set(10, 10);         // Repeat the texture to fit the floor
// woodNormalTexture.repeat.set(10, 10);
// woodAOTexture.repeat.set(10, 10);
// woodRoughnessTexture.repeat.set(10, 10);

// Scale the textures to match the floor dimensions if needed
marbleTexture.repeat.set(10, 10);         // Repeat the texture to fit the floor
marbleNormalTexture.repeat.set(10, 10);
marbleRoughnessTexture.repeat.set(10, 10);


// Create floor material
const floorMaterial = new THREE.MeshStandardMaterial({
    map: marbleTexture,               // Base color map
    normalMap: marbleNormalTexture,    // Adds surface detail
    // aoMap: woodAOTexture,            // Ambient occlusion for added depth
    roughnessMap: marbleRoughnessTexture, // Controls roughness/shininess
    roughness: 1                      // Adjust this value to control glossiness
});

// Create floor geometry
const floorGeometry = new THREE.PlaneGeometry(galleryWidth, galleryDepth); // Adjust dimensions as needed

// Create floor
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.receiveShadow = true; // Enable the floor to receive shadows
floor.rotation.x = -Math.PI / 2; // Rotate to be flat on the ground
floor.position.y = 0;
scene.add(floor);


// -------------- Create Walls -------------- //

// Function to create a wall or block
function createWall(width, height, depth, color, position, rotation = { x: 0, y: 0, z: 0 }) {
    const wallGeometry = new THREE.BoxGeometry(width, height, depth);
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: color,        // Pure white color
        roughness: 0.9,         // High roughness for a matte effect
        metalness: 0            // No metalness for a non-reflective surface
    });    
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);

    // Set position and rotation
    wall.position.set(position.x, position.y, position.z);
    wall.rotation.set(rotation.x, rotation.y, rotation.z);

    // Walls cast shadows
    wall.castShadow = true;
    wall.receiveShadow = true;

    // Add wall to scene
    scene.add(wall);
    return wall;
}

// Outer wall Skirting Setup
const outerBlockSkirtingWidth = 0.52;
const outerBlockSkirtingHeight = 0.03;
const outerBlockSkirtingDepth = galleryDepth + 0.02;
const outerBlockSkirtingColor = 0x545454;

// Outer walls
const leftWall = createWall(0.5, galleryHeight, galleryDepth, 0xe9e9e9, { x: -galleryWidth / 2, y: galleryHeight / 2, z: 0 }); // Left
const rightWall = createWall(0.5, galleryHeight, galleryDepth, 0xe9e9e9, { x: galleryWidth / 2, y: galleryHeight / 2, z: 0 }); // Right
const backWall = createWall(galleryWidth, galleryHeight, 0.5, 0xe9e9e9, { x: 0, y: galleryHeight / 2, z: -galleryDepth / 2 }); // Back
const frontWall = createWall(galleryWidth, galleryHeight, 0.5, 0xe9e9e9, { x: 0, y: galleryHeight / 2, z: galleryDepth / 2 }); // Front

// Outer walls are placed in a set I'll use for collision handling (other walls are passthrough)
const collidableWalls = [];
collidableWalls.push(leftWall, rightWall, backWall, frontWall);

// Outer wall skirting
createWall(0.52, outerBlockSkirtingHeight, galleryDepth + 0.02, outerBlockSkirtingColor, { x: -galleryWidth / 2, y: 0.02, z: 0 }); // Left
createWall(0.52, outerBlockSkirtingHeight, galleryDepth, outerBlockSkirtingColor, { x: galleryWidth / 2, y: 0.02, z: 0 }); // Right
createWall(galleryWidth + 0.02, outerBlockSkirtingHeight, 0.52, outerBlockSkirtingColor, { x: 0, y: 0.02, z: -galleryDepth / 2 }); // Back
createWall(galleryWidth + 0.02, outerBlockSkirtingHeight, 0.52, outerBlockSkirtingColor, { x: 0, y: 0.02, z: galleryDepth / 2 }); // Front

// Inner Block Row Setup
const blockWidth = 6;
const blockHeight = 3;
const blockDepth = 0.5;
const blockColor = 0xf3f3f3; // White

// Inner Block Skirting Setup
const innerBlockSkirtingWidth = 6.02;
const innerBlockSkirtingHeight = 0.03;
const innerBlockSkirtingDepth = 0.52;
const innerBlockSkirtingColor = 0x545454;

// Inner Row 1 with skirting
createWall(blockWidth, blockHeight, blockDepth, blockColor, { x: -7, y: blockHeight / 2, z: -7 });
createWall(blockWidth, blockHeight, blockDepth, blockColor, { x: 7, y: blockHeight / 2, z: -7 });
createWall(innerBlockSkirtingWidth, innerBlockSkirtingHeight, innerBlockSkirtingDepth, innerBlockSkirtingColor, { x: -7, y: 0.02, z: -7 });
createWall(innerBlockSkirtingWidth, innerBlockSkirtingHeight, innerBlockSkirtingDepth, innerBlockSkirtingColor, { x: 7, y: 0.02, z: -7 });

// Inner Row 2 with skirting
createWall(blockWidth, blockHeight, blockDepth, blockColor, { x: -7, y: blockHeight / 2, z: 7 });
createWall(blockWidth, blockHeight, blockDepth, blockColor, { x: 7, y: blockHeight / 2, z: 7 });
createWall(innerBlockSkirtingWidth, innerBlockSkirtingHeight, innerBlockSkirtingDepth, innerBlockSkirtingColor, { x: -7, y: 0.02, z: 7 });
createWall(innerBlockSkirtingWidth, innerBlockSkirtingHeight, innerBlockSkirtingDepth, innerBlockSkirtingColor, { x: 7, y: 0.02, z: 7 });

// Inner Row 3 with skirting
createWall(blockWidth, blockHeight, blockDepth, blockColor, { x: -7, y: blockHeight / 2, z: 0 });
createWall(blockWidth, blockHeight, blockDepth, blockColor, { x: 7, y: blockHeight / 2, z: 0 });
createWall(innerBlockSkirtingWidth, innerBlockSkirtingHeight, innerBlockSkirtingDepth, innerBlockSkirtingColor, { x: -7, y: 0.02, z: 0 });
createWall(innerBlockSkirtingWidth, innerBlockSkirtingHeight, innerBlockSkirtingDepth, innerBlockSkirtingColor, { x: 7, y: 0.02, z: 0 });


// -------------- Create Ceiling -------------- //

// Create concrete ceiling with openings and padding
const concreteThickness = 0.5;

// Center concrete section
const centerCeilingGeometry = new THREE.BoxGeometry(galleryWidth / 3, concreteThickness, galleryDepth);
const centerConcreteMaterial = new THREE.MeshStandardMaterial({ color: 0xfafafa });
const centerCeilingMesh = new THREE.Mesh(centerCeilingGeometry, centerConcreteMaterial);
centerCeilingMesh.position.set(0, galleryHeight + concreteThickness / 2, 0);
centerCeilingMesh.receiveShadow = true;
centerCeilingMesh.castShadow = true;
scene.add(centerCeilingMesh);

// Left concrete section
const leftCeilingGeometry = new THREE.BoxGeometry(galleryWidth / 6, concreteThickness, galleryDepth);
const leftConcreteMaterial = new THREE.MeshStandardMaterial({ color: 0xfafafa });
const leftCeilingMesh = new THREE.Mesh(leftCeilingGeometry, leftConcreteMaterial);
leftCeilingMesh.position.set(-galleryWidth/2, galleryHeight + concreteThickness / 2, 0);
leftCeilingMesh.receiveShadow = true;
leftCeilingMesh.castShadow = true;
scene.add(leftCeilingMesh);

// Right concrete section
const rightCeilingGeometry = new THREE.BoxGeometry(galleryWidth / 6, concreteThickness, galleryDepth);
const rightConcreteMaterial = new THREE.MeshStandardMaterial({ color: 0xfafafa });
const rightCeilingMesh = new THREE.Mesh(rightCeilingGeometry, rightConcreteMaterial);
rightCeilingMesh.position.set(galleryWidth/2, galleryHeight + concreteThickness / 2, 0);
rightCeilingMesh.receiveShadow = true;
rightCeilingMesh.castShadow = true;
scene.add(rightCeilingMesh);

// Front concrete section
const frontCeilingGeometry = new THREE.BoxGeometry(galleryWidth, concreteThickness, galleryDepth / 6);
const frontConcreteMaterial = new THREE.MeshStandardMaterial({ color: 0xfafafa });
const frontCeilingMesh = new THREE.Mesh(frontCeilingGeometry, frontConcreteMaterial);
frontCeilingMesh.position.set(0, galleryHeight + concreteThickness / 2, galleryDepth/2.4);
frontCeilingMesh.receiveShadow = true;
frontCeilingMesh.castShadow = true;
scene.add(frontCeilingMesh);

// Back concrete section
const backCeilingGeometry = new THREE.BoxGeometry(galleryWidth, concreteThickness, galleryDepth / 6);
const backConcreteMaterial = new THREE.MeshStandardMaterial({ color: 0xfafafa });
const backCeilingMesh = new THREE.Mesh(backCeilingGeometry, backConcreteMaterial);
backCeilingMesh.position.set(0, galleryHeight + concreteThickness / 2, -galleryDepth/2.4);
backCeilingMesh.receiveShadow = true;
backCeilingMesh.castShadow = true;
scene.add(backCeilingMesh);

// Ceiling Grid with Windows
const beamThickness = 0.1;
const gridSize = 16;

// Create ceiling frame beams with shadow casting
for (let i = -galleryWidth / 2; i <= galleryWidth / 2; i += galleryWidth / (gridSize * 1.4)) {
    // Vertical beams (along Z-axis)
    const verticalBeam = createWall(beamThickness, 0.1, galleryDepth, 0xfafafa, { x: i, y: galleryHeight + concreteThickness, z: 0 });
    verticalBeam.castShadow = true; // Enable shadow casting for vertical beams
    verticalBeam.receiveShadow = true;
}
for (let j = -galleryDepth / 2; j <= galleryDepth / 2; j += galleryDepth / gridSize) {
    // Horizontal beams (along X-axis)
    const horizontalBeam = createWall(galleryWidth, 0.1, beamThickness, 0xfafafa, { x: 0, y: galleryHeight + concreteThickness, z: j });
    horizontalBeam.castShadow = true; // Enable shadow casting for horizontal beams
    horizontalBeam.receiveShadow = true;
}

// Create transparent window panels between beams
const windowPanelGeometry = new THREE.BoxGeometry(galleryWidth, 0.05, galleryDepth);
const windowPanelMaterial = new THREE.MeshPhongMaterial({
    color: 0xaec6cf,
    transparent: true,
    opacity: 0.1,
    depthWrite: true,  // Set depthWrite to true to improve visual stacking
    side: THREE.DoubleSide  // Make the material visible from both sides
});
const windowPanelMesh = new THREE.Mesh(windowPanelGeometry, windowPanelMaterial);
windowPanelMesh.position.set(0, galleryHeight + concreteThickness + beamThickness, 0);
windowPanelMesh.castShadow = false;  // Windows typically don't cast shadows
windowPanelMesh.receiveShadow = true;  // Allow windows to receive some lighting effects
scene.add(windowPanelMesh);

// Load skybox
textureLoader.load('./img/sky-2.jpg', function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping; // Use equirectangular reflection mapping to create a smooth sky
    scene.background = texture;
});

// ---------------------------------------- Section: Decor ---------------------------------------- //


// Function to load and add the model to the scene
function loadModel(modelPath, scene, position = { x: 0, y: 0, z: 0 }, scale = 1, rotationY = 0) {
    loader.load(
        modelPath,
        (gltf) => {
            const model = gltf.scene;

            // Set the model's position
            model.position.set(position.x, position.y, position.z);

            // Adjust scale if needed
            model.scale.set(scale, scale, scale);

            // Rotate model
            model.rotation.y += rotationY;

            // Enable shadows (optional, depending on your lighting setup)
            model.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });

            // Add the model to the scene
            scene.add(model);
            console.log('Model loaded successfully');
        },
        undefined,
        (error) => {
            console.error('An error occurred while loading the model:', error);
        }
    );
}

// Load plants
loadModel('/models/potted_plant_mediterranean_med_leaf_low_poly.glb', scene, { x: 14, y: 0, z: galleryWidth/2 + 1.5 }, 2);
loadModel('/models/potted_plant_mediterranean_med_leaf_low_poly.glb', scene, { x: -14, y: 0, z: -galleryWidth/2 - 1.5 }, 2);

// Load benches
loadModel('/models/granite_bench.glb', scene, { x: 7, y: 0.24, z: galleryWidth/2 + 1.6 }, 1.3);
loadModel('/models/granite_bench.glb', scene, { x: -7, y: 0.24, z: galleryWidth/2 + 1.6 }, 1.3);

// Load doors
loadModel('/models/double_sliding_doors.glb', scene, { x: 14.95, y: 0, z: galleryWidth/2 }, 0.035, Math.PI/2);
loadModel('/models/double_sliding_doors.glb', scene, { x: -14.65, y: 0, z: galleryWidth/2 }, 0.035, Math.PI/2);


// Load small round lights
loadModel('/models/cylinder_ceiling_light.glb', scene, { x: 7, y: galleryHeight, z: 14.5 }, 0.25);
loadModel('/models/cylinder_ceiling_light.glb', scene, { x: -7, y: galleryHeight, z: 14.5 }, 0.25);
loadModel('/models/cylinder_ceiling_light.glb', scene, { x: 7, y: galleryHeight, z: -14.5 }, 0.25);
loadModel('/models/cylinder_ceiling_light.glb', scene, { x: -7, y: galleryHeight, z: -14.5 }, 0.25);

// Load long ceiling lights
loadModel('/models/ceiling_lamp.glb', scene, { x: 0, y: galleryHeight - 4.5, z: 14.5 }, 1.8);
loadModel('/models/ceiling_lamp.glb', scene, { x: 0, y: galleryHeight - 4.5, z: 3.5 }, 1.8);
loadModel('/models/ceiling_lamp.glb', scene, { x: 0, y: galleryHeight - 4.5, z: -3.5 }, 1.8);
loadModel('/models/ceiling_lamp.glb', scene, { x: 0, y: galleryHeight - 4.5, z: -14.5 }, 1.8);

// Load spotlights right
loadModel('/models/rullo_lightstar_ceiling_lamp_1.glb', scene, { x: 13, y: galleryHeight - 0.5, z: -14.5 }, 0.002, -1);
loadModel('/models/rullo_lightstar_ceiling_lamp_1.glb', scene, { x: 13, y: galleryHeight - 0.5, z: -7 }, 0.002, -1);
loadModel('/models/rullo_lightstar_ceiling_lamp_1.glb', scene, { x: 13, y: galleryHeight - 0.5, z: 0 }, 0.002, 1);
loadModel('/models/rullo_lightstar_ceiling_lamp_1.glb', scene, { x: 13, y: galleryHeight - 0.5, z: 7 }, 0.002, -1);
loadModel('/models/rullo_lightstar_ceiling_lamp_1.glb', scene, { x: 13, y: galleryHeight - 0.5, z: 14.5 }, 0.002, 1);

// Load spotlights left
loadModel('/models/rullo_lightstar_ceiling_lamp_1.glb', scene, { x: -13, y: galleryHeight - 0.5, z: -14.5 }, 0.002, -2);
loadModel('/models/rullo_lightstar_ceiling_lamp_1.glb', scene, { x: -13, y: galleryHeight - 0.5, z: -7 }, 0.002, -2);
loadModel('/models/rullo_lightstar_ceiling_lamp_1.glb', scene, { x: -13, y: galleryHeight - 0.5, z: 0 }, 0.002, 2);
loadModel('/models/rullo_lightstar_ceiling_lamp_1.glb', scene, { x: -13, y: galleryHeight - 0.5, z: 7 }, 0.002, -2);
loadModel('/models/rullo_lightstar_ceiling_lamp_1.glb', scene, { x: -13, y: galleryHeight - 0.5, z: 14.5 }, 0.002, 2);

// Load spotlights center
loadModel('/models/rullo_lightstar_ceiling_lamp_1.glb', scene, { x: -4.3, y: galleryHeight - 0.5, z: -14.5 }, 0.002, -2);
loadModel('/models/rullo_lightstar_ceiling_lamp_1.glb', scene, { x: -4.3, y: galleryHeight - 0.5, z: -7 }, 0.002, -2);
loadModel('/models/rullo_lightstar_ceiling_lamp_1.glb', scene, { x: -4.3, y: galleryHeight - 0.5, z: 0 }, 0.002, 2);
loadModel('/models/rullo_lightstar_ceiling_lamp_1.glb', scene, { x: -4.3, y: galleryHeight - 0.5, z: 7 }, 0.002, -2);
loadModel('/models/rullo_lightstar_ceiling_lamp_1.glb', scene, { x: -4.3, y: galleryHeight - 0.5, z: 14.5 }, 0.002, 2);

loadModel('/models/rullo_lightstar_ceiling_lamp_1.glb', scene, { x: 4.3, y: galleryHeight - 0.5, z: -14.5 }, 0.002, -1);
loadModel('/models/rullo_lightstar_ceiling_lamp_1.glb', scene, { x: 4.3, y: galleryHeight - 0.5, z: -7 }, 0.002, -1);
loadModel('/models/rullo_lightstar_ceiling_lamp_1.glb', scene, { x: 4.3, y: galleryHeight - 0.5, z: 0 }, 0.002, 1);
loadModel('/models/rullo_lightstar_ceiling_lamp_1.glb', scene, { x: 4.3, y: galleryHeight - 0.5, z: 7 }, 0.002, -1);
loadModel('/models/rullo_lightstar_ceiling_lamp_1.glb', scene, { x: 4.3, y: galleryHeight - 0.5, z: 14.5 }, 0.002, 1);


// ---------------------------------------- Section: Lighting ---------------------------------------- //

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 2.2); // Soft white ambient light to brighten up the scene
scene.add(ambientLight);

// Add directional light to simulate sunlight
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3); // Bright white light with adjusted intensity
directionalLight.position.set(0, 20, 11.5); // Position above the scene
directionalLight.castShadow = true; // Enable shadows

// Add directional light to simulate sunlight
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.2); // Bright white light with adjusted intensity
directionalLight2.position.set(0, 17, -10); // Position above the scene
directionalLight2.castShadow = true; // Enable shadows

// Configure shadow properties for better quality
directionalLight.shadow.mapSize.width = 512;  // Default is 512, increased for better quality
directionalLight.shadow.mapSize.height = 512; // Default is 512, increased for better quality
directionalLight.shadow.camera.near = 1;    // Near clipping plane for the shadow camera
directionalLight.shadow.camera.far = 60;      // Far clipping plane for the shadow camera
directionalLight.shadow.camera.left = -15;
directionalLight.shadow.camera.right = 15;
directionalLight.shadow.camera.top = 15;
directionalLight.shadow.camera.bottom = -15;

scene.add(directionalLight);

// Add a helper to visualize the directional light
// const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(dirLightHelper);

// const dirLightHelper2 = new THREE.DirectionalLightHelper(directionalLight2, 5);
// scene.add(dirLightHelper2);

// Point Lights

// Light near the center of the room
const centerLight = new THREE.PointLight(0xffffff, 10, 100);
centerLight.position.set(0, 6, 0);
centerLight.castShadow = true;
scene.add(centerLight);

// Light near a center-corner of the gallery
const cornerLight1 = new THREE.PointLight(0xffffff, 10, 100);
cornerLight1.position.set(-8, 5, -5);
cornerLight1.castShadow = true;
scene.add(cornerLight1);

// Light on the center-opposite corner
const cornerLight2 = new THREE.PointLight(0xffffff, 10, 100);
cornerLight2.position.set(8, 5, 5);
cornerLight2.castShadow = true;
scene.add(cornerLight2);

// Light on the entrance center
const cornerLight3 = new THREE.PointLight(0xffffff, 10, 100);
cornerLight3.position.set(0, 5, 14);
cornerLight3.castShadow = true;
scene.add(cornerLight3);

// Light on the back center
const cornerLight4 = new THREE.PointLight(0xffffff, 10, 100);
cornerLight4.position.set(0, 5, -14);
cornerLight4.castShadow = true;
scene.add(cornerLight4);

// ---------------------------------------- Section: Artwork ---------------------------------------- //

// Store framed artwork & art cards
const framedArtworks = {};
const artCards = [];


// Function to create framed artwork & art description card
async function createFramedArtwork(
    id,
    frameDepth,
    position,
    rotation,
    height = 1.5,
    facing = "front"
) {
    const docRef = doc(db, "spaces", id); // Assume 'artworks' collection stores data
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const artworkData = docSnap.data();
        const storageRef = ref(storage, artworkData.artUrl);
        const imageURL = await getDownloadURL(storageRef);

        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(imageURL, (texture) => {
            // Set the texture encoding for gamma correction
            texture.encoding = THREE.sRGBEncoding;

            // Calculate the aspect ratio of the image
            const aspectRatio = texture.image.width / texture.image.height;

            // Define base height or width and adjust the other dimension to keep the aspect ratio
            const baseHeight = height; // Set a base height for all artworks (adjust as desired)
            const artworkHeight = baseHeight;
            const artworkWidth = artworkHeight * aspectRatio;

            // Create PlaneGeometry for the artwork with correct dimensions
            const artworkGeometry = new THREE.PlaneGeometry(
                artworkWidth,
                artworkHeight
            );
            const artworkMaterial = new THREE.MeshStandardMaterial({ map: texture });
            const artworkMesh = new THREE.Mesh(artworkGeometry, artworkMaterial);

            // Create a frame geometry around the artwork
            const frameWidth = artworkWidth + frameDepth;
            const frameHeight = artworkHeight + frameDepth;
            const frameGeometry = new THREE.BoxGeometry(
                frameWidth,
                frameHeight,
                frameDepth
            );
            const frameMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
            }); // Frame color
            const frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);

            // Position the artwork slightly in front of the frame
            artworkMesh.position.z = frameDepth / 2 + 0.01;

            // Create a group to hold both the frame and the artwork
            const framedArtwork = new THREE.Group();
            framedArtwork.add(frameMesh);
            framedArtwork.add(artworkMesh);
            framedArtwork.imageURL = imageURL;
            framedArtwork.imageId = id;

            // Set position and rotation
            framedArtwork.position.set(position.x, position.y, position.z);
            framedArtwork.rotation.set(rotation.x, rotation.y, rotation.z);

            // Add the framed artwork to the scene
            scene.add(framedArtwork);

            // Store the framed artwork in the array
            framedArtworks[id] = framedArtwork;

            // Add the description card with texture
            const cardWidth = 0.22; // Width of the description card
            const cardHeight = 0.15; // Height of the description card
            const gap = 0.1; // Gap between the artwork and the description card

            const cardTextureURL = "./models/textures/gallery/artcard.jpg"; // Replace with your card texture URL
            textureLoader.load(cardTextureURL, (cardTexture) => {
                const cardMaterial = new THREE.MeshBasicMaterial({
                    map: cardTexture,
                });
                const cardGeometry = new THREE.BoxGeometry(
                    cardWidth,
                    cardHeight,
                    0.02
                );
                const cardMesh = new THREE.Mesh(cardGeometry, cardMaterial);

                // Rotate art card
                cardMesh.rotation.set(rotation.x, rotation.y, rotation.z);

                // Position the card dynamically based on artwork facing direction
                switch (facing) {
                    case "front":
                        cardMesh.position.set(
                            position.x + artworkWidth / 2 + gap + cardWidth / 2,
                            1.3, // Align with artwork vertically
                            position.z // Depth remains the same
                        );
                        break;

                    case "back":
                        cardMesh.position.set(
                            position.x - (artworkWidth / 2 + gap + cardWidth / 2),
                            1.3,
                            position.z
                        );
                        break;

                    case "left":
                        cardMesh.position.set(
                            position.x,
                            1.3,
                            position.z + artworkWidth / 2 + gap + cardWidth / 2
                        );
                        break;

                    case "right":
                        cardMesh.position.set(
                            position.x,
                            1.3,
                            position.z - (artworkWidth / 2 + gap + cardWidth / 2)
                        );
                        break;

                    default:
                        console.warn(`Unknown facing direction: ${facing}`);
                }

                // Store an art space ID (for referencing firebase data) for this artcard object
                cardMesh.userData = { isArtCard: true, artworkId: id}

                // Add the card to the scene
                scene.add(cardMesh);

                // Add card to ArtCards array
                artCards.push(cardMesh);
            });

        });
    } else {
        console.error("No such document in Firestore for ID:", id);
    }
}


// Left inner block 1 front
createFramedArtwork(
    '1',
    0.05, // Frame depth
    { x: -7, y: 1.5, z: blockDepth + 6.8 }, // Position on the wall
    { x: 0, y: 0, z: 0 },
    1.5,
    'front'
);

// Left inner block 1 back
createFramedArtwork(
    '2',
    // 'https://res.cloudinary.com/dsjopahtl/image/upload/v1730629010/beeb2_gm9gka.jpg', // Replace with your image URL
    0.05, // Frame depth
    { x: -7, y: 1.5, z: 6.7 }, // Position on the wall
    { x: 0, y: Math.PI, z: 0 },
    1.5,
    'back'
);

// Left inner block 2
createFramedArtwork(
    '14',
    // 'https://res.cloudinary.com/dsjopahtl/image/upload/v1730629012/bunny_kfwbzn.jpg', // Replace with your image URL
    0.05, // Frame depth
    { x: -7, y: 1.5, z: blockDepth - 0.2 }, // Position on the wall
    { x: 0, y: 0, z: 0 },
    1.5,
    'front'
);

// Left inner block 2 back
createFramedArtwork(
    '23',
    // 'https://res.cloudinary.com/dsjopahtl/image/upload/v1731164126/Galaxy_gynx7g_1_wxnepf.jpg',
    0.05, // Frame depth
    { x: -7, y: 1.5, z: -0.3 }, // Position on the wall
    { x: 0, y: Math.PI, z: 0 },
    1.5,
    'back'
);

// Left inner block 3
createFramedArtwork(
    '6',
    // 'https://res.cloudinary.com/dsjopahtl/image/upload/v1731164113/beeb9_optimized_spczzb_cbpsy9.jpg',
    0.05, // Frame depth
    { x: -7, y: 1.5, z: blockDepth - 7.2 }, // Position on the wall
    { x: 0, y: 0, z: 0 }, // Rotation
    2.5,
    'front'
);

// Left inner block 3 back
createFramedArtwork(
    '5',
    // 'https://res.cloudinary.com/dsjopahtl/image/upload/v1731164114/beeb10_optimized_uwzapp_nxs7p8.jpg', // Replace with your image URL
    0.05, // Frame depth
    { x: -7, y: 1.5, z: -7.3 }, // Position on the wall
    { x: 0, y: Math.PI, z: 0 }, // Rotation
    2.5,
    'back'
);

// Right inner block 1 front
createFramedArtwork(
    '3',
    // 'https://res.cloudinary.com/dsjopahtl/image/upload/v1731164123/Wolf_Flowers_i0ugzp_1_p2i0ms.jpg', // Replace with your image URL
    0.05, // Frame depth
    { x: 7, y: 1.5, z: blockDepth + 6.8 }, // Position on the wall
    { x: 0, y: 0, z: 0 },
    1.5,
    'front'
);

// Right inner block 1 back
createFramedArtwork(
    '9',
    // 'https://res.cloudinary.com/dsjopahtl/image/upload/v1730629011/beeb5_tzqowu.jpg', // Replace with your image URL
    0.05, // Frame depth
    { x: 7, y: 1.5, z: 6.7 }, // Position on the wall
    { x: 0, y: Math.PI, z: 0 },
    1.5,
    'back'
);

// Right inner block 2
createFramedArtwork(
    '8',
    // 'https://res.cloudinary.com/dsjopahtl/image/upload/v1730629013/beeb8_wzbs73.jpg',
    0.05, // Frame depth
    { x: 7, y: 1.5, z: blockDepth - 0.2 }, // Position on the wall
    { x: 0, y: 0, z: 0 },
    1.5,
    'front'
);

// Right inner block 2 back
createFramedArtwork(
    '20',
    // 'https://res.cloudinary.com/dsjopahtl/image/upload/v1731164116/bobby2_q2jy1t_drcolt.jpg',
    0.05, // Frame depth
    { x: 7, y: 1.5, z: -0.3 }, // Position on the wall
    { x: 0, y: Math.PI, z: 0 },
    1.5,
    'back'
);

// Right inner block 3
createFramedArtwork(
    '4',
    // 'https://res.cloudinary.com/dsjopahtl/image/upload/v1731164117/Carrot_Rabbit_zo38g0_1_phaoap.jpg', // Replace with your image URL
    0.05, // Frame depth
    { x: 7, y: 1.5, z: blockDepth - 7.2 }, // Position on the wall
    { x: 0, y: 0, z: 0 },
    1.5,
    'front'
);

// Right inner block 3 back
createFramedArtwork(
    '7',
    // 'https://res.cloudinary.com/dsjopahtl/image/upload/v1730629012/beeb11_optimized_xrovyr.png',
    0.05, // Frame depth
    { x: 7, y: 1.5, z: -7.3 }, // Position on the wall
    { x: 0, y: Math.PI, z: 0 }, // Rotation
    2.5,
    'back'
);

// Left wall

createFramedArtwork(
    '10',
    // 'https://res.cloudinary.com/dsjopahtl/image/upload/v1731164110/Pollen_Count_m7nvpf_1_jfhtws.jpg',
    0.05, // Frame depth
    { x: -14.7, y: 1.5, z: 7.5 }, // Position on the wall
    { x: 0, y: Math.PI/2, z: 0 },
    1.5,
    'right'
);

createFramedArtwork(
    '11',
    // 'https://res.cloudinary.com/dsjopahtl/image/upload/v1731164120/sticks_hbcvvz_1_pxfntt.jpg',
    0.05, // Frame depth
    { x: -14.7, y: 1.5, z: 3 }, // Position on the wall
    { x: 0, y: Math.PI/2, z: 0 },
    1.5,
    'right'
);

createFramedArtwork(
    '12',
    // 'https://res.cloudinary.com/dsjopahtl/image/upload/v1731164110/stork_c6zszs_1_f3mbf5.jpg',
    0.05, // Frame depth
    { x: -14.7, y: 1.5, z: -1.5 }, // Position on the wall
    { x: 0, y: Math.PI/2, z: 0 },
    1.5,
    'right'
);

createFramedArtwork(
    '13',
    // 'https://res.cloudinary.com/dsjopahtl/image/upload/v1731164118/river_durh8e_1_o5zyr2.jpg',
    0.05, // Frame depth
    { x: -14.7, y: 1.5, z: -6 }, // Position on the wall
    { x: 0, y: Math.PI/2, z: 0 },
    1.5,
    'right'
);

createFramedArtwork(
    '24',
    // 'https://res.cloudinary.com/dsjopahtl/image/upload/v1731164107/Milking_Cows_lzvfm8_1_ruwn2w.jpg',
    0.05, // Frame depth
    { x: -14.7, y: 1.5, z: -12 }, // Position on the wall
    { x: 0, y: Math.PI/2, z: 0 },
    1.5,
    'right'
);

// Right wall

createFramedArtwork(
    '15',
    // 'https://res.cloudinary.com/dsjopahtl/image/upload/v1731164121/The_Art_Of_The_Duck_wskvvm_1_eldxuj.jpg',
    0.05, // Frame depth
    { x: 14.7, y: 1.5, z: 7.5 }, // Position on the wall
    { x: 0, y: -Math.PI/2, z: 0 },
    1.5,
    'left'
);

createFramedArtwork(
    '16',
    // 'https://res.cloudinary.com/dsjopahtl/image/upload/v1731164124/Dripping_Red_nmqi0e_1_uhyrjx.jpg',
    0.05, // Frame depth
    { x: 14.7, y: 1.5, z: 3 }, // Position on the wall
    { x: 0, y: -Math.PI/2, z: 0 },
    1.5,
    'left'
);

createFramedArtwork(
    '17',
    // 'https://res.cloudinary.com/dsjopahtl/image/upload/v1731164112/Sunflower_Hammy_chyxpe_1_qyevxj.jpg',
    0.05, // Frame depth
    { x: 14.7, y: 1.5, z: -1.5 }, // Position on the wall
    { x: 0, y: -Math.PI/2, z: 0 },
    1.5,
    'left'
);

createFramedArtwork(
    '18',
    // 'https://res.cloudinary.com/dsjopahtl/image/upload/v1731164109/Mother_Of_Cats_xzku8x_1_gu5hyr.jpg',
    0.05, // Frame depth
    { x: 14.7, y: 1.5, z: -6 }, // Position on the wall
    { x: 0, y: -Math.PI/2, z: 0 },
    1.5,
    'left'
);

createFramedArtwork(
    '19',
    // 'https://res.cloudinary.com/dsjopahtl/image/upload/v1730629012/hammy_2_optimized_vrngwm.png',
    0.05, // Frame depth
    { x: 14.7, y: 1.5, z: -12 }, // Position on the wall
    { x: 0, y: -Math.PI/2, z: 0 }, // Rotation
    0.4,
    'left'
);

// Far wall

createFramedArtwork(
    '21',
    // // './img/sky.jpg',
    // 'https://res.cloudinary.com/dsjopahtl/image/upload/v1730629011/beeb6_ufqxwn.jpg', // Replace with your image URL
    0.05, // Frame depth
    { x: 0, y: 2.9, z: -17.2 }, // Position on the wall
    { x: 0, y: 0, z: 0 }, // Rotation
    4.8,
    'front'
);

// Near back wall

createFramedArtwork(
    '22',
    // './img/sky.jpg',
    // 'https://res.cloudinary.com/dsjopahtl/image/upload/v1731164368/Cherry_Pond_xgglbx_1_qkeqxo.jpg', // Replace with your image URL
    0.05, // Frame depth
    { x: 0, y: 2.8, z: 17.2 }, // Position on the wall
    { x: 0, y: Math.PI, z: 0 }, // Rotation
    4.2,
    'back'
);

// ---------------------------------------- Section: View control with mouse movement ---------------------------------------- //

// Initialize PointerLockControls with the camera and renderer
// const controls = new PointerLockControls(camera, document.body);

// document.addEventListener('click', () => {
//     if (!controls.isLocked) {
//         try {
//             controls.lock();
//         } catch (error) {
//             console.error("Failed to lock pointer controls:", error);
//         }
//     }
// });

// Initialize PointerLockControls
const controls = new PointerLockControls(camera, renderer.domElement);

// Variable to manage pointer lock state
let canLock = true;
const debounceDuration = 1100;

// Pointer lock state change listener
document.addEventListener('pointerlockchange', () => {
    console.log("PointerLockElement:", document.pointerLockElement);
    console.log("Renderer DOM Element:", renderer.domElement);

    if (document.pointerLockElement === renderer.domElement) {
        console.log("Pointer lock acquired.");
        canLock = true;
    } else {
        console.log("Pointer lock released.");
        canLock = false;

        // Prevent immediate re-locking
        setTimeout(() => {
            canLock = true;
            console.log("Pointer lock is now allowed again.");
        }, debounceDuration);
    }
});

// Click listener to request pointer lock
renderer.domElement.addEventListener('click', () => {
    if (canLock && !controls.isLocked) {
        try {
            renderer.domElement.requestPointerLock();
        } catch (error) {
            console.error("Failed to request pointer lock:", error);
        }
    }
});



controls.addEventListener('lock', () => {
    console.log('PointerLockControls: locked');
});

controls.addEventListener('unlock', () => {
    console.log('PointerLockControls: unlocked');
});

scene.add(controls.object);

// Add a simple pointer (crosshair) in the center of the viewport
const crosshair = document.createElement('div');
crosshair.style.position = 'absolute';
crosshair.style.width = '10px';
crosshair.style.height = '10px';
crosshair.style.backgroundColor = 'white';
crosshair.style.borderRadius = '50%';
crosshair.style.top = '50%';
crosshair.style.left = '50%';
crosshair.style.transform = 'translate(-50%, -50%)';
crosshair.style.pointerEvents = 'none';
document.body.appendChild(crosshair);

// ---------------------------------------- Section: Mobile View Panning and Joystick ---------------------------------------- //


const joystick = {
    container: document.getElementById("joystick-container"),
    handle: document.getElementById("joystick-handle"),
    isDragging: false,
    startX: 0,
    startY: 0,
    deltaX: 0,
    deltaY: 0,
    sensitivity: 0.45,  // Adjust for camera movement speed
    maxDistance: 40,    // Maximum distance joystick can move from center
    touchId: null       // Track the touch ID for joystick control
};

// Panning variables
let touchStartX = 0;
let touchStartY = 0;
let initialQuaternion;
let initialEuler;
let panningTouchId = null; // Track the touch ID for panning

const MAX_TILT_UP = Math.PI / 3;   // 60 degrees up
const MAX_TILT_DOWN = -Math.PI / 3; // 60 degrees down

// Function to limit joystick handle movement within max distance
function limitJoystickHandle(deltaX, deltaY) {
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (distance > joystick.maxDistance) {
        const angle = Math.atan2(deltaY, deltaX);
        deltaX = Math.cos(angle) * joystick.maxDistance;
        deltaY = Math.sin(angle) * joystick.maxDistance;
    }
    return { deltaX, deltaY };
}

// Function to move the camera continuously based on joystick position
function moveCameraWithJoystick(deltaX, deltaY) {
    const forward = new THREE.Vector3();
    controls.object.getWorldDirection(forward);
    forward.y = 0; // Lock movement to the horizontal plane
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    // Scale movement by joystick offset
    controls.object.position.add(forward.multiplyScalar(-deltaY * joystick.sensitivity / joystick.maxDistance));
    controls.object.position.add(right.multiplyScalar(deltaX * joystick.sensitivity / joystick.maxDistance));
}

// Joystick touchstart event (assigns only if not already active)
joystick.container.addEventListener("touchstart", (event) => {
    // Prevent panning while moving
    if (panningTouchId !== null) return;
    for (const touch of event.touches) {
        if (joystick.touchId === null) {
            joystick.isDragging = true;
            joystick.touchId = touch.identifier;
            joystick.startX = touch.clientX;
            joystick.startY = touch.clientY;
            break;
        }
    }
});

// General touchstart event for panning (only if outside joystick and no active panning)
window.addEventListener("touchstart", (event) => {
    // Prevent moving while panning
    if (joystick.isDragging) return;
    for (const touch of event.touches) {
        if (panningTouchId === null && !joystick.container.contains(touch.target)) {
            panningTouchId = touch.identifier;
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            initialQuaternion = controls.object.quaternion.clone();
            initialEuler = new THREE.Euler().setFromQuaternion(initialQuaternion, 'YXZ');
            break;
        }
    }
});

// General touchmove event to handle joystick movement and panning concurrently
window.addEventListener("touchmove", (event) => {
    for (const touch of event.touches) {
        if (touch.identifier === joystick.touchId && joystick.isDragging) {
            // Handle joystick movement
            joystick.deltaX = touch.clientX - joystick.startX;
            joystick.deltaY = touch.clientY - joystick.startY;

            // Apply limit to joystick handle movement
            const limitedMovement = limitJoystickHandle(joystick.deltaX, joystick.deltaY);
            joystick.deltaX = limitedMovement.deltaX;
            joystick.deltaY = limitedMovement.deltaY;

            // Move joystick handle visually within limited area
            joystick.handle.style.transform = `translate(${joystick.deltaX}px, ${joystick.deltaY}px)`;
        } else if (touch.identifier === panningTouchId) {
            // Handle panning
            const touchEndX = touch.clientX;
            const touchEndY = touch.clientY;

            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            const rotationSpeedX = 0.005;
            const rotationSpeedY = 0.005;

            // Calculate new rotation angles
            const newRotationY = initialEuler.y - deltaX * rotationSpeedX;
            let newRotationX = initialEuler.x - deltaY * rotationSpeedY;

            // Clamp rotation to prevent flipping
            newRotationX = Math.max(MAX_TILT_DOWN, Math.min(MAX_TILT_UP, newRotationX));

            const newEuler = new THREE.Euler(newRotationX, newRotationY, 0, 'YXZ');
            controls.object.quaternion.setFromEuler(newEuler);
        }
    }
});

// General touchend event to reset joystick and panning independently
window.addEventListener("touchend", (event) => {
    for (const touch of event.changedTouches) {
        // Reset joystick if necessary
        if (touch.identifier === joystick.touchId) {
            joystick.isDragging = false;
            joystick.deltaX = 0;
            joystick.deltaY = 0;
            joystick.handle.style.transform = 'translate(0, 0)';
            joystick.touchId = null;
        }
        
        // Reset panning if necessary
        if (touch.identifier === panningTouchId) {
            panningTouchId = null;
        }
    }
});

// Animation loop for continuous camera movement based on joystick
function animateJoystickMovement() {
    if (joystick.isDragging && (joystick.deltaX !== 0 || joystick.deltaY !== 0)) {
        moveCameraWithJoystick(joystick.deltaX, joystick.deltaY);
    }
    requestAnimationFrame(animateJoystickMovement);
}

// Start the joystick movement loop
animateJoystickMovement();





// ---------------------------------------- Section: Movement around the gallery ---------------------------------------- //

// Movement flags
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

// Event listeners for key press and release
document.addEventListener("keydown", (event) => {
    if (chatOpen) return; // Disable movement when chat is open
    switch (event.key) {
        case "w":
            moveForward = true;
            break;
        case "s":
            moveBackward = true;
            break;
        case "a":
            moveLeft = true;
            break;
        case "d":
            moveRight = true;
            break;
    }
});

document.addEventListener("keyup", (event) => {
    switch (event.key) {
        case "w":
            moveForward = false;
            break;
        case "s":
            moveBackward = false;
            break;
        case "a":
            moveLeft = false;
            break;
        case "d":
            moveRight = false;
            break;
    }
});

function checkCameraCollisions(movementVector, bufferDistance) {
    const raycaster = new THREE.Raycaster();
    const cameraPosition = camera.position.clone();

    // Normalize the movement vector to create a ray direction
    const rayDirection = movementVector.clone().normalize();

    // Set the raycaster's position and direction
    raycaster.set(cameraPosition, rayDirection);

    // Perform raycasting with collidable objects
    const collisions = raycaster.intersectObjects(collidableWalls, true);

    // Check if any collision is within the buffer distance
    for (const intersect of collisions) {
        if (intersect.distance < bufferDistance) {
            console.log("collided!")
            return true; // Collision detected
        }
    }

    return false; // No collision
}



// ---------------------------------------- Section: Focus on artwork & art overlay ---------------------------------------- //

// Define Raycaster and Mouse Vector
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// State variables (for art overlay)
let isFocused = false; // Tracks if we're in focus mode in front of an artwork
let overlayOpen = false; // Tracks if the overlay is open
let currentFocusedArtwork = null; // Tracks the currently focused artwork

// Event Listener for Mouse Clicks: Add an event listener to handle mouse clicks, update the mouse position, and initiate raycasting.
document.addEventListener('click', onPointerClick, false);

// Helper function to get the top-level visitor object (when clicked)
function getTopLevelVisitor(object) {
    while (object.parent && object.parent.type !== "Scene") {
        object = object.parent;
    }
    return object;
}

 // Flag to block onPointerClick temporarily so that clicking close-btn doesn't retrigger opening the overlay - true when chatoverlay and artoverlay are open
let interactionBlocked = false;

// On pointer click, trigger a whole load of stuff
function onPointerClick(event) {

    if (chatOpen || interactionBlocked) return; // Prevent any action if chat or artwork overlay is open

    const maxDistance = 7; // Set the max distance for raycasting (e.g., 5 units)
    
    // Since we're using PointerLockControls, raycast from the center of the screen instead of mouse coordinates
    raycaster.setFromCamera({ x: 0, y: 0 }, camera);

    // Check for intersections with visitors first, within max raycasting distance
    const visitorIntersections = raycaster.intersectObjects(visitors, true).filter(intersect => intersect.distance <= maxDistance);

    if (visitorIntersections.length > 0) {
        console.log("found visitor");
        const clickedObject = visitorIntersections[0].object;
        const clickedVisitor = getTopLevelVisitor(clickedObject);
        console.log(clickedVisitor);
        console.log(clickedVisitor.userData);
        // Start chat if the visitor is focused on an artwork and is not moving
        if (!clickedVisitor.userData.isMoving && clickedVisitor.userData.currentArtwork) {
            startChatWithVisitor(clickedVisitor);
            console.log(clickedVisitor);
            console.log(clickedVisitor.userData.currentArtwork.userData.imageURL);
            return; // Exit early to avoid checking for artwork interactions
        }
    }
    // Check for intersections with art desc cards
    const artCardIntersections = raycaster.intersectObjects(artCards, true).filter(intersect => intersect.distance <= maxDistance);
    // If intersect, call the open art desc overlay func, passing in the artworkId
    if (artCardIntersections.length > 0) {
        console.log(artCardIntersections[0].object.userData.artworkId);
        showArtworkDescOverlay(artCardIntersections[0].object.userData.artworkId);
        return;
    }

    // Check for intersections with artwork

    // Convert framedArtworks object to an array for raycasting
    const framedArtworksArray = Object.values(framedArtworks);

    // Find intersections with framed artworks
    const artworkIntersects = raycaster.intersectObjects(framedArtworksArray, true).filter(intersect => intersect.distance <= maxDistance); // 'true' to check child objects within groups

    if (artworkIntersects.length > 0) {
        const targetArtwork = artworkIntersects[0].object.parent; // Get the parent group (frame and artwork)
        // Check if we're already focused on this artwork
        if (!isFocused || currentFocusedArtwork !== targetArtwork) {
            // Move to focus on the artwork if not already focused
            focusOnArtwork(targetArtwork);
            currentFocusedArtwork = targetArtwork;
            isFocused = true;
            return;
        } 
    }

    
}

// Function to open Art desc overlay
async function showArtworkDescOverlay(artworkId) {
    try {
        // get a reference to the doc on firestore
        const docRef = doc(db, "spaces", artworkId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // get a reference to the document's data
            const artworkData = docSnap.data();

            // Populate overlay with title and description from the data pulled
            document.getElementById("artwork-title").innerText = artworkData.title;
            document.getElementById("artwork-description").innerText = artworkData.description;

            // Show overlay
            const artworkDescOverlay = document.getElementById("artwork-desc-overlay");
            artworkDescOverlay.classList.remove("hidden");

            // Unlock controls and disable movement
            controls.unlock();
            disableMovement();
        } else {
            console.error("No such document!");
        }
    } catch (error) {
        console.error("Error fetching artwork data:", error);
    }
}

// close art desc overlay
function closeArtworkDescOverlay() {
    const artworkDescOverlay = document.getElementById("artwork-desc-overlay");
    console.log("Closing art overlay...");
    artworkDescOverlay.classList.add("hidden");

    // Block interactions temporarily so that clicking close doesn't retrigger opening the overlay again
    interactionBlocked = true;
    setTimeout(() => {
        interactionBlocked = false; // Unblock interactions after 500ms
    }, 500);

    // Relock pointer controls and re-enable movement
    if (!controls.isLocked) {
        try {
            controls.lock();
        } catch (error) {
            console.error("Failed to lock pointer controls:", error);
        }
    }
}

// Function to Smoothly Focus on Artwork
function focusOnArtwork(artwork) {
    // Calculate the position to move the camera
    const targetPosition = new THREE.Vector3();
    artwork.getWorldPosition(targetPosition); // Get the artwork's world position

    const distance = 2; // Distance from the artwork (adjust as needed for framing)
    const direction = new THREE.Vector3();
    artwork.getWorldDirection(direction);
    direction.negate(); // Invert direction to ensure camera moves in front of the artwork // Get direction the artwork is facing

    // Calculate the target camera position a little back from the artwork
    const cameraTargetPosition = targetPosition.clone().add(direction.multiplyScalar(-distance));

    // Smoothly move the camera to the target position
    window.gsap.to(camera.position, {
        duration: 1,
        x: cameraTargetPosition.x,
        // y: cameraTargewtPosition.y,
        z: cameraTargetPosition.z,
        ease: "power2.inOut",
        onUpdate: () => {
            camera.lookAt(targetPosition); // Continuously update the camera to look at the target during movement
        }
    });

    // Smoothly rotate the camera to face the artwork
    camera.lookAt(targetPosition);
}

// Disable movement function when overlay is open
function disableMovement() {
    moveForward = false;
    moveBackward = false;
    moveLeft = false;
    moveRight = false;
}

// Define the callback function for the observer
const observer = new MutationObserver((mutationsList) => {
    // Loop through all mutations (changes) detected in the DOM
    for (const mutation of mutationsList) {
        // Check if the mutation type is "childList", which means child elements were added or removed
        if (mutation.type === "childList") { 
            // Try to find the "chat-close-btn" element in the DOM
            const chatCloseButton = document.getElementById("chat-close-btn");
            if (chatCloseButton) { // If the button is found
                console.log("Attaching click event to chat-close-btn");
                // Attach a click event listener to the button to call the closeChatOverlay function
                chatCloseButton.addEventListener("click", closeChatOverlay);
                // Stop observing further DOM changes to improve performance since the button was found
                observer.disconnect();
            }
            // Try to find the "artwork-desc-close-btn" element in the DOM
            const artworkDescCloseButton = document.getElementById("artwork-desc-close-btn");
            
            if (artworkDescCloseButton) { // If the button is found
                console.log("Attaching click event to artwork-desc-close-btn");
                // Attach a click event listener to the button to call the closeChatOverlay function
                artworkDescCloseButton.addEventListener("click", closeArtworkDescOverlay);
                // Stop observing further DOM changes to improve performance since the button was found
                observer.disconnect();
            }
        }
    }
});

// Start observing the document body for changes
observer.observe(document.body, {
    childList: true, // Listen for changes to the children of the target node (elements being added or removed)
    subtree: true,   // Also observe all descendants of the target node, not just its direct children
});



// ---------------------------------------- Section: Get AI visitors moving ---------------------------------------- //

// Create an array to hold visitors for reference
const visitors = [];

// Move visitor to artwork
function moveVisitorToArtwork(visitor, visitorIndex) {
    const artworkKeys = Object.keys(framedArtworks);
    if (artworkKeys.length === 0) {
        console.warn("No artworks available to target.");
        return; // Exit if there are no artworks yet
    }

    const targetArtwork = framedArtworks[artworkKeys[Math.floor(Math.random() * artworkKeys.length)]];
    if (!targetArtwork) {
        console.warn("Target artwork not found.");
        return;
    }

    // Get the artwork's world position and rotation
    const targetPosition = new THREE.Vector3();
    targetArtwork.getWorldPosition(targetPosition);

    // console.log(targetArtwork.children[1].material.map.source.data.currentSrc);

    // Calculate the "front-facing" direction based on artwork's rotation
    const direction = new THREE.Vector3(0, 0, 1); // Default forward direction
    direction.applyQuaternion(targetArtwork.quaternion); // Rotate direction to match artwork's orientation
    
    // Define the distance for visitors (a bit further back than the user’s focus distance)
    const visitorDistance = 3;

    // Calculate an offset for each visitor based on index
    const angleOffset = (Math.PI/6.5) * (visitorIndex - 1); // Unique angle offset for each visitor
    // targetArtwork.getWorldDirection(direction).negate(); // Invert to face away from the artwork

    // Calculate the position in front of the artwork with slight lateral offset
    const visitorTargetPosition = targetPosition.clone()
        .add(direction.multiplyScalar(visitorDistance)) // Move back by visitorDistance
        .add(new THREE.Vector3(Math.sin(angleOffset), 0, Math.cos(angleOffset)).multiplyScalar(2)); // Add lateral offset

    // Save the initial y-position of the visitor to ensure hopping only adds to this value
    const initialYPosition = visitor.position.y;

    // Move visitor to target position and face the artwork
    window.gsap.to(visitor.position, {
        duration: 5,
        x: visitorTargetPosition.x,
        z: visitorTargetPosition.z,
        // ease: "power2.inOut",w
        onUpdate: () => {
            // Setup the hopping
            // Calculate the progress of the hop from 0 to 1
            const progress = window.gsap.globalTimeline.time() * 3 % 1;

            // Apply a parabolic effect for each hop
            const hopHeight = 0.1; // Adjust hop height as needed
            const parabolicFactor = 4; // Controls steepness of bounce (higher = sharper bounce)

            // Use a quadratic easing function to simulate a bounce
            const hopOffset = hopHeight * (1 - Math.pow(2 * progress - 1, parabolicFactor));
            visitor.position.y = initialYPosition + hopOffset;
            
            // Orient the visitor to face the artwork
            const adjustedTargetPosition = targetPosition.clone();
            adjustedTargetPosition.y = visitor.position.y; // Maintain the visitor's height to avoid tilting
            visitor.lookAt(adjustedTargetPosition);

        },
        onComplete: () => {
            // Visitor finishes hopping on the ground
            visitor.position.y = initialYPosition

            // Visitor states
            visitor.userData.currentArtwork = targetArtwork;
            visitor.userData.isMoving = false;

            // console.log(`Visitor ${visitor.userData.id} reached artwork and will pause`);

            // Start a countdown for this visitor before it moves to next artwork
            startVisitorCountdown(visitor, visitorIndex);
        }
    });
}

// Set a random countdown for each visitor. If the countdown completes, the visitor moves to a new artwork. 
// If interrupted by a chat, the countdown pauses.
function startVisitorCountdown(visitor, visitorIndex) {
    const countdownTime = THREE.MathUtils.randInt(3000, 10000); // 3 to 10 seconds

    visitorPauseTimers[visitor.userData.id] = setTimeout(() => {
        // If chat is open, don't move; wait until chat closes
        if (!chatOpen || currentChatVisitor !== visitor) {
            visitor.userData.isMoving = true;
            moveVisitorToArtwork(visitor, visitorIndex); // Move to the next artwork
        }
    }, countdownTime);
}

// Delay starting the visitors until artworks are loaded

setTimeout(() => {
    visitors.forEach((visitor, index) => {
        console.log(`Starting movement for visitor ${visitor.userData.id}`);
        moveVisitorToArtwork(visitor, index);
    });
}, 10000); // Delay by 2 seconds to ensure artworks are ready


// ---------------------------------------- Section: Create Visitors with Models ---------------------------------------- //

// Function to load and add visitor model to the scene
function loadVisitorModel(visitorId, modelPath, scaleX, scaleY, scaleZ, positionY, profilePic, name, desc) {
    loader.load(
        modelPath,
        (gltf) => {
            const visitor = gltf.scene;
            
            // Adjust scale and position
            visitor.scale.set(scaleX, scaleY, scaleZ); // Adjust scale as needed
            
            // Add necessary user data to behave like other visitors
            visitor.userData = {
                id: visitorId,
                isMoving: true, // Mark visitor as moving initially
                currentArtwork: null, // Artwork focus starts as null
                profilePic: profilePic,
                name: name,
                desc: desc
            };

            // Apply castShadow and other properties to each mesh in the model
            visitor.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            // Position the visitor randomly within the gallery bounds
            visitor.position.set(
                THREE.MathUtils.randFloatSpread(10), // Random X within bounds
                positionY, // Set to half the height
                THREE.MathUtils.randFloatSpread(10) // Random Z within bounds
            );

            // Add visitor model to the scene and to the visitors array
            scene.add(visitor);
            visitors.push(visitor); // Add to global visitors array for interaction handling
            console.log(visitor);

        },
        undefined,
        (error) => {
            console.error('An error occurred while loading the model:', error);
        }
    );
}

// Load Marshal
loadVisitorModel(1, '/models/marshal.gltf', 0.18, 0.18, 0.18, -0.2, './img/marshal.png', 'Marshal', 'A fan of kool art');
// Load Isabelle
loadVisitorModel(2, '/models/isabelle.gltf', 0.017, 0.017, 0.017, 0.05, './img/isabelle.png', 'Isabelle', 'I love visiting galleries!');
// Load agent S
loadVisitorModel(3, '/models/agent_s.gltf', 7, 7, 7, 0.01, './img/agents.png', 'Agent Hammy', 'Why am I here?');
// Load Celeste
loadVisitorModel(4, '/models/celeste.gltf', 0.045, 0.045, 0.045, 0.02, './img/celeste.png', 'Celeste', 'I love quacking');

// Visitor personalities (one for each visitor): Marshal, Isabelle, Agent S, Celeste
const visitorPersonalities = [
    "Conan O'Brien's humor. Pervy. Talk simply and be rude. Makes silly insults of the user.",
    "Generally an extremely embarrassed person. Randomly and frequently lets out a huge fart.",
    "Is a curt person. Always bidding a specific price for the artwork, but secretly has no money to pay for it. Gets flabbergasted when people finds out he has no money to pay for the art.",
    // "A spy on a secret mission. Wants to share about it, but only if you push hard enough. Something random about naughty or evil hamsters)",
    "An evil scheming royal courtmaiden in a china palace-intrigue soap drama. Shares too much about her schemes to seduce the king and rule the court. Speaks in simple mandarin, in short sentences.",
];


// ---------------------------------------- Section: Chat with Visitors ---------------------------------------- //

let chatOpen = false; // Tracks if a chat is open
let currentChatVisitor = null; // Tracks the visitor currently in chat
let visitorPauseTimers = {}; // Store countdown timers for visitors

// Start chat with visitor and pause countdown
function startChatWithVisitor(visitor) {
    console.log("starting chat with visitor");
    chatOpen = true;
    currentChatVisitor = visitor;

    // Load this visitor's chat history into the chat window
    loadChatHistory(visitor.userData.id);

    // Pause the visitor's countdown timer
    clearTimeout(visitorPauseTimers[visitor.userData.id]);

    // Smoothly pan the camera to focus on the visitor, maintaining current height

    // Get visitor's current position
    const visitorPosition = visitor.position.clone();
    const cameraOffsetDistance = 2; // Set distance from visitor to avoid flipping behind

    // Calculate the direction towards the visitor and position the camera accordingly
    const directionToCamera = new THREE.Vector3();
    visitor.getWorldDirection(directionToCamera);
    directionToCamera.negate().normalize(); // Invert the direction to face the visitor from the front

    const cameraTargetPosition = visitorPosition.clone().add(directionToCamera.multiplyScalar(cameraOffsetDistance));
    cameraTargetPosition.y = camera.position.y; // Maintain the same height for the camera

    window.gsap.to(camera.position, {
        duration: 1,
        x: cameraTargetPosition.x,
        y: cameraTargetPosition.y, // Keep the camera height unchanged
        z: cameraTargetPosition.z,
        ease: "power2.inOut",
        onUpdate: () => {
            camera.lookAt(visitorPosition);
            const updatedTarget = camera.position.clone();
            updatedTarget.y = visitor.position.y;
            visitor.lookAt(updatedTarget); // Make sure visitor faces the camera after the update
        }
    });

    // Pan the camera view slightly to the right of the visitor
    panCameraRight(visitor);

    // Make the visitor face the camera directly
    window.gsap.to(visitor.rotation, {$1y: Math.atan2(camera.position.x - visitor.position.x, camera.position.z - visitor.position.z),
    x: 0, // Prevent tilting upwards or downwards
    z: 0, // Prevent unintended roll
    x: 0, // Prevent tilting upwards or downwards
    z: 0,
        ease: "power2.inOut"
    });

    // Start the conversation with an OpenAI-generated comment about the artwork
    const artworkURL = visitor.userData.currentArtwork.imageURL;
    const artworkId = visitor.userData.currentArtwork.imageId;
    generateArtworkComment(visitor, artworkURL, artworkId);

    showChatOverlay(visitor.userData.profilePic, visitor.userData.name, visitor.userData.desc);
    controls.unlock(); // Unlock controls to disable movement
    disableMovement();
}

// Show chat overlay
function showChatOverlay(profilePic, name, desc) {
    const chatOverlay = document.getElementById("chat-overlay");

    // Update profile picture
    const profilePicElement = document.getElementById("chat-visitor-pp");
    if (profilePicElement) {
        profilePicElement.src = profilePic;  // Set the src attribute for the profile picture
    }

    // Update chat title
    const titleElement = document.getElementById("chat-title");
    if (titleElement) {
        titleElement.textContent = name;  // Set the text content for the title
    }

    // Update chat subtitle
    const subtitleElement = document.getElementById("chat-subtitle");
    if (subtitleElement) {
        subtitleElement.textContent = desc;  // Set the text content for the subtitle
    }

    // Show the chat widget
    chatOverlay.classList.add("visible");
    chatOverlay.classList.remove("hidden");

    // Hide the joystick
    joystickContainer.style.display = 'none';
}

// Pan camera to show the visitor on the left and chat on the right
function panCameraRight(visitor) {
    const visitorPosition = visitor.position.clone();

    // Calculate an offset to the right (along the x-axis)
    const rightwardOffset = new THREE.Vector3(0.8, 0, 0); // Adjust 0.8 as needed for pan distance

    // Apply the offset to the visitor's position to create a new look target
    const targetPosition = visitorPosition.add(rightwardOffset);

    window.gsap.to(camera, {
        duration: 1,
        ease: "power2.inOut",
        onUpdate: () => {
            camera.lookAt(targetPosition);
        }
    });
}

// Load visitor-specific chat history
function loadChatHistory(visitorId) {
    // Clear current chat window
    chatWindow.innerHTML = '';

    // Load chat history for the selected visitor
    chatHistories[visitorId].forEach(message => {
        displayMessage(message.content, message.role === 'user' ? 'user' : 'visitor', false);
    });
}

// Helper function to check if client is on a mobile device 
function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}

// Close chat and resume countdown
function closeChatOverlay() {
    const chatOverlay = document.getElementById("chat-overlay");
    chatOverlay.classList.add("hidden");
    chatOverlay.classList.remove("visible");

    chatOpen = false;
    if (currentChatVisitor) {
        // Calculate the target rotation angle to face the artwork
        const artworkPosition = currentChatVisitor.userData.currentArtwork.position.clone();
        const visitorPosition = currentChatVisitor.position.clone();
        
        // Keep the target's height level with the visitor to prevent tilting
        artworkPosition.y = visitorPosition.y;
        
        // Calculate the desired rotation angle to face the artwork
        const directionVector = new THREE.Vector3().subVectors(artworkPosition, visitorPosition);
        const targetRotationY = Math.atan2(directionVector.x, directionVector.z);

        // Smoothly rotate the visitor to face the artwork using window.gsap
        window.gsap.to(currentChatVisitor.rotation, {
            duration: 1,
            y: targetRotationY,
            ease: "power2.inOut",
            onComplete: () => {
                // Resume countdown for the visitor to move to the next artwork
                resumeVisitorCountdown(currentChatVisitor);
                currentChatVisitor = null;
            }
        });
    }

    // Show joystick only on mobile devices
    if (isMobileDevice()) {
        joystickContainer.style.display = 'block';
    } else {
        joystickContainer.style.display = 'none';
    }

    // Relock pointer for panning
    if (!controls.isLocked) {
        try {
            controls.lock();
        } catch (error) {
            console.error("Failed to lock pointer controls:", error);
        }
    }

    // Block interactions temporarily so that clicking close doesn't retrigger opening the overlay again
    interactionBlocked = true;
    setTimeout(() => {
        interactionBlocked = false; // Unblock interactions after 500ms
    }, 500);
}

// Resume allowing visitors to move around after a chat is ended
function resumeVisitorCountdown(visitor) {
    // Calculate a new countdown time and restart the timer
    const remainingTime = THREE.MathUtils.randInt(3000, 10000); // New random time
    visitorPauseTimers[visitor.userData.id] = setTimeout(() => {
        if (!chatOpen || currentChatVisitor !== visitor) {
            visitor.userData.isMoving = true;
            moveVisitorToArtwork(visitor, visitors.indexOf(visitor));
        }
    }, remainingTime);
}

// Initialize chat histories for each visitor
const chatHistories = {
    1: [], // Visitor 1's chat history
    2: [], // Visitor 2's chat history
    3: [],  // Visitor 3's chat history
    4: [],  // Visitor 4's chat history
    5: [],  // Visitor 5's chat history
    6: []  // Visitor 6's chat history
};

// User chat input and display messages
const chatInput = document.getElementById("user-chat-input");
const chatWindow = document.getElementById("chat-messages");

// Send message on Enter key
chatInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && chatInput.value.trim()) {
        const message = chatInput.value.trim();
        
        // Display the message on chat
        displayMessage(message, 'user', true);
        chatInput.value = ""; // Clear input

        // Remove focus and then refocus to reset cursor and show placeholder
        chatInput.blur();
        setTimeout(() => chatInput.focus(), 0);

        // Send message via OpenAI
        sendMessageToVisitor(currentChatVisitor); // Placeholder function to handle the AI response
    }
});

// Display the sent or received message on the chat window & save it to history
function displayMessage(message, sender, addToHistory) {
    // Create a new div for the chat message
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message");

    // Add specific class based on sender (user or visitor)
    if (sender === 'user') {
        messageElement.classList.add("user-message");
    } else {
        messageElement.classList.add("visitor-message");
    }

    // Create a span to hold the message text
    const messageText = document.createElement("span");
    messageText.innerText = message;

    // Append the message text span to the message element
    messageElement.appendChild(messageText);

    // Append the message element to the chat window
    chatWindow.appendChild(messageElement);

    // Add to the visitor's chat history
    if (currentChatVisitor && addToHistory) {
        chatHistories[currentChatVisitor.userData.id].push({ role: sender, content: message });
    }

    // Auto-scroll to the latest message
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Functions to show and hide typing loader as a message in the chat
function showTypingIndicator() {
    // Create the typing indicator element
    const typingIndicator = document.createElement("div");
    typingIndicator.id = "typing-indicator-message";
    typingIndicator.classList.add("chat-message", "visitor-message");

    // Add dots for the animated effect
    typingIndicator.innerHTML = `
        <div id="typing-indicator">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </div>
    `;

    // Append to chat window
    document.getElementById("chat-messages").appendChild(typingIndicator);

    // Scroll to the latest message
    document.getElementById("chat-messages").scrollTop = document.getElementById("chat-messages").scrollHeight;

    // Add "hmm..." after 5 seconds if still loading
    setTimeout(() => {
        const indicator = document.getElementById("typing-indicator");
        if (indicator) {
            indicator.innerHTML = `
                <span class="hmm">hmm...&nbsp;</span>
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            `;
            // indicator.innerHTML = `
            //     <span class="hmm">!!?! I didn't see you there! I like to spend my time quietly appreciating the pieces, but since that's no longer possible...&nbsp;</span>
            //     // <!-- <div id="typing-indicator" style="margin-top: 10px;">
            //     //     <span class="dot"></span>
            //     //     <span class="dot"></span>
            //     //     <span class="dot"></span>
            //     // </div> -->
            // `;
        }
    }, 4000); // 4 seconds
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById("typing-indicator-message");
    if (typingIndicator) {
        typingIndicator.remove();
    }
}



// ---------------------------------------- Section: AI conversations ---------------------------------------- //

// Visitor response limit to control conversation length
const RESPONSE_LIMIT = 5;

// Chat state
let currentResponseCount = 0;

// Send the message to visitor, and send the visitor's chat history to OpenAI
function sendMessageToVisitor(visitor) {

    // Get the visitor and its chat history
    const visitorId = currentChatVisitor.userData.id;
    const chatHistory = chatHistories[visitorId];

    // Define visitor's personality
    const personality = visitorPersonalities[visitor.userData.id - 1];
    
    // Create OpenAI prompt with visitor's chat history (including new msg)
    const openAIMessages = [
        // set the system instruction to use visitor's personality
        { role: "system", content: `You have this personality: ${personality}.` },
        // loop through the chatHistory array and create an object with all the messages
        ...chatHistory.map(item => ({
            role: item.role === 'user' ? 'user' : 'assistant',
            content: item.content
        }))
    ];

    // Show typing indicator
    showTypingIndicator();

    // Call open AI
    getOpenAIResponse(openAIMessages)
        .then(visitorMessage => {
            // hide typing indicator
            hideTypingIndicator();

            // display AI message
            displayMessage(visitorMessage, 'visitor', true);
            currentResponseCount++;
        })
        .catch(error => {
            console.error("Error generating response:", error);
        });

    
}

// Helper function to generate artwork comment. Calls the general OpenAI interaction function
async function generateArtworkComment(visitor, artworkURL, artworkId) {
    
    // Show typing indicator
    showTypingIndicator();

    // Identify the personality to use
    const personality = visitorPersonalities[visitor.userData.id - 1];

    // Proxy the image file from DB via cloud functions -> to clean it up for OpenAI to consume
    const proxyFunctionUrl = 'https://getimageproxy-fegobqnsiq-uc.a.run.app';
    const filePath = `art/${artworkId}.jpg`; // Adjust this to match your Firebase file structure
    const imageURL = `${proxyFunctionUrl}?path=${encodeURIComponent(filePath)}`;
    
    // Create prompt
    // const artPrompt = `You have ${personality}. Tell me what you're thinking about this artwork?`;
    const openAIMessages = [
        // set the system instruction to use visitor's personality
        { role: "system", content: `You are in an art gallery, and you have this personality: ${personality}.` },
        {
            role: "user",
            content: [
              { type: "text", "text": "What are you thinking as you look at this art? In less than 60 words."},
              {
                type: "image_url",
                image_url: {
                  "url": imageURL,
                },
              },
            ],
          }
    ];

    getOpenAIResponse(openAIMessages)
        .then(visitorMessage => {
            hideTypingIndicator();
            displayMessage(visitorMessage, 'visitor', true);
            currentResponseCount++;
        })
        .catch(error => {
            console.error("Error generating response:", error);
        });
}


// OpenAI general interaction function for all messages with retry and timeout
// Takes params for message payload, how many max retries, the initial delay between retries, and max timeout to set below calling off the request
async function getOpenAIResponse(messages, maxRetries = 3, initialDelay = 1000, timeout = 10000) {
    // Setting up the config for calling the completions API (POST) via firebase cloud functions
    const url = "https://fetchopenairesponse-fegobqnsiq-uc.a.run.app";
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: messages,
        }),
    };

    let attempt = 0; // Track retry attempts
    let delay = initialDelay; // Initial delay for retries

    // Helper function to handle fetch with timeout
    const fetchWithTimeout = async (url, options, timeout) => {
        // creates an abort controller that lets us abort the API request
        const controller = new AbortController();
        // When time from request start hits timeout, abort the fetch request
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        // call the fetch request, with the options passed in + property to listen to the abort signal
        try {
            return await fetch(url, { ...options, signal: controller.signal });
        } catch (error) {
            // throw the abort error if it timeouts
            if (error.name === "AbortError") {
                throw new Error("Request timed out");
            }
            throw error; // Rethrow other errors
        } finally {
            clearTimeout(timeoutId); // Clear timeout if fetch completes
        }
    };

    // Call the fetch request with exponential backoff retry 
    while (attempt < maxRetries) {
        try {
            // Attempt fetch with timeout
            const response = await fetchWithTimeout(url, options, timeout);

            // Handle non-OK responses
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${await response.text()}`);
            }

            // Parse and return the response content
            const data = await response.json();
            return data.choices[0].message.content;

        } catch (error) {
            attempt++; // Increment attempt count

            // Stop retrying after max attempts
            if (attempt >= maxRetries) {
                console.error(`Failed after ${maxRetries} attempts: ${error.message}`);
                throw error; // Rethrow error after all retries fail
            }

            // Log retry information
            if (error.message === "Request timed out") {
                console.warn(`Attempt ${attempt} timed out. Retrying in ${delay}ms...`);
            } else {
                console.warn(`Attempt ${attempt} failed: ${error.message}. Retrying in ${delay}ms...`);
            }

            // Wait for delay before retrying
            await new Promise((resolve) => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
        }
    }
}


// ---------------------------------------- Section: Render and animate ---------------------------------------- //

// Position the camera and render the scene
camera.position.set(-13.2, 1.4, 14);
camera.lookAt(0, 1.6, 0);



// Update Camera Position Based on Movement

function animate() {
    requestAnimationFrame(animate);

    const moveSpeed = 0.15; // Movement speed
    const bufferDistance = 0.85; // Buffer distance to prevent clipping through walls
    const direction = new THREE.Vector3();
    const velocity = new THREE.Vector3();

    // Calculate movement velocity based on key presses
    if (moveForward) velocity.z += moveSpeed;
    if (moveBackward) velocity.z -= moveSpeed;
    if (moveLeft) velocity.x -= moveSpeed;
    if (moveRight) velocity.x += moveSpeed;

    // ----- Forward/Backward Movement ----- //
    controls.getDirection(direction);
    direction.y = 0; // Ensure movement is only horizontal
    direction.normalize();

    // Handle forward/backward movement
    const forwardVector = direction.clone().multiplyScalar(velocity.z);
    if (!checkCameraCollisions(forwardVector, bufferDistance)) {
        camera.position.add(forwardVector);
    }

    // ----- Strafing Movement ----- //
    const strafeDirection = new THREE.Vector3();
    strafeDirection.setFromMatrixColumn(camera.matrix, 0); // Get strafe direction (left/right)
    strafeDirection.y = 0; // Ensure movement is only horizontal
    strafeDirection.normalize();

    // Handle left/right strafing
    const strafeVector = strafeDirection.clone().multiplyScalar(velocity.x);
    if (!checkCameraCollisions(strafeVector, bufferDistance)) {
        camera.position.add(strafeVector);
    }

    // Render the scene
    renderer.render(scene, camera);
}
animate();

