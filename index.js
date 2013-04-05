var createCameraControl = require('voxel-camera');
var texture = require('voxel-texture')
module.exports = StopMotion

function StopMotion(game, options) {
  if (!options) options = {}
  if (!(this instanceof StopMotion)) return new StopMotion(game, options)
  this.cameraTextures = options.cameraTextures || './camera/'
  this.game = game
  
  this._materialEngine = texture({
    texturePath: this.cameraTextures,
    THREE: this.game.THREE
  });
  
  // Create a camera control, pass a copy of the game
  this.cameraControl = createCameraControl(game);

  // Add the camera to the scene
  this.cam = this.cameraControl.camera()
  game.scene.add(this.cam);
  
  this.cameraHelper = new game.THREE.CameraHelper(this.cam)
  game.scene.add(this.cameraHelper)
  
  this.createEncoder()
}

StopMotion.prototype.createEncoder = function(width, height) {
  var encoder = new GIFEncoder();
  encoder.setRepeat(0); //0 -> loop forever //1+ -> loop n times then stop 
  encoder.setDelay(500); //go to next frame every n milliseconds
  encoder.start();
  this.encoder = encoder
}

StopMotion.prototype.shutter = function(width, height) {
  var self = this
  var renderer = this.game.view.renderer
  width = width || 400, height = height || 300
  
  renderer.setSize( width, height )
  this.cam.aspect = width/height
  this.cam.updateProjectionMatrix()
  this.cameraHelper.visible = false
  
  this.cameraControl.render();
  renderer.render(this.game.scene, this.cam);
  var png = renderer.domElement.toDataURL('image/png')
  

  this.cam.aspect = window.innerWidth / window.innerHeight
  this.cam.updateProjectionMatrix()
  renderer.setSize( window.innerWidth, window.innerHeight )
  this.cameraHelper.visible = true

  var canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  var ctx = canvas.getContext('2d')
  var img = new Image()
  img.onload = function() {
    ctx.drawImage(img, 0, 0)
    self.encoder.addFrame(ctx)
  }
  // canvas = false
  img.src = png
  return png
}

StopMotion.prototype.export = function() {
  this.encoder.finish();
  var gif = this.encoder.stream().getData()
  this.createEncoder()
  return 'data:image/gif;base64,' + btoa(gif)
}

