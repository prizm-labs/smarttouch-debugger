
Orientations = {
            Landscape: 0,
            LandscapeUpsideDown: 1,
            Portrait: 2,
            PortraitUpsideDown: 3
        };

function View(orientation){

    var height, width;

    switch (orientation) {

        case Orientations.Landscape:
        case Orientations.LandscapeUpsideDown:
            height = 1080;
            width = 1920;
            break;

        case Orientations.Portrait:
        case Orientations.PortraitUpsideDown:
            height = 1920;
            width = 1080;
    }

    this.height = height;
    this.width = width;
    this.orientation = orientation;
}


View.prototype = {

}

function Node(data, textures){

}

function Card(data, textureKeys){

    this.isFlipped = false; // value showing
    this.data = data;
    this.sprites = [];

    _.each(textureKeys,function(key){

        var sprite = new PIXI.Sprite(GameWorld.textures[key]());
        // center the sprites anchor point
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;

        this.sprites.push(sprite)

    },this);
    
}

Card.prototype = {

    render: function(x,y,gameWorld){

        _.each(this.sprites,function(sprite){

                    // move the sprite t the center of the screen
            sprite.position.x = x;
            sprite.position.y = y;

            gameWorld.stage.addChild(sprite);
            
        },this);
        
        gameWorld.nodes.push(this);
    },

    // bind to reactive document
    link: function(collection){

    }
}

GameWorld = {

    templates: {},
    textures: {},
    nodes: [],

    // cache RFID UIDs as colors
    colors: [],

    // string array of template tags
    generateCards: function(manifest){
        _.each(manifest, function(obj){
            var card = this.templates[obj]();
            card.render(800,500,GameWorld);
            
        },this);
    },

    // loading batch of individual card images
    // via standardized JSON manifest
    loadBatch: function (manifestUrl, callback, isCrossOrigin) {
        var self = this;

        $.getJSON( manifestUrl, function( data ) {
            console.log(data);

            
            isCrossOrigin = isCrossOrigin || false;

            //var assetsToLoader = (typeof file == "string") ? [file] : file;
            // extract image paths
            var assetRootPath = 'assets/images/deck-default/SD/';
            var assetsToLoader = _.map(data.images, function(image) { return assetRootPath+image; });

            var loader = new PIXI.AssetLoader(assetsToLoader, isCrossOrigin);
            loader.onProgress = onLoadProgress;
            loader.onComplete = onLoadComplete.bind(self,data);
            loader.load();
        });

        // console.log('2D load', file, manifest);
        // var _this = this;

        

        function onLoadComplete(data) {
            console.log('onLoadComplete',this,data);

            var assetRootPath = 'assets/images/deck-default/SD/';

            // load texture cache with images
            _.forIn(data.images, function(value,key){
                this.textures[key] = function () {
                    var image = assetRootPath+value;
                    console.log(image);
                    return PIXI.Texture.fromImage(image);
                }
            },this);

            // generate templates
            _.each(data.cards, function(obj){
                this.templates[obj.tag] = function(collection){
                    return new Card(obj.data, obj.textures);
                }
            },this);

            // _.each(manifest, function (record) {

            //     var key = record[0], image = record[1];
            //     var template;

            //     if (typeof image == "string") { // single image for sprite
            //         console.log('image path', image);
            //         template = function () {
            //             return PIXI.Texture.fromImage(image);
            //         };

            //     } else { // multiple versions of sprite

            //         template = {};
            //         _.each(image, function (path, variant) {
            //             template[variant] = function () {
            //                 return PIXI.Texture.fromImage(path);
            //             }
            //         })
            //     }
            //     _this.templates[key] = template;

            // });

            if (callback) callback(); // Notify view that context preloaded
        }

        function onLoadProgress(loader) {
            console.log('onLoadProgress', loader);
        }
    },
    addChild: function(tag, posX, posY, anchorX, anchorY){

        // create a texture from an image path
        var texture = PIXI.Texture.fromImage("bunny.png");

        // create a new Sprite using the texture
        var bunny = new PIXI.Sprite(texture);

        // center the sprites anchor point
        bunny.anchor.x = anchorX;
        bunny.anchor.y = anchorY;

        // move the sprite t the center of the screen
        bunny.position.x = posX;
        bunny.position.y = posY;

        this.stage.addChild(bunny);

        return bunny;
    },
    changeBackgroundColor: function(colorIndex) {

        var colors = [0x66FF99,0xFF0000,0x00FF00,0x0000FF,0x000000];

        this.stage.setBackgroundColor(colors[colorIndex]);

    },

    render: function(element) {
        console.log(element);

        var self = this;

        // create an new instance of a pixi stage
        this.stage = new PIXI.Stage(0x66FF99);

        this.view = new View(Orientations.Landscape);

        // create a renderer instance
        this.renderer = PIXI.autoDetectRenderer(this.view.width, this.view.height);

        // add the renderer view element to the DOM
        //document.body.appendChild(renderer.view);
        element.appendChild(this.renderer.view);

        requestAnimFrame(animate);

        bunny = self.addChild("bunny",200,150,0.5,0.5);

        function animate() {

            requestAnimFrame(animate);

            // just for fun, let's rotate mr rabbit a little
            bunny.rotation += 0.1;

            // render the stage
            self.renderer.render(self.stage);
        }

    }
}