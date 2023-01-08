import { defaultNoodleParams, gridHeight, gridWidth } from "../defaultParams";
import NoodleBowl from "../NoodleBowl/NoodleBowl";

//create the canvas class - using class approach to make it easier to convert to TS further down the line
class Canvas {

    height = gridHeight;
    width = gridWidth; 
    domSelector = '#canvas';
    noodleParams = defaultNoodleParams;

    constructor (options = {
        height: gridHeight,
        width: gridWidth,
        domSelector: '#canvas',
        noodleParams: defaultNoodleParams
    }) {


        const {height, width, noodleParams, domSelector, styles} = options; 

        this.height = height; 
        this.width = width; 
        this.domSelector = domSelector || this.domSelector; 
        this.domElement = document.querySelector(this.domSelector);
        this.noodleParams = noodleParams || this.noodleParams; 

        if(this.domElement.getContext){ 
            this.ctx = this.domElement.getContext('2d');
        }
    }

    draw (options = {
        height: gridHeight,
        width: gridWidth,
        domSelector: '#canvas',
        noodleParams: defaultNoodleParams
    }) {

        if(options){ //for cases where there is a redraw with new params
            const {height, width, noodleParams} = options; 
            this.height = height || this.height; 
            this.width = width || this.width; 
            this.noodleParams = noodleParams || this.noodleParams;
        }
        
        if(this.ctx){

            //clear
            this.ctx.clearRect(0,0,this.width, this.height);

            this.ctx.fillStyle = 'rgb(200, 0, 0)'; 

            //draw bowl
            let bowl = new NoodleBowl({
                ctx: this.ctx,
                xCoord: this.width/2,
                yCoord: this.height/2,
                thickness: 10,
                radius: (this.height-20)/2,
                noodleParams: this.noodleParams,
                styles: {

                }
            }); 

            bowl.draw(); //noodles included of course
        }
    }

    reset(){
        this.ctx.clearRect(0,0,this.width, this.height);
        
    }

}

export default Canvas; 