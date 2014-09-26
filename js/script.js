layers = [];
var canvas, ctx;
var fps = 60;
var fonts = ["Roboto", "lol"];
var activeLayer;
var dragging = false;
var newmx, newmy, mx, my, pmx, pmy; //Current and previous mouse x and y coordinates

$(document).ready(function() {
    //Set up listeners
    $("#newlayerbutton").click(function() {
        newLayer();
    });

    $("#overlay").mousedown(function() {
        dragging = true;
    });

    $(document).mouseup(function() {
        dragging = false;
    });

    $(document).mousemove(function(e) {
        var o = $("#watchcanvas").offset();
        newmx = e.pageX - o.left;
        newmy = e.pageY - o.top;
    });

    canvas = document.getElementById('watchcanvas');
    ctx = canvas.getContext('2d');

    loop();
});

function loop() {
    //Update mouse coords
    pmx = mx;
    pmy = my;
    mx = newmx;
    my = newmy;

    if (dragging && activeLayer) {
        activeLayer.x += mx - pmx;
        activeLayer.y += my - pmy;
        updateParams();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < layers.length; i++) {
        layers[i].draw(ctx);
    }

    requestAnimFrame(function() {
        loop();
    });
}

function newLayer(type) {
    $("#layerlist li").removeClass("active");
    if(type == "image"){
        //image icon
        icon = "glyphicon-picture";
    }else if(type == "shape"){
        //shape icon
        icon = "glyphicon-heart";
    }else{
        //text icon  
        icon = "glyphicon-font";
    }
    //append layer to layerlist
    $("#layerlist").append("<li layer='" + layers.length + "' class='active'><span class=\"glyphicon glyphicon-eye-open hideviewlayer\"></span><span class=\"glyphicon " + icon + "\"></span> Text" + layers.length + "<div class=\"options\"><span class=\"glyphicon glyphicon-tag\"></span><span class=\"glyphicon glyphicon-resize-vertical\"></span></div></li>");    
    layers.push(new Layer(layers.length, "text"));
    activeLayer = layers[layers.length - 1];
    updateLayerListeners();
    updateParams();
}

function updateLayerListeners() {
    $("#layerlist li").click(function() {
        $("#layerlist li").removeClass("active");
        $(this).addClass("active");
        activeLayer = layers[$(this).attr("layer")];
        updateParams();
    });
}

function updateParams() {
    if (activeLayer) {
        $("#parameterlist .x").val(activeLayer.x);
        $("#parameterlist .y").val(activeLayer.y);
    }
}

window.requestAnimFrame = (function() {
    return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000.0 / 60);
            };
})();