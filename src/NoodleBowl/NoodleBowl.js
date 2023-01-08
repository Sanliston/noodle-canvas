import { defaultNoodleParams, gridHeight, gridWidth } from "../defaultParams";
import Noodle from "../Noodle/Noodle";

class NoodleBowl {

    coveredSpace = []; //This will be a matrix of the covered space in the bowl

    constructor (options = {
        xCoord: gridWidth/2,
        yCoord: gridHeight/2,
        thickness: 10, 
        radius: (gridHeight-20)/2, 
        noodleParams: defaultNoodleParams, 
        styles: {}
    }) {
        const {ctx, xCoord, yCoord, radius, thickness, styles, noodleParams} = options; 
        this.ctx = ctx;
        this.noodleParams = noodleParams || this.noodleParams; 
        this.xCoord = xCoord || this.xCoord;
        this.yCoord = yCoord || this.yCoord; 
        this.radius = radius || this.radius;
        this.thickness = thickness || this.thickness;
        this.styles = styles || this.styles;
    }

    draw () {
        let ctx = this.ctx; 

        //fill space in between
        ctx.lineWidth = 10; 
        ctx.strokeStyle = 'gray';
        
        ctx.beginPath();
        ctx.arc(this.xCoord, this.yCoord, this.radius-(ctx.lineWidth/2), 0, 2 * Math.PI); //note angles in arc function are in radians -  so would need to convert if passed as degrees from user
        ctx.stroke();

        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';

        //outter circle
        ctx.beginPath();
        ctx.arc(this.xCoord, this.yCoord, this.radius, 0, 2 * Math.PI); //note angles in arc function are in radians -  so would need to convert if passed as degrees from user
        ctx.stroke();

        //inner circle
        ctx.beginPath();
        ctx.arc(this.xCoord, this.yCoord, this.radius-10, 0, 2 * Math.PI); //note angles in arc function are in radians -  so would need to convert if passed as degrees from user
        ctx.stroke();

        //get values for inner circle to establish boundary
        let calcAngle = 0; 
        let boundaryCoordinates=[]; 
        let calcRadius = (this.radius);
        while(calcAngle < 360){

            let angle = calcAngle * (Math.PI/180);
            let x = this.xCoord + calcRadius*Math.cos(angle);
            let y = this.yCoord + calcRadius*Math.sin(angle);

            boundaryCoordinates.push({
                x,y
            });

            calcAngle += 20; //the lower this value the less likely noodles are to go out of bounds 
        }

        //noodles should be drawn within bowl - it makes more sense than drawing them from canvas class 
        let noodles = [];
        let noodleCount = this.noodleParams.noodleCount || 330; //ideal amount of noodles seems to be 330
        for(var i = 0; i < noodleCount ; i++){

            let noodle = new Noodle({
                ctx,
                ...this.noodleParams,
                boundaryCircle: {
                    x: this.xCoord,
                    y: this.yCoord,
                    radius: this.radius-this.thickness,
                    boundaryCoordinates
                }
            });

            noodles.push(noodle);
            noodle.draw(); 
   
        }
        
    }

}

export default NoodleBowl; 