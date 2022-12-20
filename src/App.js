import logo from './logo.svg';
import './App.css';
import React from 'react';
import { toHaveStyle } from '@testing-library/jest-dom/dist/matchers';

function App() {



  return (
    <div className="App">


        <NoodleApp />
    </div>
  );
}

/*
    TODO 19/12/2022:

    -Enforce minimum and maximum length by calculating length of noodle based on perimeter of circles
    -Enforce bending when semicircle colides with bowl
    -Function descriptions
    -And you're DONE!!
*/ 

class NoodleApp extends React.Component {
  canvas = null; 
  constructor(props) {
      
      super(props)
      this.state = {
          canvasParameters: {
              height: 500,
              width: 500, 
          },
          noodleParameters: {
              noodleCount: 2,
              width: 20,
              minLength: 100,
              maxLength: 200,
              minRadius: 30
          },
          

      } 
  }

  componentDidMount () {

    if(!this.canvas){
        this.canvas = new Canvas({
            height: this.state.canvasParameters.height,
            width: this.state.canvasParameters.width,
            noodleParams: this.state.noodleParameters,
            domSelector: '#canvas',
        });
    
        this.canvas.draw(); //initial noodle bowl
    }
    
  }

  handleChange = (event) => {

    
    console.log('name: ', event.target.name);

    let noodleParameters = this.state.noodleParameters;
    noodleParameters[event.target.name] = event.target.value;

    this.setState({
        ...this.state,
        noodleParameters
    }); 

  }

  renderNoodles = (event)=> {
    event.preventDefault(); 

    if(this.canvas){
        console.log('drawing canvas on render');
        this.canvas.reset(); 

        this.canvas.draw({
            height: this.state.canvasParameters.height,
            width: this.state.canvasParameters.width,
            noodleParams: this.state.noodleParameters,
            domSelector: '#canvas',
        }); 
    }
  }

  render() {
      return (
          <div className='main-container'>

              
              <NoodleBowlComponent height={this.state.canvasParameters.height} width={this.state.canvasParameters.width} />
              
              

              <div className='options-container'>
                <form onSubmit={this.renderNoodles} className='options-form'>

                    <div className='option'>
                        <label htmlFor='count'>
                            Noodle count
                        </label>
                        <input 
                            name='noodleCount' 
                            type='number' 
                            value={this.state.noodleParameters.noodleCount} 
                            onChange={this.handleChange} /> 
                    </div>

                    <div className='option'>
                        <label htmlFor='width'>
                            Noodle width
                        </label>
                        <input name='width' type='number' value={this.state.noodleParameters.width} />
                    </div>
                    

                    <div className='option'>
                        <label htmlFor='minLength'>
                            Noodle min length
                        </label>
                        <input name='minLength' type='number' value={this.state.noodleParameters.minLength} />
                    </div>
                    

                    <div className='option'>
                        <label htmlFor='maxLength'>
                            Noodle max length
                        </label>
                        <input name='maxLength' type='number' defaultValue={this.state.noodleParameters.maxLength} />
                    </div>
                    

                    <div className='option'>
                        <label htmlFor='minRadius'>
                            Noodle min bend radius
                        </label>
                        <input name='minRadius' type='number' defaultValue={this.state.noodleParameters.minRadius} /> 
                    </div>

                    <button type='submit'>
                        Render Noodles
                    </button>                   

                </form>
              </div>
          </div>
      )
  }
}

class NoodleBowlComponent extends React.Component {

  
  constructor(props) {
      
      super(props); 
      this.state = {

      }
  }

  render () {

      return (
          <div className='noodle-bowl-container'>
  
              <canvas id='canvas' height={this.props.height} width={this.props.width} >
                
              </canvas>
  
          </div>
      );
  };
  

}

export default App;



//noodle canvas code here
console.log('script js has been loaded');

const gridHeight = 500;
const gridWidth = 500; 
const defaultNoodleParams = {
    noodleCount: 1,
    width: 20,
    minLength: 100,
    maxLength: 200,
    minRadius: 30
}

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

        console.log('Passed options: ', options);

        const {height, width, noodleParams, domSelector, styles} = options; 

        console.log('options: ', options);
        this.height = height; 
        this.width = width; 
        this.domSelector = domSelector || this.domSelector; 
        this.domElement = document.querySelector(this.domSelector);
        this.noodleParams = noodleParams || this.noodleParams; 

        console.log('domSelector: ', domSelector, ' this.domElement: ', this.domElement);

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

            console.log('canvas ctx: ', this.ctx);

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

