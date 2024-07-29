/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var cannon_es__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! cannon-es */ "./node_modules/cannon-es/dist/cannon-es.js");
/* harmony import */ var lil_gui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lil-gui */ "./node_modules/lil-gui/dist/lil-gui.esm.js");




class ThreeJSContainer {
    scene;
    light;
    world;
    boxCubes = [];
    boxCubeBodies = [];
    purpleSphere;
    purpleSphereBody;
    sphereSize = 1;
    sphereGrowthRate = 0.1;
    sphereMaxSize = 10;
    redSphere;
    blueSphere;
    redSphereBody;
    blueSphereBody;
    hasCollided = false;
    particles = null;
    gui;
    redSphereSpeed = -10;
    blueSphereSpeed = 10;
    constructor() { }
    createRendererDOM = (width, height, cameraPos) => {
        const renderer = new three__WEBPACK_IMPORTED_MODULE_1__.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_1__.Color(0x000000));
        renderer.shadowMap.enabled = true;
        const camera = new three__WEBPACK_IMPORTED_MODULE_1__.PerspectiveCamera(70, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(0, 0, 0));
        const orbitControls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__.OrbitControls(camera, renderer.domElement);
        this.createScene();
        this.setupGUI();
        const render = () => {
            orbitControls.update();
            this.updatePhysics();
            this.updateSphereSize();
            this.updateParticles();
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    };
    setupGUI() {
        this.gui = new lil_gui__WEBPACK_IMPORTED_MODULE_2__.GUI();
        this.gui.add(this, 'redSphereSpeed', -50, 50).name('Red Sphere Speed').onChange(this.updateRedSphereSpeed);
        this.gui.add(this, 'blueSphereSpeed', -50, 50).name('Blue Sphere Speed').onChange(this.updateBlueSphereSpeed);
    }
    updateRedSphereSpeed = (value) => {
        this.redSphereBody.velocity.set(value, this.redSphereBody.velocity.y, this.redSphereBody.velocity.z);
    };
    updateBlueSphereSpeed = (value) => {
        this.blueSphereBody.velocity.set(value, this.blueSphereBody.velocity.y, this.blueSphereBody.velocity.z);
    };
    createScene = () => {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();
        this.world = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.World({
            gravity: new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Vec3(0, -9.82, 0),
        });
        this.world.defaultContactMaterial.friction = 0.01;
        this.world.defaultContactMaterial.restitution = 0.0;
        this.createBoxCube(new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(-3.5, 3.5, -3.5), 8, 8, 8);
        this.createPlane();
        this.createRedAndBlueSpheres();
        const gridHelper = new three__WEBPACK_IMPORTED_MODULE_1__.GridHelper(20);
        this.scene.add(gridHelper);
        const axesHelper = new three__WEBPACK_IMPORTED_MODULE_1__.AxesHelper(10);
        this.scene.add(axesHelper);
        this.light = new three__WEBPACK_IMPORTED_MODULE_1__.DirectionalLight(0xffffff);
        this.light.position.set(10, 10, 5);
        this.scene.add(this.light);
    };
    createBoxCube(center, width, height, depth) {
        const boxGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(1, 1, 1);
        const boxMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshLambertMaterial({ color: 0x696969 });
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                for (let z = 0; z < depth; z++) {
                    const box = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(boxGeometry, boxMaterial);
                    box.position.set(center.x + x, center.y + y, center.z + z);
                    this.scene.add(box);
                    this.boxCubes.push(box);
                    const boxShape = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Vec3(0.5, 0.5, 0.5));
                    const boxBody = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Body({ mass: 1 });
                    boxBody.addShape(boxShape);
                    boxBody.position.set(box.position.x, box.position.y, box.position.z);
                    this.world.addBody(boxBody);
                    this.boxCubeBodies.push(boxBody);
                }
            }
        }
    }
    createPlane() {
        const planeGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.PlaneGeometry(200, 200);
        const planeMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshPhongMaterial({ color: 0x32cd32, side: three__WEBPACK_IMPORTED_MODULE_1__.DoubleSide });
        const planeMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(planeGeometry, planeMaterial);
        planeMesh.rotation.x = -Math.PI / 2;
        planeMesh.position.y = 3;
        this.scene.add(planeMesh);
        const planeShape = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Plane();
        const planeBody = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Body({ mass: 0 });
        planeBody.addShape(planeShape);
        planeBody.position.set(0, 3, 0);
        planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        this.world.addBody(planeBody);
    }
    createRedAndBlueSpheres() {
        const sphereGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.SphereGeometry(2, 32, 32);
        const redSphereMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshLambertMaterial({ color: 0x0000ff });
        this.redSphere = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(sphereGeometry, redSphereMaterial);
        this.redSphere.position.set(20, 4, -50);
        this.scene.add(this.redSphere);
        const blueSphereMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshLambertMaterial({ color: 0xff0000 });
        this.blueSphere = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(sphereGeometry, blueSphereMaterial);
        this.blueSphere.position.set(-20, 4, -50);
        this.scene.add(this.blueSphere);
        const sphereShape = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Sphere(2);
        this.redSphereBody = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Body({ mass: 1 });
        this.redSphereBody.addShape(sphereShape);
        this.redSphereBody.position.set(20, 5, -50);
        this.redSphereBody.velocity.set(this.redSphereSpeed, 0, 0);
        this.world.addBody(this.redSphereBody);
        this.blueSphereBody = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Body({ mass: 1 });
        this.blueSphereBody.addShape(sphereShape);
        this.blueSphereBody.position.set(-20, 5, -50);
        this.blueSphereBody.velocity.set(this.blueSphereSpeed, 0, 0);
        this.world.addBody(this.blueSphereBody);
    }
    createPurpleSphere(position) {
        const sphereGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.SphereGeometry(this.sphereSize, 32, 32);
        const sphereMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshLambertMaterial({ color: 0xba55d3 });
        this.purpleSphere = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(sphereGeometry, sphereMaterial);
        this.purpleSphere.position.copy(position);
        this.scene.add(this.purpleSphere);
        const sphereShape = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Sphere(this.sphereSize);
        this.purpleSphereBody = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Body({ mass: 500 });
        this.purpleSphereBody.addShape(sphereShape);
        this.purpleSphereBody.position.copy(position);
        this.purpleSphereBody.velocity.set(0, 0, 50);
        this.world.addBody(this.purpleSphereBody);
    }
    createParticleExplosion(position) {
        const particleCount = 50000;
        const particles = new three__WEBPACK_IMPORTED_MODULE_1__.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * 100 * Math.PI;
            const theta = Math.acos(2 * Math.random() - 1);
            const radius = Math.random() * 100;
            positions[i * 3] = Math.sin(theta) * Math.cos(angle) * radius;
            positions[i * 3 + 1] = Math.sin(theta) * Math.sin(angle) * radius;
            positions[i * 3 + 2] = Math.cos(theta) * radius;
            colors[i * 3] = Math.random();
            colors[i * 3 + 1] = Math.random();
            colors[i * 3 + 2] = Math.random();
        }
        particles.setAttribute('position', new three__WEBPACK_IMPORTED_MODULE_1__.BufferAttribute(positions, 3));
        particles.setAttribute('color', new three__WEBPACK_IMPORTED_MODULE_1__.BufferAttribute(colors, 3));
        const particleMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            opacity: 0.8,
            transparent: true,
        });
        this.particles = new three__WEBPACK_IMPORTED_MODULE_1__.Points(particles, particleMaterial);
        this.particles.position.copy(position);
        this.scene.add(this.particles);
        setTimeout(() => {
            this.scene.remove(this.particles);
            this.particles = null;
        }, 2000); // パーティクルが1.4秒後に消える
    }
    checkCollision() {
        const distance = this.redSphereBody.position.vsub(this.blueSphereBody.position).length();
        if (distance < 4 && !this.hasCollided) {
            this.hasCollided = true;
            this.scene.remove(this.redSphere);
            this.scene.remove(this.blueSphere);
            this.world.removeBody(this.redSphereBody);
            this.world.removeBody(this.blueSphereBody);
            this.createPurpleSphere(this.redSphereBody.position);
            this.createParticleExplosion(this.redSphereBody.position);
        }
    }
    updateSphereSize() {
        if (this.sphereSize < this.sphereMaxSize && this.hasCollided) {
            this.sphereSize += this.sphereGrowthRate;
            this.sphereSize = Math.min(this.sphereSize, this.sphereMaxSize);
            const oldSphere = this.purpleSphere;
            const oldSphereBody = this.purpleSphereBody;
            const sphereGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.SphereGeometry(this.sphereSize, 32, 32);
            this.purpleSphere.geometry.dispose();
            this.purpleSphere.geometry = sphereGeometry;
            const sphereShape = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Sphere(this.sphereSize);
            const newPurpleSphereBody = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Body({ mass: 1000 });
            newPurpleSphereBody.addShape(sphereShape);
            newPurpleSphereBody.position.copy(oldSphereBody.position);
            newPurpleSphereBody.velocity.copy(oldSphereBody.velocity);
            newPurpleSphereBody.quaternion.copy(oldSphereBody.quaternion);
            this.world.removeBody(oldSphereBody);
            this.world.addBody(newPurpleSphereBody);
            this.purpleSphereBody = newPurpleSphereBody;
        }
    }
    updateParticles() {
    }
    updatePhysics = () => {
        this.world.step(1 / 60);
        if (!this.hasCollided) {
            this.redSphere.position.copy(this.redSphereBody.position);
            this.redSphere.quaternion.copy(this.redSphereBody.quaternion);
            this.blueSphere.position.copy(this.blueSphereBody.position);
            this.blueSphere.quaternion.copy(this.blueSphereBody.quaternion);
            this.checkCollision();
        }
        else {
            this.purpleSphere.position.copy(this.purpleSphereBody.position);
            this.purpleSphere.quaternion.copy(this.purpleSphereBody.quaternion);
        }
        for (let i = 0; i < this.boxCubes.length; i++) {
            const boxBody = this.boxCubeBodies[i];
            this.boxCubes[i].position.copy(boxBody.position);
            this.boxCubes[i].quaternion.copy(boxBody.quaternion);
        }
    };
}
window.addEventListener("DOMContentLoaded", init);
function init() {
    const container = new ThreeJSContainer();
    const viewport = container.createRendererDOM(640, 480, new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(10, 17, 20));
    document.body.appendChild(viewport);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_cannon-es_dist_cannon-es_js-node_modules_lil-gui_dist_lil-gui_esm_js-nod-376d50"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLHFCQUFxQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7VUVoREE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2NncHJlbmRlcmluZy8uL3NyYy9hcHAudHMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHNcIjtcbmltcG9ydCAqIGFzIENBTk5PTiBmcm9tIFwiY2Fubm9uLWVzXCI7XG5pbXBvcnQgKiBhcyBkYXQgZnJvbSAnbGlsLWd1aSc7XG5cbmNsYXNzIFRocmVlSlNDb250YWluZXIge1xuICAgIHByaXZhdGUgc2NlbmU6IFRIUkVFLlNjZW5lO1xuICAgIHByaXZhdGUgbGlnaHQ6IFRIUkVFLkxpZ2h0O1xuICAgIHByaXZhdGUgd29ybGQ6IENBTk5PTi5Xb3JsZDtcbiAgICBwcml2YXRlIGJveEN1YmVzOiBUSFJFRS5NZXNoW10gPSBbXTtcbiAgICBwcml2YXRlIGJveEN1YmVCb2RpZXM6IENBTk5PTi5Cb2R5W10gPSBbXTtcbiAgICBwcml2YXRlIHB1cnBsZVNwaGVyZTogVEhSRUUuTWVzaDtcbiAgICBwcml2YXRlIHB1cnBsZVNwaGVyZUJvZHk6IENBTk5PTi5Cb2R5O1xuICAgIHByaXZhdGUgc3BoZXJlU2l6ZTogbnVtYmVyID0gMTtcbiAgICBwcml2YXRlIHNwaGVyZUdyb3d0aFJhdGU6IG51bWJlciA9IDAuMTtcbiAgICBwcml2YXRlIHNwaGVyZU1heFNpemU6IG51bWJlciA9IDEwO1xuICAgIHByaXZhdGUgcmVkU3BoZXJlOiBUSFJFRS5NZXNoO1xuICAgIHByaXZhdGUgYmx1ZVNwaGVyZTogVEhSRUUuTWVzaDtcbiAgICBwcml2YXRlIHJlZFNwaGVyZUJvZHk6IENBTk5PTi5Cb2R5O1xuICAgIHByaXZhdGUgYmx1ZVNwaGVyZUJvZHk6IENBTk5PTi5Cb2R5O1xuICAgIHByaXZhdGUgaGFzQ29sbGlkZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIHBhcnRpY2xlczogVEhSRUUuUG9pbnRzIHwgbnVsbCA9IG51bGw7XG5cbiAgICBwcml2YXRlIGd1aTogZGF0LkdVSTtcbiAgICBwcml2YXRlIHJlZFNwaGVyZVNwZWVkOiBudW1iZXIgPSAtMTA7XG4gICAgcHJpdmF0ZSBibHVlU3BoZXJlU3BlZWQ6IG51bWJlciA9IDEwO1xuXG4gICAgY29uc3RydWN0b3IoKSB7fVxuXG4gICAgcHVibGljIGNyZWF0ZVJlbmRlcmVyRE9NID0gKFxuICAgICAgICB3aWR0aDogbnVtYmVyLFxuICAgICAgICBoZWlnaHQ6IG51bWJlcixcbiAgICAgICAgY2FtZXJhUG9zOiBUSFJFRS5WZWN0b3IzXG4gICAgKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoKTtcbiAgICAgICAgcmVuZGVyZXIuc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgcmVuZGVyZXIuc2V0Q2xlYXJDb2xvcihuZXcgVEhSRUUuQ29sb3IoMHgwMDAwMDApKTtcbiAgICAgICAgcmVuZGVyZXIuc2hhZG93TWFwLmVuYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIGNvbnN0IGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYShcbiAgICAgICAgICAgIDcwLFxuICAgICAgICAgICAgd2lkdGggLyBoZWlnaHQsXG4gICAgICAgICAgICAwLjEsXG4gICAgICAgICAgICAxMDAwXG4gICAgICAgICk7XG4gICAgICAgIGNhbWVyYS5wb3NpdGlvbi5jb3B5KGNhbWVyYVBvcyk7XG4gICAgICAgIGNhbWVyYS5sb29rQXQobmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMCkpO1xuXG4gICAgICAgIGNvbnN0IG9yYml0Q29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gICAgICAgIHRoaXMuY3JlYXRlU2NlbmUoKTtcbiAgICAgICAgdGhpcy5zZXR1cEdVSSgpO1xuXG4gICAgICAgIGNvbnN0IHJlbmRlcjogRnJhbWVSZXF1ZXN0Q2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICAgICAgICBvcmJpdENvbnRyb2xzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQaHlzaWNzKCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNwaGVyZVNpemUoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGFydGljbGVzKCk7XG4gICAgICAgICAgICByZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZSwgY2FtZXJhKTtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xuICAgICAgICB9O1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcblxuICAgICAgICByZW5kZXJlci5kb21FbGVtZW50LnN0eWxlLmNzc0Zsb2F0ID0gXCJsZWZ0XCI7XG4gICAgICAgIHJlbmRlcmVyLmRvbUVsZW1lbnQuc3R5bGUubWFyZ2luID0gXCIxMHB4XCI7XG4gICAgICAgIHJldHVybiByZW5kZXJlci5kb21FbGVtZW50O1xuICAgIH07XG5cbiAgICBwcml2YXRlIHNldHVwR1VJKCkge1xuICAgICAgICB0aGlzLmd1aSA9IG5ldyBkYXQuR1VJKCk7XG5cbiAgICAgICAgdGhpcy5ndWkuYWRkKHRoaXMsICdyZWRTcGhlcmVTcGVlZCcsIC01MCwgNTApLm5hbWUoJ1JlZCBTcGhlcmUgU3BlZWQnKS5vbkNoYW5nZSh0aGlzLnVwZGF0ZVJlZFNwaGVyZVNwZWVkKTtcbiAgICAgICAgdGhpcy5ndWkuYWRkKHRoaXMsICdibHVlU3BoZXJlU3BlZWQnLCAtNTAsIDUwKS5uYW1lKCdCbHVlIFNwaGVyZSBTcGVlZCcpLm9uQ2hhbmdlKHRoaXMudXBkYXRlQmx1ZVNwaGVyZVNwZWVkKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVJlZFNwaGVyZVNwZWVkID0gKHZhbHVlOiBudW1iZXIpID0+IHtcbiAgICAgICAgdGhpcy5yZWRTcGhlcmVCb2R5LnZlbG9jaXR5LnNldCh2YWx1ZSwgdGhpcy5yZWRTcGhlcmVCb2R5LnZlbG9jaXR5LnksIHRoaXMucmVkU3BoZXJlQm9keS52ZWxvY2l0eS56KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZUJsdWVTcGhlcmVTcGVlZCA9ICh2YWx1ZTogbnVtYmVyKSA9PiB7XG4gICAgICAgIHRoaXMuYmx1ZVNwaGVyZUJvZHkudmVsb2NpdHkuc2V0KHZhbHVlLCB0aGlzLmJsdWVTcGhlcmVCb2R5LnZlbG9jaXR5LnksIHRoaXMuYmx1ZVNwaGVyZUJvZHkudmVsb2NpdHkueik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVTY2VuZSA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuXG4gICAgICAgIHRoaXMud29ybGQgPSBuZXcgQ0FOTk9OLldvcmxkKHtcbiAgICAgICAgICAgIGdyYXZpdHk6IG5ldyBDQU5OT04uVmVjMygwLCAtOS44MiwgMCksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMud29ybGQuZGVmYXVsdENvbnRhY3RNYXRlcmlhbC5mcmljdGlvbiA9IDAuMDE7XG4gICAgICAgIHRoaXMud29ybGQuZGVmYXVsdENvbnRhY3RNYXRlcmlhbC5yZXN0aXR1dGlvbiA9IDAuMDtcblxuICAgICAgICB0aGlzLmNyZWF0ZUJveEN1YmUobmV3IFRIUkVFLlZlY3RvcjMoLTMuNSwgMy41LCAtMy41KSwgOCwgOCwgOCk7XG4gICAgICAgIHRoaXMuY3JlYXRlUGxhbmUoKTtcbiAgICAgICAgdGhpcy5jcmVhdGVSZWRBbmRCbHVlU3BoZXJlcygpO1xuXG4gICAgICAgIGNvbnN0IGdyaWRIZWxwZXIgPSBuZXcgVEhSRUUuR3JpZEhlbHBlcigyMCk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGdyaWRIZWxwZXIpO1xuXG4gICAgICAgIGNvbnN0IGF4ZXNIZWxwZXIgPSBuZXcgVEhSRUUuQXhlc0hlbHBlcigxMCk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGF4ZXNIZWxwZXIpO1xuXG4gICAgICAgIHRoaXMubGlnaHQgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZik7XG4gICAgICAgIHRoaXMubGlnaHQucG9zaXRpb24uc2V0KDEwLCAxMCwgNSk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMubGlnaHQpO1xuICAgIH07XG5cbiAgICBwcml2YXRlIGNyZWF0ZUJveEN1YmUoY2VudGVyOiBUSFJFRS5WZWN0b3IzLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgZGVwdGg6IG51bWJlcikge1xuICAgICAgICBjb25zdCBib3hHZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSgxLCAxLCAxKTtcbiAgICAgICAgY29uc3QgYm94TWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7IGNvbG9yOiAweDY5Njk2OSB9KTtcblxuICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHdpZHRoOyB4KyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgaGVpZ2h0OyB5KyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB6ID0gMDsgeiA8IGRlcHRoOyB6KyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYm94ID0gbmV3IFRIUkVFLk1lc2goYm94R2VvbWV0cnksIGJveE1hdGVyaWFsKTtcbiAgICAgICAgICAgICAgICAgICAgYm94LnBvc2l0aW9uLnNldChjZW50ZXIueCArIHgsIGNlbnRlci55ICsgeSwgY2VudGVyLnogKyB6KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQoYm94KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3hDdWJlcy5wdXNoKGJveCk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYm94U2hhcGUgPSBuZXcgQ0FOTk9OLkJveChuZXcgQ0FOTk9OLlZlYzMoMC41LCAwLjUsIDAuNSkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBib3hCb2R5ID0gbmV3IENBTk5PTi5Cb2R5KHsgbWFzczogMSB9KTtcbiAgICAgICAgICAgICAgICAgICAgYm94Qm9keS5hZGRTaGFwZShib3hTaGFwZSk7XG4gICAgICAgICAgICAgICAgICAgIGJveEJvZHkucG9zaXRpb24uc2V0KGJveC5wb3NpdGlvbi54LCBib3gucG9zaXRpb24ueSwgYm94LnBvc2l0aW9uLnopO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLndvcmxkLmFkZEJvZHkoYm94Qm9keSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm94Q3ViZUJvZGllcy5wdXNoKGJveEJvZHkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlUGxhbmUoKSB7XG4gICAgICAgIGNvbnN0IHBsYW5lR2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSgyMDAsIDIwMCk7XG4gICAgICAgIGNvbnN0IHBsYW5lTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoeyBjb2xvcjogMHgzMmNkMzIsIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUgfSk7XG4gICAgICAgIGNvbnN0IHBsYW5lTWVzaCA9IG5ldyBUSFJFRS5NZXNoKHBsYW5lR2VvbWV0cnksIHBsYW5lTWF0ZXJpYWwpO1xuICAgICAgICBwbGFuZU1lc2gucm90YXRpb24ueCA9IC1NYXRoLlBJIC8gMjtcbiAgICAgICAgcGxhbmVNZXNoLnBvc2l0aW9uLnkgPSAzO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChwbGFuZU1lc2gpO1xuXG4gICAgICAgIGNvbnN0IHBsYW5lU2hhcGUgPSBuZXcgQ0FOTk9OLlBsYW5lKCk7XG4gICAgICAgIGNvbnN0IHBsYW5lQm9keSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3M6IDAgfSk7XG4gICAgICAgIHBsYW5lQm9keS5hZGRTaGFwZShwbGFuZVNoYXBlKTtcbiAgICAgICAgcGxhbmVCb2R5LnBvc2l0aW9uLnNldCgwLCAzLCAwKTtcbiAgICAgICAgcGxhbmVCb2R5LnF1YXRlcm5pb24uc2V0RnJvbUV1bGVyKC1NYXRoLlBJIC8gMiwgMCwgMCk7XG4gICAgICAgIHRoaXMud29ybGQuYWRkQm9keShwbGFuZUJvZHkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlUmVkQW5kQmx1ZVNwaGVyZXMoKSB7XG4gICAgICAgIGNvbnN0IHNwaGVyZUdlb21ldHJ5ID0gbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KDIsIDMyLCAzMik7XG5cbiAgICAgICAgY29uc3QgcmVkU3BoZXJlTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7IGNvbG9yOiAweDAwMDBmZiB9KTtcbiAgICAgICAgdGhpcy5yZWRTcGhlcmUgPSBuZXcgVEhSRUUuTWVzaChzcGhlcmVHZW9tZXRyeSwgcmVkU3BoZXJlTWF0ZXJpYWwpO1xuICAgICAgICB0aGlzLnJlZFNwaGVyZS5wb3NpdGlvbi5zZXQoMjAsIDQsIC01MCk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMucmVkU3BoZXJlKTtcblxuICAgICAgICBjb25zdCBibHVlU3BoZXJlTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7IGNvbG9yOiAweGZmMDAwMCB9KTtcbiAgICAgICAgdGhpcy5ibHVlU3BoZXJlID0gbmV3IFRIUkVFLk1lc2goc3BoZXJlR2VvbWV0cnksIGJsdWVTcGhlcmVNYXRlcmlhbCk7XG4gICAgICAgIHRoaXMuYmx1ZVNwaGVyZS5wb3NpdGlvbi5zZXQoLTIwLCA0LCAtNTApO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLmJsdWVTcGhlcmUpO1xuXG4gICAgICAgIGNvbnN0IHNwaGVyZVNoYXBlID0gbmV3IENBTk5PTi5TcGhlcmUoMik7XG5cbiAgICAgICAgdGhpcy5yZWRTcGhlcmVCb2R5ID0gbmV3IENBTk5PTi5Cb2R5KHsgbWFzczogMSB9KTtcbiAgICAgICAgdGhpcy5yZWRTcGhlcmVCb2R5LmFkZFNoYXBlKHNwaGVyZVNoYXBlKTtcbiAgICAgICAgdGhpcy5yZWRTcGhlcmVCb2R5LnBvc2l0aW9uLnNldCgyMCwgNSwgLTUwKTtcbiAgICAgICAgdGhpcy5yZWRTcGhlcmVCb2R5LnZlbG9jaXR5LnNldCh0aGlzLnJlZFNwaGVyZVNwZWVkLCAwLCAwKTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRCb2R5KHRoaXMucmVkU3BoZXJlQm9keSk7XG5cbiAgICAgICAgdGhpcy5ibHVlU3BoZXJlQm9keSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3M6IDEgfSk7XG4gICAgICAgIHRoaXMuYmx1ZVNwaGVyZUJvZHkuYWRkU2hhcGUoc3BoZXJlU2hhcGUpO1xuICAgICAgICB0aGlzLmJsdWVTcGhlcmVCb2R5LnBvc2l0aW9uLnNldCgtMjAsIDUsIC01MCk7XG4gICAgICAgIHRoaXMuYmx1ZVNwaGVyZUJvZHkudmVsb2NpdHkuc2V0KHRoaXMuYmx1ZVNwaGVyZVNwZWVkLCAwLCAwKTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRCb2R5KHRoaXMuYmx1ZVNwaGVyZUJvZHkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlUHVycGxlU3BoZXJlKHBvc2l0aW9uOiBDQU5OT04uVmVjMykge1xuICAgICAgICBjb25zdCBzcGhlcmVHZW9tZXRyeSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSh0aGlzLnNwaGVyZVNpemUsIDMyLCAzMik7XG4gICAgICAgIGNvbnN0IHNwaGVyZU1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoeyBjb2xvcjogMHhiYTU1ZDMgfSk7XG4gICAgICAgIHRoaXMucHVycGxlU3BoZXJlID0gbmV3IFRIUkVFLk1lc2goc3BoZXJlR2VvbWV0cnksIHNwaGVyZU1hdGVyaWFsKTtcbiAgICAgICAgdGhpcy5wdXJwbGVTcGhlcmUucG9zaXRpb24uY29weShwb3NpdGlvbiBhcyB1bmtub3duIGFzIFRIUkVFLlZlY3RvcjMpO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLnB1cnBsZVNwaGVyZSk7XG5cbiAgICAgICAgY29uc3Qgc3BoZXJlU2hhcGUgPSBuZXcgQ0FOTk9OLlNwaGVyZSh0aGlzLnNwaGVyZVNpemUpO1xuICAgICAgICB0aGlzLnB1cnBsZVNwaGVyZUJvZHkgPSBuZXcgQ0FOTk9OLkJvZHkoeyBtYXNzOiA1MDAgfSk7XG4gICAgICAgIHRoaXMucHVycGxlU3BoZXJlQm9keS5hZGRTaGFwZShzcGhlcmVTaGFwZSk7XG4gICAgICAgIHRoaXMucHVycGxlU3BoZXJlQm9keS5wb3NpdGlvbi5jb3B5KHBvc2l0aW9uKTtcbiAgICAgICAgdGhpcy5wdXJwbGVTcGhlcmVCb2R5LnZlbG9jaXR5LnNldCgwLCAwLCA1MCk7XG4gICAgICAgIHRoaXMud29ybGQuYWRkQm9keSh0aGlzLnB1cnBsZVNwaGVyZUJvZHkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlUGFydGljbGVFeHBsb3Npb24ocG9zaXRpb246IENBTk5PTi5WZWMzKSB7XG4gICAgICAgIGNvbnN0IHBhcnRpY2xlQ291bnQgPSA1MDAwMDtcbiAgICAgICAgY29uc3QgcGFydGljbGVzID0gbmV3IFRIUkVFLkJ1ZmZlckdlb21ldHJ5KCk7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9ucyA9IG5ldyBGbG9hdDMyQXJyYXkocGFydGljbGVDb3VudCAqIDMpO1xuICAgICAgICBjb25zdCBjb2xvcnMgPSBuZXcgRmxvYXQzMkFycmF5KHBhcnRpY2xlQ291bnQgKiAzKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcnRpY2xlQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgYW5nbGUgPSBNYXRoLnJhbmRvbSgpICogMTAwICogTWF0aC5QSTtcbiAgICAgICAgICAgIGNvbnN0IHRoZXRhID0gTWF0aC5hY29zKDIgKiBNYXRoLnJhbmRvbSgpIC0gMSk7XG4gICAgICAgICAgICBjb25zdCByYWRpdXMgPSBNYXRoLnJhbmRvbSgpICogMTAwO1xuICAgICAgICAgICAgcG9zaXRpb25zW2kgKiAzXSA9IE1hdGguc2luKHRoZXRhKSAqIE1hdGguY29zKGFuZ2xlKSAqIHJhZGl1cztcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpICogMyArIDFdID0gTWF0aC5zaW4odGhldGEpICogTWF0aC5zaW4oYW5nbGUpICogcmFkaXVzO1xuICAgICAgICAgICAgcG9zaXRpb25zW2kgKiAzICsgMl0gPSBNYXRoLmNvcyh0aGV0YSkgKiByYWRpdXM7XG5cbiAgICAgICAgICAgIGNvbG9yc1tpICogM10gPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgY29sb3JzW2kgKiAzICsgMV0gPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgY29sb3JzW2kgKiAzICsgMl0gPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGFydGljbGVzLnNldEF0dHJpYnV0ZSgncG9zaXRpb24nLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKHBvc2l0aW9ucywgMykpO1xuICAgICAgICBwYXJ0aWNsZXMuc2V0QXR0cmlidXRlKCdjb2xvcicsIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUoY29sb3JzLCAzKSk7XG5cbiAgICAgICAgY29uc3QgcGFydGljbGVNYXRlcmlhbCA9IG5ldyBUSFJFRS5Qb2ludHNNYXRlcmlhbCh7XG4gICAgICAgICAgICBzaXplOiAwLjUsXG4gICAgICAgICAgICB2ZXJ0ZXhDb2xvcnM6IHRydWUsXG4gICAgICAgICAgICBvcGFjaXR5OiAwLjgsXG4gICAgICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMgPSBuZXcgVEhSRUUuUG9pbnRzKHBhcnRpY2xlcywgcGFydGljbGVNYXRlcmlhbCk7XG4gICAgICAgIHRoaXMucGFydGljbGVzLnBvc2l0aW9uLmNvcHkocG9zaXRpb24gYXMgdW5rbm93biBhcyBUSFJFRS5WZWN0b3IzKTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQodGhpcy5wYXJ0aWNsZXMpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5yZW1vdmUodGhpcy5wYXJ0aWNsZXMpO1xuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZXMgPSBudWxsO1xuICAgICAgICB9LCAyMDAwKTsgLy8g44OR44O844OG44Kj44Kv44Or44GMMS4056eS5b6M44Gr5raI44GI44KLXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjaGVja0NvbGxpc2lvbigpIHtcbiAgICAgICAgY29uc3QgZGlzdGFuY2UgPSB0aGlzLnJlZFNwaGVyZUJvZHkucG9zaXRpb24udnN1Yih0aGlzLmJsdWVTcGhlcmVCb2R5LnBvc2l0aW9uKS5sZW5ndGgoKTtcbiAgICAgICAgaWYgKGRpc3RhbmNlIDwgNCAmJiAhdGhpcy5oYXNDb2xsaWRlZCkge1xuICAgICAgICAgICAgdGhpcy5oYXNDb2xsaWRlZCA9IHRydWU7XG5cbiAgICAgICAgICAgIHRoaXMuc2NlbmUucmVtb3ZlKHRoaXMucmVkU3BoZXJlKTtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUucmVtb3ZlKHRoaXMuYmx1ZVNwaGVyZSk7XG4gICAgICAgICAgICB0aGlzLndvcmxkLnJlbW92ZUJvZHkodGhpcy5yZWRTcGhlcmVCb2R5KTtcbiAgICAgICAgICAgIHRoaXMud29ybGQucmVtb3ZlQm9keSh0aGlzLmJsdWVTcGhlcmVCb2R5KTtcblxuICAgICAgICAgICAgdGhpcy5jcmVhdGVQdXJwbGVTcGhlcmUodGhpcy5yZWRTcGhlcmVCb2R5LnBvc2l0aW9uKTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUGFydGljbGVFeHBsb3Npb24odGhpcy5yZWRTcGhlcmVCb2R5LnBvc2l0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlU3BoZXJlU2l6ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3BoZXJlU2l6ZSA8IHRoaXMuc3BoZXJlTWF4U2l6ZSAmJiB0aGlzLmhhc0NvbGxpZGVkKSB7XG4gICAgICAgICAgICB0aGlzLnNwaGVyZVNpemUgKz0gdGhpcy5zcGhlcmVHcm93dGhSYXRlO1xuICAgICAgICAgICAgdGhpcy5zcGhlcmVTaXplID0gTWF0aC5taW4odGhpcy5zcGhlcmVTaXplLCB0aGlzLnNwaGVyZU1heFNpemUpO1xuXG4gICAgICAgICAgICBjb25zdCBvbGRTcGhlcmUgPSB0aGlzLnB1cnBsZVNwaGVyZTtcbiAgICAgICAgICAgIGNvbnN0IG9sZFNwaGVyZUJvZHkgPSB0aGlzLnB1cnBsZVNwaGVyZUJvZHk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNwaGVyZUdlb21ldHJ5ID0gbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KHRoaXMuc3BoZXJlU2l6ZSwgMzIsIDMyKTtcbiAgICAgICAgICAgIHRoaXMucHVycGxlU3BoZXJlLmdlb21ldHJ5LmRpc3Bvc2UoKTtcbiAgICAgICAgICAgIHRoaXMucHVycGxlU3BoZXJlLmdlb21ldHJ5ID0gc3BoZXJlR2VvbWV0cnk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNwaGVyZVNoYXBlID0gbmV3IENBTk5PTi5TcGhlcmUodGhpcy5zcGhlcmVTaXplKTtcbiAgICAgICAgICAgIGNvbnN0IG5ld1B1cnBsZVNwaGVyZUJvZHkgPSBuZXcgQ0FOTk9OLkJvZHkoeyBtYXNzOiAxMDAwIH0pO1xuICAgICAgICAgICAgbmV3UHVycGxlU3BoZXJlQm9keS5hZGRTaGFwZShzcGhlcmVTaGFwZSk7XG4gICAgICAgICAgICBuZXdQdXJwbGVTcGhlcmVCb2R5LnBvc2l0aW9uLmNvcHkob2xkU3BoZXJlQm9keS5wb3NpdGlvbik7XG4gICAgICAgICAgICBuZXdQdXJwbGVTcGhlcmVCb2R5LnZlbG9jaXR5LmNvcHkob2xkU3BoZXJlQm9keS52ZWxvY2l0eSk7XG4gICAgICAgICAgICBuZXdQdXJwbGVTcGhlcmVCb2R5LnF1YXRlcm5pb24uY29weShvbGRTcGhlcmVCb2R5LnF1YXRlcm5pb24pO1xuXG4gICAgICAgICAgICB0aGlzLndvcmxkLnJlbW92ZUJvZHkob2xkU3BoZXJlQm9keSk7XG4gICAgICAgICAgICB0aGlzLndvcmxkLmFkZEJvZHkobmV3UHVycGxlU3BoZXJlQm9keSk7XG4gICAgICAgICAgICB0aGlzLnB1cnBsZVNwaGVyZUJvZHkgPSBuZXdQdXJwbGVTcGhlcmVCb2R5O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVQYXJ0aWNsZXMoKSB7ICAgXG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVQaHlzaWNzID0gKCkgPT4ge1xuICAgICAgICB0aGlzLndvcmxkLnN0ZXAoMSAvIDYwKTtcblxuICAgICAgICBpZiAoIXRoaXMuaGFzQ29sbGlkZWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVkU3BoZXJlLnBvc2l0aW9uLmNvcHkodGhpcy5yZWRTcGhlcmVCb2R5LnBvc2l0aW9uIGFzIHVua25vd24gYXMgVEhSRUUuVmVjdG9yMyk7XG4gICAgICAgICAgICB0aGlzLnJlZFNwaGVyZS5xdWF0ZXJuaW9uLmNvcHkodGhpcy5yZWRTcGhlcmVCb2R5LnF1YXRlcm5pb24gYXMgdW5rbm93biBhcyBUSFJFRS5RdWF0ZXJuaW9uKTtcbiAgICAgICAgICAgIHRoaXMuYmx1ZVNwaGVyZS5wb3NpdGlvbi5jb3B5KHRoaXMuYmx1ZVNwaGVyZUJvZHkucG9zaXRpb24gYXMgdW5rbm93biBhcyBUSFJFRS5WZWN0b3IzKTtcbiAgICAgICAgICAgIHRoaXMuYmx1ZVNwaGVyZS5xdWF0ZXJuaW9uLmNvcHkodGhpcy5ibHVlU3BoZXJlQm9keS5xdWF0ZXJuaW9uIGFzIHVua25vd24gYXMgVEhSRUUuUXVhdGVybmlvbik7XG4gICAgICAgICAgICB0aGlzLmNoZWNrQ29sbGlzaW9uKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnB1cnBsZVNwaGVyZS5wb3NpdGlvbi5jb3B5KHRoaXMucHVycGxlU3BoZXJlQm9keS5wb3NpdGlvbiBhcyB1bmtub3duIGFzIFRIUkVFLlZlY3RvcjMpO1xuICAgICAgICAgICAgdGhpcy5wdXJwbGVTcGhlcmUucXVhdGVybmlvbi5jb3B5KHRoaXMucHVycGxlU3BoZXJlQm9keS5xdWF0ZXJuaW9uIGFzIHVua25vd24gYXMgVEhSRUUuUXVhdGVybmlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYm94Q3ViZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGJveEJvZHkgPSB0aGlzLmJveEN1YmVCb2RpZXNbaV07XG4gICAgICAgICAgICB0aGlzLmJveEN1YmVzW2ldLnBvc2l0aW9uLmNvcHkoYm94Qm9keS5wb3NpdGlvbiBhcyB1bmtub3duIGFzIFRIUkVFLlZlY3RvcjMpO1xuICAgICAgICAgICAgdGhpcy5ib3hDdWJlc1tpXS5xdWF0ZXJuaW9uLmNvcHkoYm94Qm9keS5xdWF0ZXJuaW9uIGFzIHVua25vd24gYXMgVEhSRUUuUXVhdGVybmlvbik7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgaW5pdCk7XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgY29uc3QgY29udGFpbmVyID0gbmV3IFRocmVlSlNDb250YWluZXIoKTtcbiAgICBjb25zdCB2aWV3cG9ydCA9IGNvbnRhaW5lci5jcmVhdGVSZW5kZXJlckRPTShcbiAgICAgICAgNjQwLFxuICAgICAgICA0ODAsXG4gICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKDEwLCAxNywgMjApXG4gICAgKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHZpZXdwb3J0KTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdID0gc2VsZltcIndlYnBhY2tDaHVua2NncHJlbmRlcmluZ1wiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9ycy1ub2RlX21vZHVsZXNfY2Fubm9uLWVzX2Rpc3RfY2Fubm9uLWVzX2pzLW5vZGVfbW9kdWxlc19saWwtZ3VpX2Rpc3RfbGlsLWd1aV9lc21fanMtbm9kLTM3NmQ1MFwiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9hcHAudHNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==