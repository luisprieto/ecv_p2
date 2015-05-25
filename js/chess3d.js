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
        this.camera = undefined;
        this.container = container;
        this.render = render.bind(this);
        this.objects = {};

        this.positions = {
            a1: {x:375, z:380},
            a2: {x:375, z:270},
            a3: {x:375, z:160},
            a4: {x:375, z:50},
            a5: {x:375, z:-50},
            a6: {x:375, z:-160},
            a7: {x:375, z:-270},
            a8: {x:375, z:-380}
        };

    }

    _global.Chess3d = Chess3d;

    /**
     * @memberof Chess3d
     * @this Chess3d
     */
    Chess3d.prototype.init = function () {
        this.loader = new THREE.OBJMTLLoader();
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

    Chess3d.prototype.setPiece = function(id, coord)
    {
        var object = this.objects[id];
        object.position.x = positions[coord].x;
        object.position.z = positions[coord].z;
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
        renderer.shadowMapEnabled = true;

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
            500 / 500,
            0.1, 1000);
        camera.position.x = 500;
        camera.position.y = 1000;
        camera.position.z = 0;
        this.camera.lookAt(this.scene.position);
    };

    /**
     * @memberof Chess3d
     * @this Chess3d
     */
    Chess3d.prototype.createLights = function () {
        var light = new THREE.AmbientLight( 0xFFFFFF ); // soft white light
        scene.add( light );
    };

    /**
     * @memberof Chess3d
     * @this Chess3d
     */
    Chess3d.prototype.createChess = function () {
        //this._white_material = new THREE.MeshBasicMaterial({color: 0xEEEEEE});
        //this._black_material = new THREE.MeshBasicMaterial({color: 0x111111});

        this.createBoard();
        this.createPawns();
        this.createRooks();
        this.createKnights();
        this.createBishops();
        this.createQueens();
        this.createKings();

    };


    Chess3d.prototype.createBoard = function () {
        ///////////
        // FLOOR //
        ///////////

        // note: 4x4 checkboard pattern scaled so that each square is 25 by 25 pixels.
        var floorTexture = new THREE.ImageUtils.loadTexture( 'resources/chessboard.jpg' );
        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;

        // DoubleSide: render texture on both sides of mesh
        var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
        var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
        var floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.y = -0.5;
        floor.rotation.x = Math.PI / 2;
        scene.add(floor);
        this.objects["board"] = floor;
    };

    Chess3d.prototype.createPawns = function () {
        for(var i = 1; i <= 8; ++i) {
            this.loadModel(
                'resources/models/pawn_1.obj',
                'resources/models/pawn_1.mtl',
                "white_pawn" + i
            );
            this.loadModel(
                'resources/models/pawn_2.obj',
                'resources/models/pawn_2.mtl',
                "black_pawn" + i
            );
        }
    };

    Chess3d.prototype.createRooks = function () {
        for(var i = 1; i <= 2; ++i) {
            this.loadModel(
                'resources/models/rook_1.obj',
                'resources/models/rook_1.mtl',
                "white_rook" + i
            );
            this.loadModel(
                'resources/models/rook_2.obj',
                'resources/models/rook_2.mtl',
                "black_rook" + i
            );
        }
    };

    Chess3d.prototype.createKnights = function () {
        for(var i = 1; i <= 2; ++i) {
            this.loadModel(
                'resources/models/knight_1.obj',
                'resources/models/knight_1.mtl',
                "white_knight" + i
            );
            this.loadModel(
                'resources/models/knight_2.obj',
                'resources/models/knight_2.mtl',
                "black_knight" + i
            );
        }
    };

    Chess3d.prototype.createBishops = function () {
        for(var i = 1; i <= 2; ++i) {
            this.loadModel(
                'resources/models/bishop_1.obj',
                'resources/models/bishop_1.mtl',
                "white_bishop" + i
            );
            this.loadModel(
                'resources/models/bishop_2.obj',
                'resources/models/bishop_2.mtl',
                "black_bishop" + i
            );
        }
    };

    Chess3d.prototype.createQueens = function () {
        this.loadModel(
            'resources/models/queen_1.obj',
            'resources/models/queen_1.mtl',
            "white_queen"
        );
        this.loadModel(
            'resources/models/queen_2.obj',
            'resources/models/queen_2.mtl',
            "black_queen"
        );
    };

    Chess3d.prototype.createKings = function () {
        this.loadModel(
            'resources/models/king_1.obj',
            'resources/models/king_1.mtl',
            "white_king"
        );
        this.loadModel(
            'resources/models/king_2.obj',
            'resources/models/king_2.mtl',
            "black_king"
        );
    };

    Chess3d.prototype.loadModel = function(obj, mtl, id) {
        this.loader.load(
            // OBJ resource URL
            obj,
            // MTL resource URL
            mtl,
            // Function when both resources are loaded
            loadModelCallback.bind(this, id)/*,
            // Function called when downloads progress
            function ( xhr ) {
                console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            },
            // Function called when downloads error
            function ( xhr ) {
                console.log( 'An error happened' );
            }*/
        );
    };

    /**
     * @memberof Chess3d
     * @this Chess3d
     */
    function render () {
        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.render);
    }

    function loadModelCallback(id, object) {
        console.log(id, object);
        object.position.y = 100;
        //setPiece(object, "a2");
        this.scene.add( object );
        this.objects[id] = object;
    }


})(window);