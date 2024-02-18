<template>
  <div class="welcome" ref="welcome"></div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
const welcome = ref()
let camera: any, scene: any, renderer: any
let height = ref<number>(0)
let width = ref<number>(0)

/* 获取容器宽高 */
function getWrapperSize() {
  const rect = welcome.value.getBoundingClientRect()
  height.value = rect.height
  width.value = rect.width
}

onMounted(() => {
  getWrapperSize()
  init()
})

onActivated(() => {
  onWindowResize()
})

function init() {
  camera = new THREE.PerspectiveCamera(40, width.value / height.value, 1, 10000)
  camera.position.set(0, -400, 600)
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)
  const loader = new FontLoader()
  loader.load('/node_modules/three/examples/fonts/helvetiker_regular.typeface.json', function (font) {
    const color = 0x3b3b3b
    const matDark = new THREE.LineBasicMaterial({
      color: color,
      side: THREE.DoubleSide
    })
    const matLite = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide
    })
    const message = '   Welcome\nLeslieBlog.'
    const shapes = font.generateShapes(message, 100)
    const geometry = new THREE.ShapeGeometry(shapes)
    geometry.computeBoundingBox()
    const xMid = -0.5 * (geometry.boundingBox!.max.x - geometry.boundingBox!.min.x)
    geometry.translate(xMid, 0, 0)
    const text = new THREE.Mesh(geometry, matLite)
    text.position.z = -150
    scene.add(text)
    const holeShapes = []

    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i]
      if (shape.holes && shape.holes.length > 0) {
        for (let j = 0; j < shape.holes.length; j++) {
          const hole = shape.holes[j]
          holeShapes.push(hole)
        }
      }
    }

    shapes.push.apply(shapes, holeShapes as any)
    const lineText = new THREE.Object3D()
    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i]
      const points = shape.getPoints()
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      geometry.translate(xMid, 0, 0)
      const lineMesh = new THREE.Line(geometry, matDark)
      lineText.add(lineMesh)
    }
    scene.add(lineText)
    render()
  })

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width.value, height.value)
  welcome.value.appendChild(renderer.domElement)
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, -100, 0)
  controls.update()
  controls.addEventListener('change', render)
  window.addEventListener('resize', onWindowResize)
}

function onWindowResize() {
  getWrapperSize()
  nextTick(() => {
    camera.aspect = width.value / height.value
    camera.updateProjectionMatrix()
    renderer.setSize(width.value, height.value)
    render()
  })
}

function render() {
  renderer.render(scene, camera)
}
</script>

<style lang="scss" scoped>
.welcome {
  width: 100%;
  height: 100%;
}
</style>
