import * as THREE from "https://esm.sh/three@0.155.0";
import { OrbitControls } from "https://esm.sh/three@0.155.0/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "https://esm.sh/three@0.155.0/examples/jsm/loaders/GLTFLoader";

(function() {
    'use strict';

    const container = document.querySelector('#viewer-3d');
    if (container) {
        const WAPEN_IDS = ['ak47', 'awp', 'deagle', 'mp9', 'm4a1s', 'm4a4'];
        const hash = (window.location.hash || '').replace('#', '').trim();
        if (!WAPEN_IDS.includes(hash)) return;
        const modelId = hash;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 3;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        scene.add(new THREE.AmbientLight(0xffffff, 1.5));
        const licht = new THREE.DirectionalLight(0xffffff, 2);
        licht.position.set(5, 5, 5);
        scene.add(licht);

        const bgSelect = document.querySelector('#bg-select');
        if (bgSelect) {
            bgSelect.addEventListener('change', function() {
                if (this.value) {
                    const textureLader = new THREE.TextureLoader();
                    textureLader.load(this.value, function(texture) {
                        scene.background = texture;
                    });
                } else {
                    scene.background = null;
                }
            });
        }

        const loader = new GLTFLoader();
        loader.load('models/' + modelId + '/scene.gltf', function(gltf) {
            const model = gltf.scene;

            const box = new THREE.Box3().setFromObject(model);
            const midden = box.getCenter(new THREE.Vector3());
            model.position.sub(midden);

            const grootte = box.getSize(new THREE.Vector3());
            const grootsteMaat = Math.max(grootte.x, grootte.y, grootte.z);
            model.scale.setScalar(2 / grootsteMaat);
            model.rotation.y = Math.PI / 2;

            scene.add(model);
        });

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', function() {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    }
})();
