//Here are some constants for easier setting
//ALIGNMENTS
var LEFT_ALIGN = 0;
var CENTER_ALIGN = 1;
var RIGHT_ALIGN = 2;
var ALIGNMENTS = [LEFT_ALIGN, CENTER_ALIGN, RIGHT_ALIGN];

//FONTS
var ROBOTO_THIN = 0;
var ROBOTO_LIGHT = 1;
var ROBOTO_CONDENSED_LIGHT = 2;
var ROBOTO = 3;
var ROBOTO_BLACK = 4;
var ROBOTO_CONDENSED = 5;
var ROBOTO_SLAB_THIN = 6;
var ROBOTO_SLAB_LIGHT = 7;
var ROBOTO_SLAB = 8;
var CUSTOM_FONT = 9;
var FONTS = [ROBOTO_THIN, ROBOTO_LIGHT, ROBOTO_CONDENSED_LIGHT, ROBOTO, ROBOTO_BLACK, ROBOTO_CONDENSED, ROBOTO_SLAB_THIN, ROBOTO_SLAB_LIGHT, ROBOTO_SLAB, CUSTOM_FONT];

//LAYER TYPES
var TEXT = "text";
var SHAPE = "shape";
var IMAGE = "image";
var LAYER_TYPES = [new LayerType(TEXT), new LayerType(SHAPE), new LayerType(IMAGE)];

//TEXT TRANSFORMS
var DEFAULT_TEXT = 0;
var UPPERCASE = 1;
var LOWERCASE = 2;
var TEXT_TRANSFORMS = [DEFAULT_TEXT, UPPERCASE, LOWERCASE];


//The data parameter can be a JSON or some other data form which will allow layers to be loaded with data already
function Layer(id, type, data) {
    if(data === undefined)
        data = {};
    this.type = type;
    this.id = id || this.type.substring(0,1).toUpperCase()+this.type.substring(1) + layerManager.length;
    this.alignment = LEFT_ALIGN;
    this.x = 160;
    this.y = 160;
    this.r = 0;
    this.visible = true;
    this.low_power = true;
    this.opacity = 100;
    this.size = 24;
    this.index = layerManager.length;

    if (type === TEXT) {
        this.text = data.text || this.id;
        this.color = "#FFF";
        this.bgcolor = "#000";
        this.low_power_color = "#000";
        this.font_family = ROBOTO_THIN;
        this.bold = false;
        this.italic = true;
        this.transform = DEFAULT_TEXT;
    } else if(type === IMAGE) {
        this.height = 320;
        this.hash = "";
        this.width = 320;
    } else if(type === SHAPE) {
        this.stroke_size = 6;
        this.shape_opt = 0; //Not sure what this means
        this.radius = 320;
        this.shape_type = 1; //Not sure whatthis meanns
        this.sides = 6;
    }
    //This will be the actual function to output to the layer list -- thus the OO model will be easier to update
    Layer.prototype.toLayerHTML = function() {
        var out= "<li layer='" + layerManager.length + "' class='active'><span class='primaryIcons'>&nbsp;<span class=\"glyphicon glyphicon-eye-open hideviewlayer\"></span><span class=\"glyphicon glyphicon-" + new LayerType(this.type).icon + "\"></span></span> <span class='layerName'>" + this.id;
        if(this.type == TEXT)
            out += "&nbsp;<small>("+this.text+")</small>";
        out += "</span><div class=\"options\"><span class=\"glyphicon glyphicon-tag\"></span><span class=\"glyphicon glyphicon-resize-vertical\"></span></div></li>";
        return out;
    };
    Layer.prototype.toJSON = function() {
        var j = {id: this.index, type:this.type, alignment: this.alignment, opacity: this.opacity, x: this.x, y: this.y, low_power: this.lower_power, r: this.r};
        j = new LayerType(this.type).toJSON(j, this);
        return j;
    };
    Layer.prototype.draw = function(cn) {
        new LayerType(this.type).draw(this, cn);
    };
}