class NoodleBowl {

    coveredSpace = []; //This will be a matrix of the covered space in the bowl

    constructor (options = {
        xCoord: gridWidth/2,
        yCoord: gridHeight/2,
        thickness: 5, 
        radius: (gridHeight-20)/2, 
        noodleParams: defaultNoodleParams, 
        styles: {}
    }) {
        const {ctx, xCoord, yCoord, radius, thickness, styles, noodleParams} = options; 
        this.ctx = ctx;
        this.noodleParams = noodleParams || this.noodleParams; 
        this.xCoord = xCoord || this.xCoord;
        this.yCoord = yCoord || this.yCoord; 

        console.log('this radius: ', this.radius, ' radius: ', radius, ' gridHeight: ', gridHeight, ' gridHeight/2: ', gridHeight/2);
        this.radius = radius || this.radius;
        this.thickness = thickness || this.thickness;
        this.styles = styles || this.styles;
    }

    draw () {
        let ctx = this.ctx; 

        console.log('noodelBowl ctx: ', this.ctx);

        console.log('bowl draw, this: ',this);

        //fill space in between
        let prevLineWidth = ctx.lineWidth;
        let prevStrokeStyle = ctx.strokeStyle; 

        ctx.lineWidth = this.thickness; 
        ctx.strokeStyle = 'gray';
        
        ctx.beginPath();
        ctx.arc(this.xCoord, this.yCoord, this.radius-(this.thickness/2), 0, 2 * Math.PI); //note angles in arc function are in radians -  so would need to convert if passed as degrees from user
        ctx.stroke();

        ctx.lineWidth = prevLineWidth;
        ctx.strokeStyle = prevStrokeStyle;

        //outter circle
        ctx.beginPath();
        ctx.arc(this.xCoord, this.yCoord, this.radius, 0, 2 * Math.PI); //note angles in arc function are in radians -  so would need to convert if passed as degrees from user
        ctx.stroke();

        //inner circle
        ctx.beginPath();
        ctx.arc(this.xCoord, this.yCoord, this.radius-this.thickness, 0, 2 * Math.PI); //note angles in arc function are in radians -  so would need to convert if passed as degrees from user
        ctx.stroke();

        //noodles should be drawn within bowl - it makes more sense than drawing them from canvas class 
        let noodles = [];
        let noodleCount = this.noodleParams.noodleCount || 450; //ideal amount of noodles seems to be 450
        let alternateOdds = 3; 
        for(var i = 0; i < noodleCount ; i++){

            let noodle = new Noodle({
                ctx,
                ...this.noodleParams,
                boundaryCircle: {
                    x: this.xCoord,
                    y: this.yCoord,
                    radius: this.radius-this.thickness
                }
            });

            noodles.push(noodle);

            noodle.drawSection();
            noodle.drawSection(1);
            noodle.drawNCircleSection();

            let alternate = utilities.generateRandomInteger(0,alternateOdds) === alternateOdds;
            noodle.drawNextCircleSection(alternate);
            noodle.drawNextCircleSection(alternate); 
            noodle.drawNextCircleSection(alternate); 
            // noodle.drawNextCircleSection(alternate); 
            // noodle.drawNextCircleSection(alternate); 
            
        }
        
    }

}

class Noodle {

    circleSectionCoordinates = {
        startPoint: null,
        endPoint: null
    };

    additionCircleSections = []; 

    constructor (options) {
        const {ctx, width = 20, minLength = 100, maxLength = 200, minRadius = 50, boundaryCircle } = options; 
        this.ctx = ctx; 
        this.width = width;
        this.minLength = minLength;
        this.maxLength = maxLength;
        this.minRadius = minRadius; 
        this.boundaryCircle = boundaryCircle;
    }

    draw () {
        //draws all sections at once

    }

    drawNext () {
        //draws next section

    }

    drawSection (section = 0) {
        //noodles will be drawn using a combination of bezier curves

        if(section == 0 && this.boundaryCircle){

            this.#drawCircleSection(); 
        }

        if(section == 1 && this.boundaryCircle){
            this.#drawCircleTangent(); 
        }
        

    }


