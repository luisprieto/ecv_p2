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
        //this.speed_anim = 700;
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
        window.addEventListener("resize", this.resizeCanvas.bind(this), false);
    };

    Chess3d.prototype.resizeCanvas = function () {
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        //this.camera.aspect = this.container.offsetWidth/this.container.offsetHeight;
        this.createCamera();
    };

    Chess3d.prototype.start = function () {
        this.container.appendChild(this.renderer.domElement);
        this.resizeCanvas();
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

    Chess3d.prototype.movePiece = function(id, from, to, captured, show, speed)
    {
        speed = speed || 700;
        var object = this.objects[id];
        var board_coord = this.getBoardCoord(to);
        var board_coord_from = this.getBoardCoord(from);

        var position = {x: object.position.x, z: object.position.z};
        var target = {x: board_coord.x, z: board_coord.z};
        var tween = new TWEEN.Tween(position).to(target, speed);
        tween.onUpdate(function() {
            object.position.x = this.x;
            object.position.z = this.z;
        });

        var c_tween = undefined;
        if(captured) {
            var piece = this.objects[captured];

            var c_position;
            var c_target;
            if(!show) {
                c_position = {angle: 0};
                c_target = {angle: Math.PI / 2};
                //piece.position.x = board_coord.x;
                //piece.position.z = board_coord.z;
            }
            else {
                c_position = {angle: Math.PI / 2};
                c_target = {angle: 0};
                piece.position.x = board_coord_from.x;
                piece.position.z = board_coord_from.z;
                piece.visible = !!show;
            }
            c_tween = new TWEEN.Tween(c_position).to(c_target, 500);
            c_tween.onUpdate(function() {
                piece.rotation.x = this.angle;
            });
            c_tween.onComplete(function() {
                piece.visible = !!show;
            });
            //if(!show) this.scene.remove(piece);

        }
        tween.start();
        if(c_tween) c_tween.delay(speed - 500).start();

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
            if(i != "board" && this.objects.hasOwnProperty(i)){
                var piece = this.objects[i];
                piece.visible = false;
                piece.rotation.x = 0;
            }
        }
    };

    /**
     * @memberof Chess3d
     * @this Chess3d
     */
    Chess3d.prototype.createRenderer = function () {
        this.renderer =  new THREE.WebGLRenderer({antialias: true, shadowMapEnabled: true});
        this.renderer.setClearColor(0x708B9B, 1.0);
        //console.log(this.container.offsetHeight, this.container.offsetHeight);
        this.renderer.setSize(this.container.offsetHeight, this.container.offsetHeight);
        //this.renderer.setSize(500,500);
        this.renderer.shadowMapEnabled = true;
        //this.renderer.antialias = true;

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
            this.container.offsetWidth/this.container.offsetHeight,
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
        var ambient_light = new THREE.AmbientLight( 0xAAAAAA ); // soft white light
        this.scene.add( ambient_light );

        // create a light
        var light1 = new THREE.SpotLight(0xffffff);
        var light2 = new THREE.SpotLight(0xffffff);
        light1.position.set(0,1000,300);
        light2.position.set(0,1000,-300);
        light1.target.position = new THREE.Object3D( 0, 0, 0 );
        light1.target.position = new THREE.Object3D( 0, 0, 0 );

        light1.shadowMapWidth  =  light2.shadowMapWidth = 1024;
        light1.shadowMapHeight =  light2.shadowMapHeight = 1024;

        light1.shadowCameraNear = light2.shadowCameraNear = 1;
        light1.shadowCameraFar =  light2.shadowCameraFar = 5000;
        light1.shadowCameraFov =  light2.shadowCameraFov = 70;

        light1.castShadow =     light2.castShadow = true;
        light1.shadowDarkness = light2.shadowDarkness = 0.3;

        this.scene.add(light1);
        //this.scene.add(light2);
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
        var floorMaterial = new THREE.MeshPhongMaterial( { map: floorTexture, side: THREE.DoubleSide } );
        floorMaterial.shininess = 2;

        var floorGeometry = new THREE.PlaneGeometry(1200, 1200, 1, 1);
        var floor = new THREE.Mesh(floorGeometry, floorMaterial);

        //floor.castShadow = true;
        floor.receiveShadow = true;

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
    function render (time) {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.render);
        TWEEN.update(time);
    }

    function loadModelCallback(id, offset, rotation, object) {


        var pivot = new THREE.Object3D();
        object.position.y = offset;
        object.rotation.y += Math.PI*rotation;
        //object.castShadow = true;
        /*object.traverse(function(c) {
            c.castShadow = true;
            c.receiveShadow = true;
        });*/
        object.children.forEach(function(c) {
            c.castShadow = true;
            c.receiveShadow = true;
        });
        pivot.add(object);
        pivot.name = id;
        this.objects[id] = pivot;

        //object.position.y = offset;
        //object.translateY(offset);
        //object.rotation.y += Math.PI*rotation;
        //object.name = id;
        //this.objects[id] = object;

        this.loadedObjects++;
        if (this.loadedObjects >= 32 && this.on_ready) this.on_ready();
    }


})(window);