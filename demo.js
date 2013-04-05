var textures = "http://commondatastorage.googleapis.com/voxeltextures/"
require('voxel-hello-world')({
  texturePath: textures,
  playerSkin: textures + 'player.png'
})
var stopMotion = require('./')(game)
window.stop = stopMotion

stopMotion.cam.position.y = 4


