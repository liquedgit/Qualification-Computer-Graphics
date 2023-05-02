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

var currCam;
camera = new THREE.PerspectiveCamera(FOV,ratio,near,far);
var camera2 = new THREE.PerspectiveCamera(FOV,ratio, near,far);
camera2.position.set(0,12,-30)
camera.position.set(0,12,30);
camera.lookAt(0,0,0);
currCam = camera;

var controller1 = new OrbitControls(camera,renderer.domElement);
var controller2 = new OrbitControls(camera2,renderer.domElement);


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
renderer.render(scene,currCam);

let renderFunction = ()=>{
    renderer.render(scene,currCam);
    requestAnimationFrame(renderFunction)
    if(currCam === camera){
        controller1.update()
    }else{
        controller2.update()
    }
    myCone.rotation.y +=0.05
}

var createPlane = ()=>{
    let planeGeo = new THREE.PlaneGeometry(50,50);
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
    sphereMesh.position.set(-4,6.5,6)
    sphereMesh.castShadow = true;   
    scene.add(sphereMesh);
    return sphereMesh;
}

let createCone = ()=>{
    let coneGeo = new THREE.ConeGeometry(1,2,5);
    let coneMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x5234eb
    });
    let coneMesh = new THREE.Mesh(coneGeo, coneMaterial);
    coneMesh.position.set(4,6,6);
    coneMesh.rotation.x = 3.2
    coneMesh.castShadow=true
    scene.add(coneMesh);
    return coneMesh;
}

let createBox = ()=>{
    let boxGeo = new THREE.BoxGeometry(2,2,6);
    let boxMaterial = new THREE.MeshLambertMaterial({
        color:0x4287f5
    });
    let boxMesh = new THREE.Mesh(boxGeo,boxMaterial);
    boxMesh.rotation.x = 4.7
    boxMesh.position.set(4, 2, 6)
    boxMesh.castShadow = true
    scene.add(boxMesh);
    return boxMesh;
}

let createCylinder = ()=>{
    let CylinderGeo = new THREE.CylinderGeometry(1,1,5.5);
    let CylinderMaterial = new THREE.MeshNormalMaterial();
    let CylinderMesh = new THREE.Mesh(CylinderGeo,CylinderMaterial);
    CylinderMesh.position.set(-4,2.5,6)
    CylinderMesh.castShadow = true;
    scene.add(CylinderMesh);
    return CylinderMesh;
}

let directionalLight = new THREE.DirectionalLight(0xFFFFFF, 2);
directionalLight.position.y = 20;
directionalLight.position.z = 20;
directionalLight.castShadow = true;
let directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(directionalLight);
// scene.add(directionalLightHelper);

let spotLight = new THREE.SpotLight(0xFFFFFF,4);
spotLight.position.y = 20;
spotLight.position.x = 15
spotLight.position.z = -10;
let spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);
scene.add(spotLight);

renderer.shadowMap.enabled = true;

window.addEventListener('keypress', (e)=>{
    if(e.key === 'c' && currCam===camera){
        currCam=camera2;
    }else{
        currCam = camera;
    }
})

//raycast
const raycaster= new THREE.Raycaster();
const pointer = new THREE.Vector2();
// const rayOrigin = new THREE.Vector3();

window.addEventListener('pointerdown', (e)=>{

    //middle click to delete
    if(e.button === 1){
        pointer.x = (e.clientX / window.innerWidth) * 2 -1;
        pointer.y = - (e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, currCam);
        let intersects = raycaster.intersectObjects(scene.children);
        scene.remove(intersects[0].object)
    }
})

createCylinder()
var myCone = createCone();
createBox();
createPlane()
createSphere()
renderFunction();
