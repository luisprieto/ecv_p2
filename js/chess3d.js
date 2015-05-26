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
        this.controls = undefined;
        this.container = container;
        this.render = render.bind(this);
        this.objects = {};
        this.loadedObjects = 0;

        this.square_size = 134;

        this.on_ready = undefined;

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
        this.container.appendChild(this.renderer.domElement);
        this.render();
    };

    Chess3d.prototype.getBoardCoord = function(coord){
        var square_size = this.square_size;
        var posx;
        var posz;
        var l = coord[0];
        var n = coord[1];
        switch(l)
        {
            case 'a':
                posz = square_size*3.5;
            break;
            case 'b':
                posz = square_size*2.5;
            break;
            case 'c':
                posz = square_size*1.5;
            break;
            case 'd':
                posz = square_size*0.5;
            break;
            case 'e':
                posz = square_size*-0.5;
            break;
            case 'f':
                posz = square_size*-1.5;
            break;
            case 'g':
                posz = square_size*-2.5;
            break;
            case 'h':
                posz = square_size*-3.5;
            break;
        }
        switch(n)
        {
            case '1':
                posx = square_size*3.5;
            break;
            case '2':
                posx = square_size*2.5;
            break;
            case '3':
                posx = square_size*1.5;
            break;
            case '4':
                posx = square_size*0.5;
            break;
            case '5':
                posx = square_size*-0.5;
            break;
            case '6':
                posx = square_size*-1.5;
            break;
            case '7':
                posx = square_size*-2.5;
            break;
            case '8':
                posx = square_size*-3.5;
            break;
        }

        return {x: posx, z: posz};
    };

    Chess3d.prototype.movePiece = function(id, to, captured, show)
    {
        var object = this.objects[id];

        var board_coord = this.getBoardCoord(to);
        
        object.position.x = board_coord.x;
        object.position.z = board_coord.z;
        if(captured) {
            var piece = this.objects[captured];
            //if(!show) this.scene.remove(piece);
            piece.visible = !!show;

        }
    };

    Chess3d.prototype.setPiece = function(id, coord)
    {
        var object = this.objects[id];
        object.visible = true;
        var board_coord = this.getBoardCoord(coord);
        
        object.position.x = board_coord.x;
        object.position.z = board_coord.z;

        this.scene.add(object);
    };

    Chess3d.prototype.clearBoard = function(){
        for(var i in this.objects){
            if(i != "board"){
                var piece = this.objects[i];
                piece.visible = false;
            }
        }
    };

    /**
     * @memberof Chess3d
     * @this Chess3d
     */
    Chess3d.prototype.createRenderer = function () {
        this.renderer =  new THREE.WebGLRenderer();
        this.renderer.setClearColor(0x708B9B, 1.0);
        //console.log(this.container.offsetHeight, this.container.offsetHeight);
        //this.renderer.setSize(this.container.offsetHeight, this.container.offsetHeight);
        this.renderer.setSize(500,500);
        this.renderer.shadowMapEnabled = true;

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
            0.1, 10000);
        this.camera.position.x = 500;
        this.camera.position.y = 1000;
        this.camera.position.z = 0;
        this.camera.lookAt(this.scene.position);

        this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
    };

    /**
     * @memberof Chess3d
     * @this Chess3d
     */
    Chess3d.prototype.createLights = function () {
        var ambient_light = new THREE.AmbientLight( 0xFFFFFF ); // soft white light
        this.scene.add( ambient_light );

        // create a light
        var light = new THREE.PointLight(0xffffff);
        light.position.set(0,250,0);
        this.scene.add(light);
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
        var floorGeometry = new THREE.PlaneGeometry(1200, 1200, 1, 1);
        var floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.y = -0.5;
        floor.rotation.x = Math.PI / 2;
        this.scene.add(floor);
        floor.name = "board";
        this.objects["board"] = floor;
    };

    Chess3d.prototype.createPawns = function () {
        for(var i = 1; i <= 8; ++i) {
            this.loadModel(
                'resources/models/pawn_1.obj',
                'resources/models/pawn_1.mtl',
                "white_pawn" + i,
                55,
                1
            );
            this.loadModel(
                'resources/models/pawn_2.obj',
                'resources/models/pawn_2.mtl',
                "black_pawn" + i,
                55,
                1
            );
        }
    };

    Chess3d.prototype.createRooks = function () {
        for(var i = 1; i <= 2; ++i) {
            this.loadModel(
                'resources/models/rook_1.obj',
                'resources/models/rook_1.mtl',
                "white_rook" + i,
                65,
                1
            );
            this.loadModel(
                'resources/models/rook_2.obj',
                'resources/models/rook_2.mtl',
                "black_rook" + i,
                65,
                1
            );
        }
    };

    Chess3d.prototype.createKnights = function () {
        for(var i = 1; i <= 2; ++i) {
            this.loadModel(
                'resources/models/knight_1.obj',
                'resources/models/knight_1.mtl',
                "white_knight" + i,
                85,
                3/2
            );
            this.loadModel(
                'resources/models/knight_2.obj',
                'resources/models/knight_2.mtl',
                "black_knight" + i,
                85,
                5/2
            );
        }
    };

    Chess3d.prototype.createBishops = function () {
        for(var i = 1; i <= 2; ++i) {
            this.loadModel(
                'resources/models/bishop_1.obj',
                'resources/models/bishop_1.mtl',
                "white_bishop" + i,
                90,
                1
            );
            this.loadModel(
                'resources/models/bishop_2.obj',
                'resources/models/bishop_2.mtl',
                "black_bishop" + i,
                90,
                1
            );
        }
    };

    Chess3d.prototype.createQueens = function () {
        this.loadModel(
            'resources/models/queen_1.obj',
            'resources/models/queen_1.mtl',
            "white_queen",
            108,
            1
        );
        this.loadModel(
            'resources/models/queen_2.obj',
            'resources/models/queen_2.mtl',
            "black_queen",
            108,
            1
        );
    };

    Chess3d.prototype.createKings = function () {
        this.loadModel(
            'resources/models/king_1.obj',
            'resources/models/king_1.mtl',
            "white_king",
            124,
            1
        );
        this.loadModel(
            'resources/models/king_2.obj',
            'resources/models/king_2.mtl',
            "black_king",
            124,
            1
        );
    };

    Chess3d.prototype.loadModel = function(obj, mtl, id, offset, rotation) {
        this.loader.load(
            // OBJ resource URL
            obj,
            // MTL resource URL
            mtl,
            // Function when both resources are loaded
            loadModelCallback.bind(this, id, offset, rotation)
        );
    };

    /**
     * @memberof Chess3d
     * @this Chess3d
     */
    function render () {
        this.controls.update();

        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.render);
    }

    function loadModelCallback(id, offset, rotation, object) {
        object.position.y = offset;
        object.rotation.y += Math.PI*rotation;
        object.name = id;
        this.objects[id] = object;

        this.loadedObjects++;
        if (this.loadedObjects >= 32 && this.on_ready) this.on_ready();
    }


})(window);