class Canvas {
    constructor(element) 
    {
        this.element = element;
        this.viewPos = { x: 0, y: 0 };
        this.shapes = [];

        let self = this;

        this.element.onclick = function(e) {
            Log.info('click');
            self.createShape(e.offsetX + self.viewPos.x, e.offsetY + self.viewPos.y);
        }
    }

    createShape(x, y) 
    {
        let el = document.createElement('div');
        el.style = "width:10px; height: 10px; background-color: red; position: absolute";
        el.style.top = `${y}px`;
        el.style.left = `${x}px`;
    
        this.element.appendChild(el);
    }
    
}
