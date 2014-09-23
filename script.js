layers = [];
var canvas, ctx;
var fps = 60;
var fonts = ["Roboto", "lol"]; 
var activeLayer;

$(document).ready(function() {
    //Set up listeners
    $("#newlayerbutton").click(function() {
        newLayer();
    });
    
    canvas = document.getElementById('watchcanvas');
    ctx = canvas.getContext('2d');
    
    loop();
});

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for(var i = 0; i < layers.length; i++){
        layers[i].draw(ctx);
    }
    
    requestAnimFrame(function() {
        loop();
    });
}

function newLayer() {
    $("#layerlist li").removeClass("active");
    $("#layerlist").append("<li class='active'>Text" + layers.length + "</li>");
    layers.push(new Layer(layers.length, "text"));
    activeLayer = layers[layers.length-1];
    updateLayerListeners();
}

function updateLayerListeners() {
    $("#layerlist li").click(function() {
        $("#layerlist li").removeClass("active");
        $(this).addClass("active");
    });
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