    #drawCircleSection () {
        /*draw circle within edges of boundary 
            - generate radius r thats between 0 and maximum bend radius - for now, we'll just use 50
            - set x and y to be boundaryCircle.x - r  and boundaryCircle.y - r
            - come up with formula so x and y can be at only angle of the circle
        */

        let r = utilities.generateRandomInteger(this.minRadius, this.minRadius+50); 
        this.ctx.lineWidth = 10; 

        let distance = this.boundaryCircle.radius - r - (this.ctx.lineWidth/2); 
        let angle = utilities.generateRandomInteger(0,360); //to be randomly generated - strategically randomly generate for each 20degrees in a 360 circle so whole bowl is covered
        let visibleRadi = 1; //to be randomly generated

        //convert angle to radians
        angle = angle * (Math.PI / 180);

        //calculated drift in radians
        let drift = utilities.generateRandomInteger(-90,90) * (Math.PI/180); //randomly generated value
        let driftedAngle = angle + drift; 
        let startAngle = driftedAngle - (Math.PI/2); 
        let endAngle = driftedAngle + (Math.PI/2); 

        console.log('angle: ', angle, 'drift: ', drift, 'driftedAngle: ',driftedAngle, ' driftedStart: ', startAngle);


        //get xc,yc position at center of circle at angle and distance r
        let xc = distance * Math.cos(angle); 
        let yc = distance * Math.sin(angle);

        //displace based on boundary
        xc = Number(this.boundaryCircle.x) + xc; 
        yc = Number(this.boundaryCircle.y) + yc;

        //calculate point of contact with bowl
        let xd = this.boundaryCircle.radius * Math.cos(angle); 
        let yd = this.boundaryCircle.radius * Math.sin(angle);

        xd = Number(this.boundaryCircle.x) + xd; 
        yd = Number(this.boundaryCircle.y) + yd;
        
        this.ctx.beginPath();
        this.ctx.arc(xc, yc, r, startAngle, endAngle);
        this.ctx.stroke();

        //draw inner circle to represent thickness of noodle
        let prevLineWidth = this.ctx.lineWidth; 
        let prevGlobalCompisiteOperation = this.ctx.globalCompositeOperation;

        this.ctx.globalCompositeOperation = 'destination-out'; 
        this.ctx.lineWidth = 8;
        this.ctx.beginPath();
        this.ctx.arc(xc, yc, r, startAngle, endAngle);
        this.ctx.stroke();

        this.ctx.lineWidth = prevLineWidth;
        this.ctx.globalCompositeOperation = prevGlobalCompisiteOperation; 

        //calculate length
        let angleDiff = Math.abs(endAngle-startAngle); 
        let length = angleDiff*r;

        //calculate start and end coordinates and put in sectionCoordinates
        let startPoint = {
            x: xc + (r*Math.cos(startAngle)),
            y: yc + (r*Math.sin(startAngle))
        }

        let endPoint = {
            x: xc + (r*Math.cos(endAngle)),
            y: yc + (r*Math.sin(endAngle))
        }

        let center = {
            x:xc,
            y:yc
        }

        let bowlContact = {
            x: xd,
            y: yd
        }

        this.circleSectionCoordinates = {
            startPoint,
            endPoint,
            center,
            radius: r,
            angle,
            startAngle,
            bowlContact,
            length
        };

        //draw them just to see
        // let prevStrokeStyle = this.ctx.strokeStyle; 
        // this.ctx.strokeStyle = 'red'; 
        // this.ctx.beginPath();
        // this.ctx.arc(startPoint.x, startPoint.y, 5, 0, 2 * Math.PI); //repurpose this to draw the round end of the noodle if distanceMD >= distanceND
        // this.ctx.stroke();


        // this.ctx.beginPath();
        // this.ctx.arc(endPoint.x, endPoint.y, 5, 0, 2 * Math.PI); //repurpose this to draw the round end of the noodle if !distanceMD >= distanceND
        // this.ctx.stroke();

        // this.ctx.strokeStyle = 'green';
        // this.ctx.beginPath();
        // this.ctx.arc(xd, yd, 5, 0, 2 * Math.PI);
        // this.ctx.stroke();

