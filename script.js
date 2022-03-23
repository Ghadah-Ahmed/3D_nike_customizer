const LOADER = document.getElementById('js-loader');
const DRAG_NOTICE = document.getElementById('js-drag-notice');
const MODEL_PATH = "newNikeShoes.glb";
const TRAY = document.getElementById('js-tray-slide');
var activeOption = 'base_red';
var loaded = false;
var theModel;




// Init the scene
const BACKGROUND_COLOR = 0xededed;
const scene = new THREE.Scene();
scene.background = new THREE.Color(BACKGROUND_COLOR);
scene.fog = new THREE.Fog(BACKGROUND_COLOR, 20, 100);



// Init the renderer
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);





// Init the camera
var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.set(0,  0, Math.PI* 1.75)
camera.position.z = 5;
camera.position.x = 0;




// Init the object loader
var loader = new THREE.GLTFLoader();

loader.load(MODEL_PATH, function (gltf) {
  theModel = gltf.scene;

  theModel.traverse(o => {
    if (o.isMesh) {
      o.castShadow = true;
    }
  });

  theModel.scale.set(0.07,0.07,0.07);
  theModel.rotation.y = Math.PI;
  theModel.position.y = 1/2;

  for (let object of INITIAL_MAP) {
    initColor(theModel, object.childID, object.mtl);
  }

  scene.add(theModel);
  LOADER.remove();

}, undefined, function (error) {
  console.error(error);
});

function initColor(parent, type, mtl) {
  parent.traverse(o => {
    if (o.isMesh) {
      if (o.name.includes(type)) {
        o.material = mtl;
        o.nameID = type;
      }
    }
  });
}







// Add lights
var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
hemiLight.position.set(0, 50, 0);
scene.add(hemiLight);

var dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
dirLight.position.set(0, 12, 0);
dirLight.castShadow = true;
dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
scene.add(dirLight);
// const helper = new THREE.DirectionalLightHelper( dirLight, 5, 0x00000 );
// scene.add( helper );




// Floor
var floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
var floorMaterial = new THREE.MeshPhongMaterial({
  color: 0xcacaca,
  shininess: 0 });
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -0.5 * Math.PI;
floor.receiveShadow = true;
floor.position.y = -0.5;
scene.add(floor);





// Add controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 1/2;


// GUI stuff
// var gui = new dat.GUI();
// const parameters = {
//   color: 0xcacaca,
//   backgroundColor: 0xededed
// }

// gui.addColor(parameters, 'color')
//   .onChange(() =>
//   {
//     floorMaterial.color.set(parameters.color)
//   })


//   gui.addColor(parameters, 'backgroundColor')
//   .onChange(() =>
//   {
//     scene.background.set(parameters.backgroundColor)
//   })




// Ticking Function
function tick() {
  TWEEN.update()
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  if (theModel != null && loaded == false) {
    initialRotation();
    DRAG_NOTICE.classList.add('start');
  }
}
tick();






// Function - New resizing method
function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  var width = window.innerWidth;
  var height = window.innerHeight;
  var canvasPixelWidth = canvas.width / window.devicePixelRatio;
  var canvasPixelHeight = canvas.height / window.devicePixelRatio;

  const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
  if (needResize) {

    renderer.setSize(width, height, false);
  }
  return needResize;
}




// Function - Opening rotate
let initRotate = 0;

function initialRotation() {
  initRotate++;
  if (initRotate <= 120) {
    theModel.rotation.y += Math.PI / 60;
  } else {
    loaded = true;
  }
}


function rotate() {
  
  var position = new THREE.Vector3().copy(camera.position);
  
  switch (activeOption) {
    case 'cord':
      var targetPosition = new THREE.Vector3( 3.303009020345758, 3.735748080264962, -0.36649378209073846)
      break;
    case 'redcollar':
      var targetPosition = new THREE.Vector3( -3.972011662713949, 1.106024362526963, 2.8283976843367014)
      break;
    case 'nikelogo':
      var targetPosition = new THREE.Vector3( 0.8628693541187763, 1.3959290576157624, -4.723011596833821)
      break;
    case 'Lateral':
      var targetPosition = new THREE.Vector3( 0.8628693541187763, 1.3959290576157624, -4.723011596833821)
      break;
    case 'upper':
      var targetPosition = new THREE.Vector3( 4.330702975099887, 1.7539102903210146, -1.7801152869876344)
      break;
    case 'base_red':
      var targetPosition = new THREE.Vector3( 0,  3.061616997868383e-16, 5)
      break;
    case 'base_white':
      var targetPosition = new THREE.Vector3( 0,  3.061616997868383e-16, 5)
      break;
    case 'lateralCords':
      var targetPosition = new THREE.Vector3( 4.152364869654248, 2.784607166921198, 0.06187822874377939)
      break;
    case 'Counter':
      var targetPosition = new THREE.Vector3( -3.7917032106224116, 0.488939608237075, 3.222409784936214)
      break;
    case 'counterlinning':
      var targetPosition = new THREE.Vector3( -2.4998330171955283, 1.1592820317147576, -4.172157721980621)   
      break;
  }
  
  var tween = new TWEEN.Tween(position)
      .to(targetPosition, 1000)
      .easing( TWEEN.Easing.Linear.None )
      .onUpdate(function () {
          camera.position.copy(position);
          camera.lookAt( controls.target );
      })
      .onComplete(function () {
          camera.position.copy( targetPosition );
          camera.lookAt( controls.target );
          controls.enabled = true;
          highlightMaterial( activeOption)
      })
      .start();

  }

  function highlightMaterial( type) {
    theModel.traverse(o => {
      if (o.isMesh && o.nameID != null) {
        if (o.nameID.includes(type)) {
        //  console.log( o.material.color )
         new TWEEN.Tween(o.material.color).to({r: 5, g: 3, b: 5}, 100).repeat(1).yoyo(true) .start()
        }
      }
    });
  }
  