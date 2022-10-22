import * as THREE from "../lib/three.module.js";
import {OrbitControls} from "../lib/OrbitControls.module.js";
import {BrazoRobotico} from "./brazo_robotico.js";
import {Habitacion} from "./habitacion.js";
import {GUI} from "../lib/lil-gui.module.min.js"; 
import {TWEEN} from "../lib/tween.module.min.js";

// Variables estandar
let renderer, scene, camera, cameraOrtho, cameraControls, cameraHelper;
const L =40;

// Otras globales
let robot, suelo, insetWidth, insetHeight, brazoRobotico;
let angulo = 0;

// Acciones
init();
loadScene();
render();


function init()
{
    //Inicializacion de camaras
    const ar = window.innerWidth / window.innerHeight;
    setCameras(ar);

    //Inicializacion de la escena
    scene = new THREE.Scene();
    
    // scene.add(camera);
    // scene.add(cameraOrtho)

    //Inicializacion del motor de render
    renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: true});
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.setClearColor(0x7c7b82);
    document.getElementById('container').appendChild( renderer.domElement );
    renderer.autoClear = false;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    //Inicializacion del control de camara
    cameraControls = new OrbitControls( camera, renderer.domElement );
    cameraControls.minDistance = 100;
    cameraControls.maxDistance = 500;
    cameraControls.target.set(0,200,0);

    //Add lights
    lights();

    //Inicializacion de eventos
    window.addEventListener('resize',onWindowResize);
    window.addEventListener('keydown',onKeyDown);
    onWindowResize();

    initGui();
}

function lights(){
     //lights
     const ambient = new THREE.AmbientLight(0x4f1c16);
     scene.add( ambient );

    const direccional = new THREE.DirectionalLight(0xFFFFFF,0.2);
    direccional.position.set(0,1,0)
    //scene.add(new THREE.DirectionalLightHelper( direccional, 200));
    scene.add(direccional);

    const focal1 = createSpotlight( 0x4f1c16 );
	const focal2 = createSpotlight( 0x4f1c16 );
	const focal3 = createSpotlight( 0x4f1c16);
    focal1.position.set( 250, 500, 150 );
	focal2.position.set( 0, 500, -200 );
	focal3.position.set( - 250, 500, 150 );
    // const focal1Helper = new THREE.SpotLightHelper( focal1, 0.9);
    // const focal2Helper = new THREE.SpotLightHelper( focal2, 0.9 );
    // const focal3Helper = new THREE.SpotLightHelper( focal3, 0.9 );
    // scene.add( focal1Helper );
    // scene.add( focal2Helper );
    // scene.add( focal3Helper );
    scene.add(focal1);
    scene.add(focal2);
    scene.add(focal3);
}

function createSpotlight( color ) {

    const newObj = new THREE.SpotLight( color, 0.5 );
    // newObj.shadow.mapSize.width = 1024;  
    // newObj.shadow.mapSize.height = 1024;
    newObj.castShadow = true;
    newObj.angle = 0.6;
    newObj.penumbra = 0.3;
    newObj.decay = 2;
    //newObj.distance = 800;
    //newObj.angle= Math.PI/7;
    //newObj.shadow.camera.near = 800;
    newObj.shadow.camera.far = 4000;
    newObj.shadow.camera.fov = 30;
    return newObj;

}