//If there are ever more types of things, this class will make it really easy to add another
function LayerType(name) {
    this.name = name;
    switch(name) {
        case IMAGE:
            this.icon = "picture";
            this.toJSON = function(json, layer) {
                json.height = layer.height;
                json.width = layer.width;
                json.hash = layer.hash;
                return json;
            };
            this.draw = function(layer, context) {

            };
            break;
        case SHAPE:
            this.icon = "heart";
            this.toJSON = function(json, layer) {
                json.width = layer.width;
                json.stroke_size = layer.stroke_size;
                json.shape_opt = layer.shape_opt;
                json.radius = layer.radius;
                json.shape_type = layer.shape_type;
                json.sides = layer.sides;
                return json;
            };
            this.draw = function(layer, context) {
  
            };
            break;
        default: 
            this.icon = "font";
            this.toJSON = function(json, layer) {
                json.text = layer.text;
                if(layer.font_hash !== "")
                    json.font_hash = layer.font_hash;
                json.italic = layer.italic;
                json.bgcolor = layer.bgcolor;
                json.size = layer.size;
                json.transform = layer.transform;
                json.bold = layer.bold;
                json.color = layer.color; //NOTE I'm seeing some weird values
                json.font_family = layer.font_family;
                json.low_power_color = layer.low_power_color;
                return json;
            };
            this.draw = function(layer, context) {
                if (layer.alignment === LEFT_ALIGN) {
                    context.textAlign = "left";
                } else if (layer.alignment === CENTER_ALIGN) {
                    context.textAlign = "center";
                }
                else if (layer.alignment === RIGHT_ALIGN) {
                    context.textAlign = "right";
                }

                context.font = layer.size+"px "+fonts[0];
                context.fillStyle = layer.color;
                context.fillText(layer.text, layer.x, layer.y);   
            };
    }
}
function LayerManager() {
    this.activeLayer;
    this.length = 0;
    this.layers = [];
    LayerManager.prototype.add = function(nL) {
        if(nL === undefined)
            nL = new Layer(undefined, "text");
        nL.index = this.layers.length;
        $("#layerlist li").removeClass("active");
        $("#layerlist").append(nL.toLayerHTML());    
        this.layers.push(nL);
        this.activeLayer = this.layers[this.layers.length - 1];
        updateLayerListeners();
        updateParams();
        this.length = this.layers.length;
        loop();
    };
    //Can find a layer from it's id, or returns false if not
    LayerManager.prototype.find = function(id, case_sensitive) {
        if(case_sensitive === undefined)
            case_sensitive = true;
        for(i in this.layers) {
            if(this.layers[i].id == id && case_sensitive) {
                return this.layers[i];   
            } else if(this.layers[i].id.toLowerCase() == id.toLowerCase() && !case_sensitive)
                return this.layers[i];
        }
        return false;
    };
    //Finds and returns index: can be used for deletion
    LayerManager.prototype.indexOf = function(id, case_sensitive) {
        if(this.find(id, case_sensitive) !== false)
            return this.find(id, case_sensitive).index;
        return false;
    };  
    LayerManager.prototype.delete = function(index) {
        $('li[layer='+index+']').remove();
        var deleted = this.layers.slice(index,index+1);
        loop();
        return deleted;
    };
    LayerManager.prototype.toFacer = function() {
        var json = [];
        for(i in this.layers) {
            json.push(this.layers[i].toJSON());
        }
        //Now we have the whole JSON. This goes up to another function which adds in images, fonts, and other elements,
        //  wraps into a zip, and then serves it as a Blob for the user to download, or maybe cloud functions
        return json;
    };
    LayerManager.prototype.save = function() {
        //Saves watchface to localStorage
        var name = document.getElementById("watchtitle").value;
        localStorage[name.split(" ").join("_")] = JSON.stringify(this.toFacer());
    };  
    LayerManager.prototype.load = function(name) {
        //Loads from localStorage
        var j = JSON.parse(localStorage[name]);
        document.getElementById('watchtitle').value = name.split("_").join(" ");
        this.layers = j;
    };  
}
layerManager = new LayerManager();

function Watch(id, name, round) {
    this.id = id;
    this.name = name;   
    this.round = round;
    Watch.prototype.toSelect = function() {
        return '<option value="'+this.id+'">'+this.name+'</option>';
    }
    Watch.prototype.getName = function() {
        return this.name;   
    };
    Watch.prototype.getId = function() {
        return this.id;  
    };
}
function WatchManager() {
    this.watches = {moto360: new Watch("moto360", "Moto360", true), gwatch: new Watch("gwatch", "LG G Watch", false)};
    WatchManager.prototype.find = function(name) {
        for(i in this.watches) {
            if(this.watches[i].getName() == name || this.watches[i].getId() == name) {
                return this.watches[i];
            }   
        }
        return false;
    };
}
watchManager = new WatchManager();
function WatchFace(lm) {
    this.layerManager = lm;
    this.toZip = function() {
        var name = document.getElementById("watchtitle").value;
        this.description_json = {build: "0.90.011", id: "1", title: name, facer_webapp: "true"}; //Description.json generator FIXME id, build
        this.preview_png = "";
        this.watchface_json = this.layerManager.toFacer();
        //TODO Get Images folder with hash as file, fonts as hash with file
        //Return Blob
    };
    //Import blob
    this.import = function(blob) {
        
    };
    //Return Blob
    this.export = function() {
        var blob = this.toZip();
    };
    
}
watchFace = new WatchFace(layerManager);