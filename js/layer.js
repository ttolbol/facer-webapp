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
    this.index = 0;

    if (type === "text") {
        this.text = data.text || this.id;
        this.color = "#FFF";
        this.bgcolor = "#000";
        this.low_power_color = "#000";
        this.font_family = ROBOTO_THIN;
        this.bold = false;
        this.italic = true;
        this.transform = DEFAULT_TEXT;
    }
}

//This will be the actual function to output to the layer list -- thus the OO model will be easier to update
//TODO Create a layerManager Class 
Layer.prototype.toLayerHTML = function() {
    var out= "<li layer='" + layerManager.length + "' class='active'><span class='primaryIcons'>&nbsp;<span class=\"glyphicon glyphicon-eye-open togglelayer\"></span><span class=\"glyphicon glyphicon-" + new LayerType(this.type).icon + "\"></span></span> <span class='layerName'>" + this.id;
    if(this.type == TEXT)
        out += "&nbsp;<small>("+this.text+")</small>";
    out += "</span><div class=\"options\"><span class=\"glyphicon glyphicon-tag\"></span><span class=\"glyphicon glyphicon-resize-vertical\"></span></div></li>";
    return out;
}
Layer.prototype.draw = function(ctx) {
    if (this.type === "text") {
        if (this.alignment === LEFT_ALIGN) {
            ctx.textAlign = "left";
        } else if (this.alignment === CENTER_ALIGN) {
            ctx.textAlign = "center";
        }
        else if (this.alignment === RIGHT_ALIGN) {
            ctx.textAlign = "right";
        }

        ctx.font = this.size+"px "+fonts[0];
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.x, this.y);
    }
};
//If there are ever more types of things, this class will make it really easy to add another
function LayerType(name) {
    this.name = name;
    switch(name) {
        case IMAGE:
            this.icon = "picture";
            break;
        case SHAPE:
            this.icon = "heart";
            break;
        default: 
            this.icon = "font";
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
        return this.layers.slice(index,index+1);
    }
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