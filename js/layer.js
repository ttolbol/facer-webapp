function Layer(id, type) {
    this.id = id;
    this.type = type;
    this.alignment = 0;
    this.x = 160;
    this.y = 160;
    this.r = 0;
    this.visible = true;
    this.low_power = true;
    this.opacity = 100;
    this.size = 24;

    if (type === "text") {
        this.text = "Text" + id;
        this.color = "#FFF";
        this.bgcolor = "#000";
        this.low_power_color = "#000";
        this.font_family = 0;
        this.bold = false;
        this.italic = true;
        this.transform = 0;
    }


}

Layer.prototype.draw = function(ctx) {
    if (this.type === "text") {
        if (this.alignment === 0) {
            ctx.textAlign = "left";
        } else if (this.alignment === 1) {
            ctx.textAlign = "center";
        }
        else if (this.alignment === 2) {
            ctx.textAlign = "right";
        }

        ctx.font = this.size+"px "+fonts[0];
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.x, this.y);
    }
};