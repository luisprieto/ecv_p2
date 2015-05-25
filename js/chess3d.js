(function(_global) {

    /**
     * @class
     * @param container
     * @this Chess3d
     * @returns Chess3d
     */
    function Chess3d (container) {
        this.renderer = undefined;
        this.scene = undefined;
        this. camera = undefined;
        this.container = container;
        this.render = render.bind(this);
    }

    _global.Chess3d = Chess3d;

    /**
     * @memberof Chess3d
     * @this Chess3d
     */
    Chess3d.prototype.init = function () {
        this.createRenderer();
        this.createScene();
        this.createCamera();
        this.createLights();
        this.createChess();
    };

    Chess3d.prototype.start = function () {
        console.log(this.container);
        //this.container.appendChild(this.renderer.domElement);
        this.render();
    };

    /**
     * @memberof Chess3d
     * @this Chess3d
     */
    Chess3d.prototype.createRenderer = function () {
        this.renderer =  new THREE.WebGLRenderer();
        this.renderer.setClearColor(0x000000, 1.0);
        //console.log(this.container.offsetHeight, this.container.offsetHeight);
        //this.renderer.setSize(this.container.offsetHeight, this.container.offsetHeight);
        this.renderer.setSize(500,500);
    };

    /**
     * @memberof Chess3d
     * @this Chess3d
     */
    Chess3d.prototype.createScene = function () {
        this.scene = new THREE.Scene();
    };

    /**
     * @memberof Chess3d
     * @this Chess3d
     */
    Chess3d.prototype.createCamera = function () {
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1, 1000);
        this.camera.position.x = 90;
        this.camera.position.y = 32;
        this.camera.position.z = 32;
        this.camera.lookAt(this.scene.position);
    };

    /**
     * @memberof Chess3d
     * @this Chess3d
     */
    Chess3d.prototype.createLights = function () {

    };

    /**
     * @memberof Chess3d
     * @this Chess3d
     */
    Chess3d.prototype.createChess = function () {
        this._white_material = new THREE.MeshBasicMaterial({color: 0xEEEEEE});
        this._black_material = new THREE.MeshBasicMaterial({color: 0x111111});

        this.createPawns();
        this.createRooks();
        this.createKnights();
        this.createBishops();
        this.createQueens();
        this.createKings();

    };

    Chess3d.prototype.createPawns = function () {
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        for(var i = 0; i < 8; ++i) {
            var wmesh = new THREE.Mesh(geometry, this._white_material);
            var bmesh = new THREE.Mesh(geometry, this._black_material);
            this.scene.add(wmesh);
            this.scene.add(bmesh);
        }
    };

    Chess3d.prototype.createRooks = function () {
        var geometry = new THREE.BoxGeometry(1, 2, 1);
        for(var i = 0; i < 2; ++i) {
            var wmesh = new THREE.Mesh(geometry, this._white_material);
            var bmesh = new THREE.Mesh(geometry, this._black_material);
            this.scene.add(wmesh);
            this.scene.add(bmesh);
        }
    };

    Chess3d.prototype.createKnights = function () {
        var geometry = new THREE.BoxGeometry(0.5, 2, 1.2);
        for(var i = 0; i < 2; ++i) {
            var wmesh = new THREE.Mesh(geometry, this._white_material);
            var bmesh = new THREE.Mesh(geometry, this._black_material);
            this.scene.add(wmesh);
            this.scene.add(bmesh);
        }
    };

    Chess3d.prototype.createBishops = function () {
        var geometry = new THREE.CylinderGeometry(1, 1, 2);
        for(var i = 0; i < 2; ++i) {
            var wmesh = new THREE.Mesh(geometry, this._white_material);
            var bmesh = new THREE.Mesh(geometry, this._black_material);
            this.scene.add(wmesh);
            this.scene.add(bmesh);
        }
    };

    Chess3d.prototype.createQueens = function () {
        var geometry = new THREE.CylinderGeometry(1, 1.5, 2.5);
        var wmesh = new THREE.Mesh(geometry, this._white_material);
        var bmesh = new THREE.Mesh(geometry, this._black_material);
        this.scene.add(wmesh);
        this.scene.add(bmesh);
    };

    Chess3d.prototype.createKings = function () {
        var geometry = new THREE.CylinderGeometry(1.5, 1, 2.5);
        var wmesh = new THREE.Mesh(geometry, this._white_material);
        var bmesh = new THREE.Mesh(geometry, this._black_material);
        this.scene.add(wmesh);
        this.scene.add(bmesh);
    };

    /**
     * @memberof Chess3d
     * @this Chess3d
     */
    function render () {
        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.render);
    }


})(window);