function setCameras(ar){
    let camaraOrtografica;
    if(ar>1)
        
        camaraOrtografica = new THREE.OrthographicCamera(-L*ar, L*ar, L,-L,1,1000);
    else
        camaraOrtografica = new THREE.OrthographicCamera(-L, L, L/ar,-L/ar,1,1000);
    //perspective camera
    camera = new THREE.PerspectiveCamera( 70, ar, 0.01, 1900);
    camera.position.y = 340;
    camera.position.z = 200;

    //cameraOrtho
    cameraOrtho = camaraOrtografica.clone();
    cameraOrtho.position.set(0,340,0);
    cameraOrtho.lookAt(0,-0,0);
    //cameraOrtho.up.set(0,1,0)

    //ayudante de camara
    cameraHelper = new THREE.CameraHelper(camera);

    //camera.add(cameraOrtho);
}
function initGui() {
    const gui = new GUI({'title':'Control robot'});
    const obj = { 
        giroBase: 0,
        giroBrazo: 0,
        giroAntebrazoY:0,
        giroAntebrazoZ:0,
        giroPinza:0,
        separacionPinza:10,
        alambres: false,
        anima: function(){
            var position = { 
                giroBase:0,
                giroBrazo:0,
                giroAntebrazoY:0,
                giroAntebrazoZ:0,
                giroPinza:0,
                separacionPinza:0,
            };

            var tween_to = new TWEEN.Tween( position )
                .to( { 
                    giroBase:-180,
                    giroBrazo:20,
                    giroAntebrazoY:180,
                    giroAntebrazoZ:-20,
                    giroPinza:200,
                    separacionPinza:15, 
                }, 5000 )
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(()=>{
                    brazoRobotico.rotateBase(position.giroBase);
                    giroBase.setValue(position.giroBase);
                    brazoRobotico.rotateBrazo(position.giroBrazo);
                    giroBrazo.setValue(position.giroBrazo);
                    brazoRobotico.rotateAnteBrazo(position.giroAntebrazoY);
                    giroAntebrazoY.setValue(position.giroAntebrazoY);
                    brazoRobotico.rotateAnteBrazo1(position.giroAntebrazoZ);
                    giroAntebrazoZ.setValue(position.giroAntebrazoZ);
                    brazoRobotico.rotatePinza(position.giroPinza);
                    giroPinza.setValue(position.giroPinza);
                    brazoRobotico.openPinza(position.separacionPinza);
                    separacionPinza.setValue(position.separacionPinza);
                });
            var tween_fro = new TWEEN.Tween( position )
                .to( { 
                    giroBase:90,
                    giroBrazo:10,
                    giroAntebrazoY:-90,
                    giroAntebrazoZ:90,
                    giroPinza:20,
                    separacionPinza:1.5,  
                }, 5000 )
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(()=>{
                    brazoRobotico.rotateBase(position.giroBase);
                    giroBase.setValue(position.giroBase);
                    brazoRobotico.rotateBrazo(position.giroBrazo);
                    giroBrazo.setValue(position.giroBrazo);
                    brazoRobotico.rotateAnteBrazo(position.giroAntebrazoY);
                    giroAntebrazoY.setValue(position.giroAntebrazoY);
                    brazoRobotico.rotateAnteBrazo1(position.giroAntebrazoZ);
                    giroAntebrazoZ.setValue(position.giroAntebrazoZ);
                    brazoRobotico.rotatePinza(position.giroPinza);
                    giroPinza.setValue(position.giroPinza);
                    brazoRobotico.openPinza(position.separacionPinza);
                    separacionPinza.setValue(position.separacionPinza);
                });
            tween_to.chain( tween_fro );
            tween_fro.chain( tween_to );

            tween_to.start();
            
        }
    }

    var giroBase = gui.add( obj, 'giroBase', -180, 180 ).onChange(value=>{
        brazoRobotico.rotateBase(value);
    }); // min, max
    var giroBrazo = gui.add( obj, 'giroBrazo', -45, 45).onChange(value=>{
        brazoRobotico.rotateBrazo(value);
    });// min, max, step
    var giroAntebrazoY = gui.add( obj, 'giroAntebrazoY', -180, 180).onChange(value=>{
        brazoRobotico.rotateAnteBrazo(value);
    });// min, max, step // min, max, step
    var giroAntebrazoZ = gui.add( obj, 'giroAntebrazoZ', -90, 90).onChange(value=>{
        brazoRobotico.rotateAnteBrazo1(value);
    });// min, max, step
    var giroPinza = gui.add( obj, 'giroPinza', -40, 220).onChange(value=>{
        brazoRobotico.rotatePinza(value);
    }); // min, max, step
    var separacionPinza = gui.add( obj, 'separacionPinza', 0, 15).onChange(value=>{
        brazoRobotico.openPinza(value);
    }); // min, max, step
    gui.add( obj, 'alambres').onChange(value=>{
        brazoRobotico.changeWireframe(value);
        suelo.material.wireframe = value;
    }); // min, max, step
    gui.add( obj, 'anima'); // min, max, step
}

function onWindowResize(){
    //actualizamos la matriz de proyeccion de la camara
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    //actualizamos las dimesiones del render
    renderer.setSize( window.innerWidth, window.innerHeight );
    
    const minDim = Math.min( window.innerWidth, window.innerHeight );
    insetWidth = minDim / 4;
    insetHeight = minDim / 4;
    
    //actualizamos la matriz de proyeccion de la camaraOrtografica
    cameraOrtho.aspect = insetWidth / insetHeight;
    cameraOrtho.updateProjectionMatrix();
}

function onKeyDown(e){
    switch (e.keyCode) {
        case 37:
        robot.position.x -= 10.0;
        break;
        case 38:
        robot.position.z -= 10.0;
        break;
        case 39:
        robot.position.x += 10.0;
        break;
        case 40:
        robot.position.z += 10.0;
        break;
      }
}

function loadScene()
{
    brazoRobotico =  new BrazoRobotico(false);
    robot = brazoRobotico.model();
    
    const texsuelo = new THREE.TextureLoader().load("../textures/metallic.jpg");
    texsuelo.repeat.set(4,5);
    texsuelo.wrapS= texsuelo.wrapT = THREE.RepeatWrapping;
    const matsuelo = new THREE.MeshStandardMaterial({color:"rgb(150,150,150)",map:texsuelo});
    //const sueloMaterial = new THREE.MeshNormalMaterial({wireframe:false, flatShading: true});
    suelo = new THREE.Mesh( new THREE.PlaneGeometry(1000,1000, 20,20), matsuelo );
    suelo.receiveShadow = true;
    suelo.rotation.x = -Math.PI/2;
    suelo.position.y = -0.2;
    suelo.position.z= 0;
    scene.add(suelo);
    scene.add( robot);
    scene.add(new Habitacion('../textures/habitacion/').model())
    //scene.add(new THREE.AxesHelper(120))
}

function update()
{
    angulo += 0.01;
    robot.rotation.y = angulo;
    
}

function render()
{
    requestAnimationFrame(render);
    TWEEN.update();
    renderer.clear();
    //update();
    //let dim = Math.min(window.innerWidth, window.innerHeight)/4;
    renderer.setScissorTest( true );
    renderer.setScissor( 0, window.innerHeight - insetHeight, insetWidth, insetHeight );
    renderer.setViewport( 0, window.innerHeight - insetHeight, insetWidth, insetHeight );
    renderer.render( scene, cameraOrtho );
    renderer.setScissorTest( false );
    //renderer.setClearColor(0x7c7b82);
    renderer.setViewport(0,0,window.innerWidth,window.innerHeight);
    renderer.render(scene,camera);

}