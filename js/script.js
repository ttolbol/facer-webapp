layers = [];
var canvas, ctx;
var fps = 10;
var fonts = ["Roboto", "lol"];
var dragging = false;
var newmx, newmy, mx, my, pmx, pmy; //Current and previous mouse x and y coordinates
var auto_time = true;

$(document).ready(function() {
    //Set up listeners
    $("#newlayerbutton").click(function() {
        newLayer();
    });

    $("#overlay").mousedown(function() {
        dragging = true;
    });
    $('#auto-time').click(function() {
        auto_time = $(this)[0].checked;
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
    setInterval(function() {
            if(auto_time) {
                var now = new Date();
                $('#date').val(now.getFullYear()+"-"+(now.getMonth()+1>9?now.getMonth()+1:"0"+(now.getMonth()+1))+"-"+(now.getDate()>9?now.getDate():"0"+now.getDate()));
                $('#time').val((now.getHours()>9?now.getHours():"0"+now.getHours)+":"+(now.getMinutes()>9?now.getMinutes():"0"+now.getMinutes()));
            }
    }, 1000);
    
    //Default Layers
    layerManager.add(new Layer("Background", IMAGE));
    layerManager.add(new Layer("Hour Hand", IMAGE));
    layerManager.add(new Layer("Minute Hand", IMAGE));
    layerManager.add(new Layer("Date", TEXT, {text: "20 aug"}));

    //Select face
    var out = "";
    for(i in watchManager.watches) {
        out += watchManager.watches[i].toSelect();   
    }
    $('.selectface').html(out);
});

function loop() {
    //Update mouse coords
    pmx = mx;
    pmy = my;
    mx = newmx;
    my = newmy;

<<<<<<< HEAD
    if (dragging && layerManager.activeLayer) {
=======
    if (dragging && activeLayer) {
>>>>>>> eeb2c05f036fbdefd0c191e0cc29117b17ac123a
        layerManager.activeLayer.x += mx - pmx;
        layerManager.activeLayer.y += my - pmy;
        updateParams();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

<<<<<<< HEAD
    for (i in layerManager.layers) {
=======
    for (var i = 0; i < layers.length; i++) {
>>>>>>> eeb2c05f036fbdefd0c191e0cc29117b17ac123a
        layerManager.layers[i].draw(ctx);
    }

    requestAnimFrame(function() {
        loop();
    });
    
    if(layerManager.activeLayer === undefined)
        return;
    
    //Layer selected loop
    if(layerManager.activeLayer.type === TEXT) {
        $('.panel-text').show();   
    } else {
        $('.panel-text').hide();   
    }
}

function newLayer(type) {
    //TODO Create a layer here and insert it as a parameter into this function
   layerManager.add();
}

function updateLayerListeners() {
    $("#layerlist li").click(function() {
        $("#layerlist li").removeClass("active");
        $(this).addClass("active");
        layerManager.activeLayer = layerManager.layers[$(this).attr("layer")];
        updateParams();
    });
}

function updateParams() {
    if (layerManager.activeLayer) {
        $("#parameterlist .x").val(layerManager.activeLayer.x);
        $("#parameterlist .y").val(layerManager.activeLayer.y);
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