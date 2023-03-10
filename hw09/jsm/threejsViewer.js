import * as THREE from "../threejs/build/three.module.js";
import { MarchingCubes } from '../threejs/examples/jsm/objects/MarchingCubes.js'
import { OrbitControls } from '../threejs/examples/jsm/controls/OrbitControls.js'

class threejsViewer {
    constructor(domElement) {
        this.size = 0
        this.databuffer = null
        this.textureOption = 0
        this.threshold = 75
        this.enableLine = false

        let width = domElement.clientWidth;
        let height = domElement.clientHeight;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0xE6E6FA, 1.0)
        domElement.appendChild(this.renderer.domElement);

        // Scene
        this.scene = new THREE.Scene();

        // Camera
        let aspect = window.innerWidth / window.innerHeight;

        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 50);
        this.camera.position.set(2, 1, 2)
        this.scene.add(this.camera)

        // Light
        let directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight.position.set(2, 1, 2)   
        this.scene.add(directionalLight)

        // Controller
        let controller = new OrbitControls(this.camera, this.renderer.domElement)
        controller.target.set(0, 0.5, 0)
        controller.update()
        
        //Axis Landmark
        const axesHelper = new THREE.AxesHelper(100)
        this.scene.add(axesHelper)

        // Ground
        const plane = new THREE.Mesh(
            new THREE.CircleGeometry(2, 30),
            new THREE.MeshPhongMaterial({ color: 0xbbddff, opacity:0.4, transparent: true })
        );
        plane.rotation.x = - Math.PI / 2;
        this.scene.add(plane);

        let scope = this
        this.renderScene = function () {
            requestAnimationFrame(scope.renderScene)
            scope.renderer.render(scope.scene, scope.camera);
        }

        //視窗變動時 ，更新畫布大小以及相機(投影矩陣)繪製的比例
        window.addEventListener('resize', () => {
            //update render canvas size
            let width = domElement.clientWidth
            let height = domElement.clientHeight
            this.renderer.setSize(width, height);

            //update camera project aspect
            this.camera.aspect = width / height
            this.camera.updateProjectionMatrix();
        })

        let mesh = null
        this.loadData = () => {
            mesh = new MarchingCubes(this.size)
            mesh.name = 'mesh'
            mesh.material = new THREE.MeshNormalMaterial()
            mesh.isolation = this.threshold
            mesh.field = this.databuffer
            mesh.position.set(0,1,0)
            this.scene.add(mesh)
        }

        this.updateModel = () => {
            let mesh = this.scene.getObjectByName('mesh');
            let materials = {
                0: new THREE.MeshNormalMaterial(),
                1: new THREE.MeshToonMaterial()
            }

            if(mesh === undefined || mesh === null){
                //初始化
                let mesh = new MarchingCubes(this.size)
                mesh.name = 'mesh'
                mesh.material = materials[this.textureOption]
                mesh.isolation = this.threshold
                mesh.filed = this.databuffer
                mesh.position.set(0,1,0)
                this.scene.add(mesh)
            }
            else {
                mesh.material = materials[this.textureOption]
                mesh.isolation = this.threshold
                mesh.filed = this.databuffer
                mesh.position.set(0,1,0)
                this.scene.add(mesh)
            }
        }

        this.download = () => {
            let mesh = this.scene.getObjectByName('mesh');
            let geometry = mesh.generateGeometry()
            return new THREE.Mesh(geometry)
        }

        this.renderScene()
    }
}

export {
    threejsViewer
}
