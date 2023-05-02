import * as THREE from './three.js-master/build/three.module.js'
import { OrbitControls } from './three.js-master/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from './three.js-master/examples/jsm/loaders/GLTFLoader.js'

var scene, renderer,camera 
renderer = new THREE.WebGLRenderer({
    antialias:true
});

scene = new THREE.Scene();

var FOV = 45;
var ratio = window.innerWidth / window.innerHeight;
var near = 1;
var far = 100;


camera = new THREE.PerspectiveCamera(FOV,ratio,near,far);
camera.position.set(0,12,30);
camera.lookAt(0,0,0);

var controller = new OrbitControls(camera,renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


window.onresize = () =>{
    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width,height);
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
}
renderer.setClearColor(0x303030)
renderer.render(scene,camera);

let renderFunction = ()=>{
    renderer.render(scene,camera);
    requestAnimationFrame(renderFunction)
    controller.update();
}

var createPlane = ()=>{
    let planeGeo = new THREE.PlaneGeometry(30,30);
    let planeMaterial = new THREE.MeshPhongMaterial({
        side:THREE.DoubleSide,
        color: 0x033069
    })
    let plane = new THREE.Mesh(planeGeo,planeMaterial);
    plane.position.set(0,0,0);
    plane.rotation.set(11,0,0);
    plane.receiveShadow = true;
    scene.add(plane);
}

var toriGate = new GLTFLoader().load('./Assets/japanese_tori_gate/scene.gltf', (tori)=>{
    let model = tori.scene;
    model.scale.set(0.5,0.5,0.5);
    model.position.set(0,4,-6);
    scene.add(model)
})

let textureLoader = new THREE.TextureLoader();
let boxMaterialArr = [
    new THREE.MeshBasicMaterial({
        map:textureLoader.load('./Assets/skybox/yellowcloud_rt.jpg'),
        side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
        map:textureLoader.load('./Assets/skybox/yellowcloud_lf.jpg'),
        side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
        map:textureLoader.load('./Assets/skybox/yellowcloud_up.jpg'),
        side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
        map:textureLoader.load('./Assets/skybox/yellowcloud_dn.jpg'),
        side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
        map:textureLoader.load('./Assets/skybox/yellowcloud_ft.jpg'),
        side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
        map:textureLoader.load('./Assets/skybox/yellowcloud_bk.jpg'),
        side: THREE.DoubleSide
    }),
]

let boxGeometry = new THREE.BoxGeometry(100,100,100);
let SkyBox = new THREE.Mesh(boxGeometry, boxMaterialArr);
scene.add(SkyBox);

let createSphere = ()=>{
    let sphereGeo = new THREE.SphereGeometry(1,64,64);
    let sphereMater = new THREE.MeshStandardMaterial({
        color: 0x7B3F00
    })
    let sphereMesh = new THREE.Mesh(sphereGeo,sphereMater);
    sphereMesh.position.y = 2;
    sphereMesh.position.x = 0
    sphereMesh.position.z = -3    
    sphereMesh.castShadow = true;   
    scene.add(sphereMesh);
}

let directionalLight = new THREE.DirectionalLight(0xFFE87C, 5);
directionalLight.position.y = 20;
directionalLight.position.z = 20;
directionalLight.castShadow = true;
let directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(directionalLight);
scene.add(directionalLightHelper);

renderer.shadowMap.enabled = true;


createPlane()
createSphere()
renderFunction();
