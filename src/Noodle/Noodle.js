import { utilities } from "../utils/utils";

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
        this.minRadius = Number(minRadius); 
        this.boundaryCircle = boundaryCircle;
    }

    draw () {

        this.ctx.strokeStyle = 'black';

        //draws all sections at once
        this.drawInitialSection();
        this.drawNCircleSection();

        let proceed = true;
        let count = 0;
        let limit = 6; 
        while(proceed && count < limit){

            let flip = false; 

            if(count === limit-1){
                flip = true; 
            }

            proceed = this.drawNextCircleSection(flip);
            count++; 

        }

    }

    drawInitialSection () {
        //noodles will be drawn using a combination of bezier curves
        this.#drawCircleSection();
        this.#drawCircleTangent(); 
    }

    #drawCircleSection () {
        /*draw circle within edges of boundary 
            - generate radius r thats between 0 and maximum bend radius - for now, we'll just use 50
            - set x and y to be boundaryCircle.x - r  and boundaryCircle.y - r
            - come up with formula so x and y can be at only angle of the circle
        */

        let r = utilities.generateRandomInteger(this.minRadius, this.minRadius+50); 
        this.ctx.lineWidth = this.width; 

        let distance = this.boundaryCircle.radius - r - (this.ctx.lineWidth/2); 
        let angle = utilities.generateRandomInteger(0,360); //to be randomly generated - TODO: strategically randomly generate for each 20degrees in a 360 circle so whole bowl is covered
        //convert angle to radians
        angle = angle * (Math.PI / 180);

        //calculated drift in radians
        let drift = utilities.generateRandomInteger(-90,90) * (Math.PI/180); //randomly generated value
        let driftedAngle = angle + drift; 
        let startAngle = driftedAngle - (Math.PI/2); 
        let endAngle = driftedAngle + (Math.PI/2); 

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
        this.ctx.lineWidth = this.width - 2;
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

        let distanceMD = utilities.getDistanceBetween2DPoints(startPoint.x, xd, startPoint.y, yd);
        let distanceND = utilities.getDistanceBetween2DPoints(endPoint.x, xd, endPoint.y, yd);

        this.circleSectionCoordinates = {
            startPoint,
            endPoint,
            center,
            radius: r,
            angle,
            startAngle,
            bowlContact,
            length,
            distanceMD,
            distanceND
        }; 
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
        this.ctx.lineWidth = this.width - 2;
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
        let rc1 = utilities.generateRandomInteger(this.minRadius, this.minRadius+50); 
        let xc1 = xt+(rc1*Math.cos(thetaT + angle + thetaC1)); 
        let yc1 = yt+(rc1*Math.sin(thetaT + angle + thetaC1));

        this.ctx.beginPath();
        this.ctx.arc(xc1, yc1, rc1, newStartAngle, newEndAngle);
        this.ctx.stroke();

        let prevLineWidth = this.ctx.lineWidth; 
        let prevGlobalCompisiteOperation = this.ctx.globalCompositeOperation;

        this.ctx.globalCompositeOperation = 'destination-out'; 
        this.ctx.lineWidth = this.width - 2;
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
        let {
            rc1, 
            xc1, 
            yc1, 
            newStartAngle, 
            newEndAngle, 
            rotation, 
            angleSum , 
            startIncrement, 
            thetaC1,
            withinBounds
        } = this.#getNextSectionParameters(prevSection, alternateRotation);

        if(!withinBounds){
            //end noodle
            //get point at end tangent

            // if(!prevSection.genesis){
            //     this.#finish(prevSection);
            // }else {

            // }
             
            return false;
        }

        //check if any point in the new semi-circle (i.e only for start and end angles) colides with boundary. 
        //If so - reverse the rotation. And check again. If still colides, don't draw
        let counterClockwise = false; 

        this.ctx.beginPath();
        this.ctx.arc(xc1, yc1, rc1, newStartAngle, newEndAngle, counterClockwise);
        this.ctx.stroke();

        let prevLineWidth = this.ctx.lineWidth; 
        let prevGlobalCompisiteOperation = this.ctx.globalCompositeOperation;

        this.ctx.globalCompositeOperation = 'destination-out'; 
        this.ctx.lineWidth = this.width - 2;
        this.ctx.beginPath();
        this.ctx.arc(xc1, yc1, rc1, newStartAngle, newEndAngle, counterClockwise);
        this.ctx.stroke();

        this.ctx.lineWidth = prevLineWidth;
        this.ctx.globalCompositeOperation = prevGlobalCompisiteOperation; 

        //store in this.additionalSections
        //calculate length
        let angleDiff = Math.abs(newEndAngle-newStartAngle); 
        let length = angleDiff*rc1;
        angleSum = angleSum+rotation-(180* (Math.PI / 180)); 

        if(prevSection.alternateRotation && !alternateRotation){
            alternateRotation = prevSection.alternateRotation
        } 

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
            length,
            alternateRotation
        });

        return true;

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
        let xt = this.circleSectionCoordinates.pointOnTangent.x;
        let yt = this.circleSectionCoordinates.pointOnTangent.y;

        //calculate distances between (xm, ym) -- should be saved as constant so it only gets calculated once per noodle
        let distanceMD = this.circleSectionCoordinates.distanceMD;
        let distanceND = this.circleSectionCoordinates.distanceND;
        let mdFlip = distanceMD >= distanceND; 

        let rotationFlip = distanceMD >= distanceND; 
        let rotation = rotationFlip ? -(Math.PI/2) : (Math.PI/2); //so its at a tangent to the center of the previous circle
    
        let startIncrement = 0; 
        let angleSum = prevSection.angleSum + prevSection.endAngle; 
        
        //xt is tangent along previous semicircle at 90 degrees or -90 degrees from start at 0
        xt = prevSection.xc + (prevSection.rc*Math.cos(prevSection.angleSum+rotation));
        yt = prevSection.yc + (prevSection.rc*Math.sin(prevSection.angleSum+rotation)); 
        startIncrement = prevSection.startIncrement || startIncrement; 

        //transform (xt, yt) coordinates secondCircleRadius away in a 90 degree direction
        let thetaC1 = 0;

        startIncrement = alternateRotation ? startIncrement - rotation : startIncrement; 

        let newStartAngle = 0 //angleSum - (Math.PI/2) + startIncrement;
        let newEndAngle = 2*Math.PI//angleSum + startIncrement;

        let startAdjustment = mdFlip ? 0 : (Math.PI);
        let endAdjustment = mdFlip ? (Math.PI) : -(Math.PI);

        if(!prevSection.genesis){

            let mdStartAdjustment = this.additionCircleSections.length % 2 === 0 ? (Math.PI) : 0;
            let mdEndAjustment = this.additionCircleSections.length % 2 === 0 ? 0 : (Math.PI); 

            // let localFlip = prevSection.alternateRotation ? !mdFlip : mdFlip; 
            startAdjustment = mdFlip ? mdStartAdjustment : (Math.PI);
            endAdjustment = mdFlip ? mdEndAjustment : -(Math.PI);

        }
        newStartAngle = prevSection.angleSum+rotation+startAdjustment;
        newEndAngle = mdFlip ? prevSection.angleSum+rotation+endAdjustment : prevSection.angleSum+rotation;

        if(prevSection.alternateRotation){

            newEndAngle = !mdFlip ? prevSection.angleSum+rotation+endAdjustment : prevSection.angleSum+rotation;
           
        }

        let angleAdjustment = 90; 
        let rc1 = utilities.generateRandomInteger(this.minRadius, this.minRadius+50); //calculate so that perimeter is within length limit
        if(!prevSection.genesis){
            angleAdjustment = alternateRotation? 90 : -90;

            angleSum = prevSection.angleSum+angleAdjustment*(Math.PI/180); 
        }else{
            angleSum = prevSection.angleSum -90*(Math.PI/180); //for first circle 
        }
        
        let xc1 = (xt)+(rc1*Math.cos(angleSum)); 
        let yc1 = (yt)+(rc1*Math.sin(angleSum));

        startIncrement = mdFlip ? (90* (Math.PI / 180)) : (-90* (Math.PI / 180))

        let withinBounds = this.#checkBoundary({xc:xc1, yc:yc1, rc: rc1});

        return {
            rc1,
            xc1,
            yc1,
            xt,
            yt,
            newStartAngle,
            newEndAngle,
            rotation,
            angleSum,
            startIncrement,
            thetaC1,
            withinBounds
        };

        
    }

    #checkBoundary ({xc, yc, rc}) {

        /*
            This is the function responsible for the performance hit,
            as it effectively iterates 18 points for each noodle. 

            This would be the first stop at optimisation
        */

        let widthinBounds = true;
        let tolerance = rc+30; 
        let coords = this.boundaryCircle.boundaryCoordinates;

        for(let i = 0, length = coords.length; i< length; i++){

            let distance = utilities.getDistanceBetween2DPoints(coords[i].x, xc,coords[i].y, yc);
            if(distance < tolerance){
                widthinBounds = false; 

                break;
            }
        }

        return widthinBounds; 

    }
}

export default Noodle; 