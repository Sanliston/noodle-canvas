export let utilities = {
    generateRandomInteger: (min=0, max=100) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getDistanceBetween2DPoints: (x1=0,x2=0,y1=0,y2=0) => {

        let distance = Math.sqrt((Math.abs(x1-x2)**2)+(Math.abs(y1-y2)**2));
        return distance;
    }
}