        // this.ctx.strokeStyle = prevStrokeStyle; 
    }

    #drawCircleTangent () {
        let xm = this.circleSectionCoordinates.startPoint.x;
        let ym = this.circleSectionCoordinates.startPoint.y;

        let xn = this.circleSectionCoordinates.endPoint.x;
        let yn = this.circleSectionCoordinates.endPoint.y;

        let xd = this.circleSectionCoordinates.bowlContact.x;
        let yd = this.circleSectionCoordinates.bowlContact.y;

        let rc = this.circleSectionCoordinates.radius;
        let angle = this.circleSectionCoordinates.startAngle; 

        //calculate distances between (xm, ym)
        let distanceMD = utilities.getDistanceBetween2DPoints(xm, xd, ym, yd);
        let distanceND = utilities.getDistanceBetween2DPoints(xn, xd, yn, yd);

        let x = distanceMD >= distanceND ? xm : xn; 
        let y = distanceMD >= distanceND ? ym : yn; 

        //calculate xt and yt - which are points along the tangent
        let thetaT = -90 * (Math.PI / 180); //in radians
        let xt = x+(rc*Math.cos(thetaT+angle)); 
        let yt = y+(rc*Math.sin(thetaT+angle));

        this.circleSectionCoordinates.pointOnTangent = {
            x: xt,
            y: yt,
            thetaT
        };

        //draw line between (x, y) and (xt, yt)
        this.ctx.beginPath(); 
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(xt,yt);
        this.ctx.stroke(); 

        //draw white line inside
        let prevLineWidth = this.ctx.lineWidth; 
        let prevGlobalCompisiteOperation = this.ctx.globalCompositeOperation;

        this.ctx.globalCompositeOperation = 'destination-out'; 
        this.ctx.lineWidth = 8;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(xt,yt);
        this.ctx.stroke();

        this.ctx.lineWidth = prevLineWidth;
        this.ctx.globalCompositeOperation = prevGlobalCompisiteOperation;

        //TODO: calculate length of tangent

    }

    drawNCircleSection (sectionIndex = 0) {

        //drawing the second semicircle
        let xm = this.circleSectionCoordinates.startPoint.x;
        let ym = this.circleSectionCoordinates.startPoint.y;

        let xn = this.circleSectionCoordinates.endPoint.x;
        let yn = this.circleSectionCoordinates.endPoint.y;

        let xd = this.circleSectionCoordinates.bowlContact.x;
        let yd = this.circleSectionCoordinates.bowlContact.y;

        let rc = this.circleSectionCoordinates.radius;
        let angle = this.circleSectionCoordinates.startAngle; 

        let xt = this.circleSectionCoordinates.pointOnTangent.x;
        let yt = this.circleSectionCoordinates.pointOnTangent.y;
        let thetaT = this.circleSectionCoordinates.pointOnTangent.thetaT; 

        //calculate distances between (xm, ym)
        let distanceMD = utilities.getDistanceBetween2DPoints(xm, xd, ym, yd);
        let distanceND = utilities.getDistanceBetween2DPoints(xn, xd, yn, yd);

        //transform (xt, yt) coordinates secondCircleRadius away in a 90 degree direction
        let angleAdjustment = distanceMD >= distanceND ? 90 : -90; 
        let thetaC1 = angleAdjustment * (Math.PI / 180);

        let newStartAngle =  thetaT+angle+thetaC1 + (Math.PI/2);
        let newEndAngle = thetaT+angle+thetaC1 + (Math.PI/2)*2;

        if(distanceMD >= distanceND){
            //reverse the start angles
            newStartAngle =  thetaT+angle+thetaC1 + (Math.PI/2)*2;
            newEndAngle = thetaT+angle+thetaC1 + (Math.PI/2)*3;
        }

        let angleSum = thetaT + angle + thetaC1;
        let rc1 = utilities.generateRandomInteger(this.minRadius, 90); 
        let xc1 = xt+(rc1*Math.cos(thetaT + angle + thetaC1)); 
        let yc1 = yt+(rc1*Math.sin(thetaT + angle + thetaC1));

        console.log('xc1: ', xc1, ' yc1: ', yc1);
        this.ctx.beginPath();
        this.ctx.arc(xc1, yc1, rc1, newStartAngle, newEndAngle);
        this.ctx.stroke();

        let prevLineWidth = this.ctx.lineWidth; 
        let prevGlobalCompisiteOperation = this.ctx.globalCompositeOperation;

        this.ctx.globalCompositeOperation = 'destination-out'; 
        this.ctx.lineWidth = 8;
        this.ctx.beginPath();
        this.ctx.arc(xc1, yc1, rc1, newStartAngle, newEndAngle);
        this.ctx.stroke();

        this.ctx.lineWidth = prevLineWidth;
        this.ctx.globalCompositeOperation = prevGlobalCompisiteOperation;
        
        //calculate length
        let angleDiff = Math.abs(newEndAngle-newStartAngle); 
        let length = angleDiff*rc1;

        //store in this.additionalSections
        this.additionCircleSections.push({
            rc: rc1,
            xc: xc1,
            yc: yc1,
            startAngle: newStartAngle,
            endAngle: newEndAngle,
            thetaC: thetaC1,
            angleSum,
            length,
            genesis: true
        });
    }

    drawNextCircleSection(alternateRotation=false) {

        //drawing the second semicircle
        let index = this.additionCircleSections.length; //lengths don't start at 0 like arrays. 
        let prevSection = this.additionCircleSections[index-1]
        console.log('index: ', index, ' prevSection: ', prevSection);
        let {rc1, xc1, yc1, newStartAngle, newEndAngle, rotation, angleSum , startIncrement, thetaC1} = this.#getNextSectionParameters2(prevSection);

        //check if any point in the new semi-circle (i.e only for start and end angles) colides with boundary. 
        //If so - reverse the rotation. And check again. If still colides, don't draw

        console.log('xc1: ', xc1, ' yc1: ', yc1);
        this.ctx.beginPath();
        this.ctx.arc(xc1, yc1, rc1, newStartAngle, newEndAngle);
        this.ctx.stroke();

        let prevLineWidth = this.ctx.lineWidth; 
        let prevGlobalCompisiteOperation = this.ctx.globalCompositeOperation;

        this.ctx.globalCompositeOperation = 'destination-out'; 
        this.ctx.lineWidth = 8;
        this.ctx.beginPath();
        this.ctx.arc(xc1, yc1, rc1, newStartAngle, newEndAngle);
        this.ctx.stroke();

        this.ctx.lineWidth = prevLineWidth;
        this.ctx.globalCompositeOperation = prevGlobalCompisiteOperation; 

        //store in this.additionalSections
        //calculate length
        let angleDiff = Math.abs(newEndAngle-newStartAngle); 
        let length = angleDiff*rc1;
        angleSum = angleSum+rotation-(180* (Math.PI / 180)); 

        this.additionCircleSections.push({
            rc: rc1,
            xc: xc1,
            yc: yc1,
            startAngle: newStartAngle,
            endAngle: newEndAngle,
            thetaC: thetaC1,
            angleSum,
            rotation: rotation || 0,
            startIncrement ,
            length
        });

        //demo line
        // let prevStrokeStyle = this.ctx.strokeStyle; 
        // this.ctx.strokeStyle = distanceMD >= distanceND ?  'green' : 'blue'; //green for md, blue for nd
        // this.ctx.beginPath();
        // this.ctx.moveTo(xt,yt); 
        // this.ctx.lineTo(xc1, yc1); 
        // this.ctx.stroke(); 

        // console.log('last noodle index: ', index);
        // this.ctx.strokeStyle = index > 1 ? 'purple': 'white'
        // this.ctx.beginPath();
        // this.ctx.arc(xt, xt, 5, 0, 2 * Math.PI);
        // this.ctx.stroke(); 
        
        //this.ctx.strokeStyle = index == 1 ? 'green': 'white'
        // this.ctx.beginPath();
        // this.ctx.arc(xc1, yc1, 5, 0, 2 * Math.PI);
        // this.ctx.stroke(); 

        /* 
            NOTE TO SELF FOR NEXT SESSION:
            Basically, the reason the last section is in the incorrect location is because 
            it is being drawn at the wrong point in the previous circle.

            However, we could use this to our advantage if we make the startpoint and endpoint work
            This could help us achieve the overlapping noodle effect. This can be achieved by it being one
            continous noodle. Split into two. 

        */
        

        //this.ctx.strokeStyle = prevStrokeStyle; 
    }

    #getNextSectionParameters (prevSection, alternateRotation = false) {
        /*Calculates next parameters given the previous parameters */

        let xm = this.circleSectionCoordinates.startPoint.x;
        let ym = this.circleSectionCoordinates.startPoint.y;

        let xn = this.circleSectionCoordinates.endPoint.x;
        let yn = this.circleSectionCoordinates.endPoint.y;

        let xd = this.circleSectionCoordinates.bowlContact.x;
        let yd = this.circleSectionCoordinates.bowlContact.y;

        let rc = this.circleSectionCoordinates.radius;
        let angle = this.circleSectionCoordinates.startAngle; 

        let xt = this.circleSectionCoordinates.pointOnTangent.x;
        let yt = this.circleSectionCoordinates.pointOnTangent.y;
        let thetaT = this.circleSectionCoordinates.pointOnTangent.thetaT; 

        //calculate distances between (xm, ym) -- should be saved as constant so it only gets calculated once per noodle
        let distanceMD = utilities.getDistanceBetween2DPoints(xm, xd, ym, yd);
        let distanceND = utilities.getDistanceBetween2DPoints(xn, xd, yn, yd);
        let rotation = distanceMD >= distanceND ? -(Math.PI/2) : (Math.PI/2);
        
        let prevStartAngle = rotation; 
        let prevEndAngle = rotation; 
        let startIncrement = 0; 

        
            
        //xt is tangent along previous semicircle at 90 degrees or -90 degrees from start at 0
        prevStartAngle = prevSection.startAngle; 
        prevEndAngle = prevSection.endAngle
        let prevAngleDiff = prevEndAngle - prevStartAngle; 
        xt = prevSection.xc + (prevSection.rc*Math.cos(prevSection.angleSum+rotation));
        yt = prevSection.yc + (prevSection.rc*Math.sin(prevSection.angleSum+rotation)); 
        rc = prevSection.rc;
        startIncrement = prevSection.startIncrement || startIncrement; 
        
        thetaT = prevSection.angleSum; 

        

        

        //transform (xt, yt) coordinates secondCircleRadius away in a 90 degree direction
        let angleAdjustment = distanceMD >= distanceND ? 90 : -90; 
        let thetaC1 = 0;

        rotation = alternateRotation ? -rotation : rotation; //draw circle center outwards of prev circle if alternate rotation
        let angleSum = thetaT; 

        startIncrement = alternateRotation ? startIncrement - rotation : startIncrement; 

        let newStartAngle =  angleSum - (Math.PI/2) + startIncrement;
        let newEndAngle = angleSum + startIncrement;

        if(distanceMD >= distanceND){
            //reverse the start angles
            newStartAngle =  angleSum + startIncrement;
            newEndAngle = angleSum + (Math.PI/2) + startIncrement;
        }

        let rc1 = utilities.generateRandomInteger(this.minRadius, 90); 
        
        let xc1 = (xt)+(rc1*Math.cos(angleSum+rotation)); 
        let yc1 = (yt)+(rc1*Math.sin(angleSum+rotation));

        startIncrement = distanceMD >= distanceND ? (90* (Math.PI / 180)) : (-90* (Math.PI / 180))
        return {
            rc1,
            xc1,
            yc1,
            newStartAngle,
            newEndAngle,
            rotation,
            angleSum,
            startIncrement,
            thetaC1,
        };
    }

    #getNextSectionParameters2 (prevSection, alternateRotation = false) {
        /*Calculates next parameters given the previous parameters */


        let XC = this.circleSectionCoordinates.center.x; //bowl center x
        let YC = this.circleSectionCoordinates.center.y; //bowl center y

        let xm = this.circleSectionCoordinates.startPoint.x;
        let ym = this.circleSectionCoordinates.startPoint.y;

        let xn = this.circleSectionCoordinates.endPoint.x;
        let yn = this.circleSectionCoordinates.endPoint.y;

        let xd = this.circleSectionCoordinates.bowlContact.x;
        let yd = this.circleSectionCoordinates.bowlContact.y;

        let rc = this.circleSectionCoordinates.radius;
        let angle = this.circleSectionCoordinates.startAngle; 

        let xt = this.circleSectionCoordinates.pointOnTangent.x;
        let yt = this.circleSectionCoordinates.pointOnTangent.y;
        let thetaT = this.circleSectionCoordinates.pointOnTangent.thetaT; 

        //calculate distances between (xm, ym) -- should be saved as constant so it only gets calculated once per noodle
        let distanceMD = utilities.getDistanceBetween2DPoints(xm, xd, ym, yd);
        let distanceND = utilities.getDistanceBetween2DPoints(xn, xd, yn, yd);
        let rotation = distanceMD >= distanceND ? -(Math.PI/2) : (Math.PI/2); //so its at a tangent to the center of the previous circle

        // if(!prevSection.genesis){

        //     rotation = distanceMD >= distanceND ? -45*(Math.PI/180) : 45*(Math.PI/180);

        // }
    
        let startIncrement = 0; 
        let angleSum = prevSection.angleSum + prevSection.endAngle; 
        
            
        //xt is tangent along previous semicircle at 90 degrees or -90 degrees from start at 0
        let prevStartAngle = prevSection.startAngle; 
        let prevEndAngle = prevSection.endAngle
        let prevAngleDiff = prevEndAngle - prevStartAngle; 
        xt = prevSection.xc + (prevSection.rc*Math.cos(prevSection.angleSum+rotation));
        yt = prevSection.yc + (prevSection.rc*Math.sin(prevSection.angleSum+rotation)); 
        rc = prevSection.rc;
        startIncrement = prevSection.startIncrement || startIncrement; 

        //transform (xt, yt) coordinates secondCircleRadius away in a 90 degree direction
        let thetaC1 = 0;

        //rotation = alternateRotation ? -rotation : rotation; //draw circle center outwards of prev circle if alternate rotation
        

        startIncrement = alternateRotation ? startIncrement - rotation : startIncrement; 

        let newStartAngle = 0 //angleSum - (Math.PI/2) + startIncrement;
        let newEndAngle = 2*Math.PI//angleSum + startIncrement;

        let startAdjustment = distanceMD >= distanceND ? -(Math.PI/2) : (Math.PI);
        let endAdjustment = distanceMD >= distanceND ? (Math.PI) : -(Math.PI);

        if(!prevSection.genesis){
            startAdjustment = distanceMD >= distanceND ? -(Math.PI/2)+(Math.PI) : (Math.PI);
            endAdjustment = distanceMD >= distanceND ? (Math.PI) : -(Math.PI);
        }

        //TODO: 20/12/2022 CURRENT FOCUS HERE
        newStartAngle = prevSection.angleSum+rotation+startAdjustment;
        newEndAngle = distanceMD >= distanceND ? prevSection.angleSum+rotation-(Math.PI) : prevSection.angleSum+rotation;

        // if(distanceMD >= distanceND){
        //     //reverse the start angles
        //     newStartAngle =  angleSum + startIncrement;
        //     newEndAngle = angleSum + (Math.PI/2) + startIncrement;
        // }

        let angleAdjustment = alternateRotation ? 90 : 90; 
        let rc1 = utilities.generateRandomInteger(this.minRadius, 90); 
        if(!prevSection.genesis){
            angleAdjustment = distanceMD >= distanceND ? angleAdjustment : -angleAdjustment; 
            angleSum = prevSection.angleSum+angleAdjustment*(Math.PI/180); 
        }else{
            angleSum = prevSection.angleSum -90*(Math.PI/180); //for first circle 
        }
        
        let xc1 = (xt)+(rc1*Math.cos(angleSum)); 
        let yc1 = (yt)+(rc1*Math.sin(angleSum));

        startIncrement = distanceMD >= distanceND ? (90* (Math.PI / 180)) : (-90* (Math.PI / 180))

        // let prevStrokeStyle = this.ctx.strokeStyle; 
        this.ctx.strokeStyle = distanceMD >= distanceND ?  'green' : 'blue'; //green for md, blue for nd
        this.ctx.beginPath();
        this.ctx.moveTo(xt,yt); 
        this.ctx.lineTo(xc1, yc1); 
        this.ctx.stroke(); 

        //for caculating if new yc1 and yc2 are out of bounds
        // let boundaryX = XC + rc*Math.cos(angleSum);
        // let boundaryY = YC + rc*Math.sin(angleSum);

        // this.ctx.strokeStyle = 'red'; //green for md, blue for nd
        // this.ctx.beginPath();
        // this.ctx.moveTo(boundaryX,boundaryY); 
        // this.ctx.lineTo(xc1, yc1); 
        // this.ctx.stroke();
        

        return {
            rc1,
            xc1,
            yc1,
            newStartAngle,
            newEndAngle,
            rotation,
            angleSum,
            startIncrement,
            thetaC1
        };

        
    }
}

let utilities = {
    generateRandomInteger: (min=0, max=100) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getDistanceBetween2DPoints: (x1=0,x2=0,y1=0,y2=0) => {

        let distance = Math.sqrt((Math.abs(x1-x2)**2)+(Math.abs(y1-y2)**2));
        return distance;
    }
    
    
}
