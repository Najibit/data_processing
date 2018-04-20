
// let's get our data
// let data = document.getElementById("rawdata").innerHTML; // pull data from html
// data = data.split('\n') // and split it by the line

var xhr = new XMLHttpRequest();

// when it's ready, run code block
xhr.onreadystatechange = function() {
  // check if everything goes well
  if (this.readyState == 4) {
   if (this.status == 200) {
    if (this.responseText != null) { // check if response is not null

        let data = this.responseText; // extract data
        data = data.split('\n') // and split it by the line

        // now let's format our data!
        for (let i = 0; i < data.length; i++) {
          data[i] = data[i].replace(/\s+/g, ''); // mmmbye spaces
          data[i] = data[i].split(','); // split dates from temperatures

          // extract date info to throw in the Date() function
          let year = data[i][0].slice(0, 4);
          let month = data[i][0].slice(4, 6) - 1; // -1 because the first month = 00
          let day = data[i][0].slice(6,8);
          data[i][0] = new Date(year, month, day); // throw it all in the function
          data[i][0] = data[i][0].toString(); // ...and turn it in to a string

          // turn those temperatures in actual Dutch temperatures
          data[i][1] = parseFloat(data[i][1]) / 10;
        }

        // we got the data, now we need a canvas to draw on
        let canvas = document.getElementById('myCanvas');
        let ctx = canvas.getContext('2d');

        // let's set the (0, 0) coordinates of the graph
        let x = 100;
        let y = 500;
        let xLength = 600;
        let yLength = 400;

        // months to write along the x-axis
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // draw an x- and a y-axis
        ctx.beginPath();
        ctx.moveTo(x , y);
        ctx.lineTo(x + xLength, y);
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - yLength);
        ctx.stroke();

        // some important info to keep track of
        let tempRangeY = 300;  // the range on which temperatures will be plotted
        let tempRangeDegrees = 50; // total range in degrees celcius
        let tempDistanceY = 30; // the distances in Y between every 5 degrees celcius
        let tempDistanceDegrees = 5; // same distance, but then in degrees
        let maxTempY = 35; // highest degree point on the graph

        // Let's find the hottest and coldest day of the year!

        // arbitrary (temporary) values
        let minTemp = 999;
        let maxTemp = -999;

        // compare all days and store the warmest and coldest day in variables
        let coldestDay;
        let hottestDay;

        for (let i = 0; i < data.length; i++) {
          if (data[i][1] > maxTemp) {
            maxTemp = data[i][1]; // hell of a hot day
            hottestDay = i; // what was the day of the year?
          }
          if (data[i][1] < minTemp) {
            minTemp = data[i][1]; // brrrr
            coldestDay = i; // what day of the year?
          }
        }

        // y-axis info
        for (let i = 0; i < (tempRangeY / tempDistanceY); i++) {
          ctx.beginPath();
          ctx.moveTo(100, (150 + (i * tempDistanceY)));
          ctx.lineTo(110, (150 + (i * tempDistanceY)));
          ctx.textAlign = "center";
          ctx.fillText((maxTempY - (i * tempDistanceDegrees)) + '°', 80, (155 + (i * tempDistanceY))); // make the degrees texts on the y-axis
          ctx.closePath();
          ctx.stroke();
        }


        // function to get a Y coordinate, input is the temperature
        function getYCoordinates(yTemp) {
          yTemp += 15;
          yTemp = yTemp * 100 / tempRangeDegrees;
          yTemp = (yTemp / 100) * tempRangeY;
          yTemp = 450 - yTemp;
          return yTemp;
        }
        // function to get an X coordinate, input is the day
        function getXCoordinates(xDay) {
          let startingDistanceX = 50;
          xDay = x + (xDay * (y / data.length));
          return xDay + startingDistanceX;
        }

        // plotting the actual graph!

        // begin path starting position, slightly right
        ctx.beginPath();
        ctx.moveTo(getXCoordinates(0) , getYCoordinates(data[0][1]));

        // draw the path
        for (let i = 0; i < data.length; i++){
          ctx.lineTo(getXCoordinates(i) , getYCoordinates(data[i][1]));
        }

        // and draw that line!
        ctx.stroke();


        // draw month lines on x-axis

        // some important info to keep track of
        let monthindex = 0;
        let monthXCoordinates = [];
        let tempYCoordinates = [];

        // drawing those little stripes for every month
        ctx.beginPath();

        for (let i = 0; i < data.length; i++) {
          if (data[i][0].slice(8,10) == 01) {
            let x = getXCoordinates(i) ;
            ctx.moveTo(x, y);
            ctx.lineTo(x, y - 10);
            monthindex++;
            monthXCoordinates.push(x);
            tempYCoordinates.push(getYCoordinates(data[i][1]));
          }
        }
        ctx.stroke();

        // draw a last line for december
        ctx.beginPath();
        ctx.moveTo(getXCoordinates(data.length - 1) , y);
        ctx.lineTo(getXCoordinates(data.length - 1) , y - 10);
        ctx.stroke();


        // writing month texts on x-axis
        for (let i = 0; i < months.length; i++) {
          let x = monthXCoordinates[i];
          moveTo(x, y);
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(-Math.PI/2);
          ctx.font = '12px arial';
          ctx.fillText(months[i], x - 180 - (i * 42), y - 475);
          ctx.restore();
        }

        // increasing readability by adding first-day-of-the-month points to the graph
        for (let i = 0; i < monthXCoordinates.length; i++) {
          ctx.beginPath();
          ctx.arc(monthXCoordinates[i], tempYCoordinates[i], 3,0,2*Math.PI);
          ctx.fillStyle = 'gray';
          ctx.fill();
          ctx.stroke();
        }

        // draw a point on the graph for the hottest day of the year
        ctx.beginPath();
        ctx.arc(getXCoordinates(hottestDay) , getYCoordinates(maxTemp), 4, 0,2*Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.stroke();

        // draw a point on the graph for the coldest day of the year
        ctx.beginPath();
        ctx.arc(getXCoordinates(coldestDay), getYCoordinates(minTemp), 4, 0,2*Math.PI);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.stroke();

        // make a info-legend for the dots on the graph
        ctx.beginPath();
        ctx.fillStyle = 'gray'
        ctx.arc(20, 20, 5,0,2*Math.PI);
        ctx.fill();
        ctx.font = '12px arial';
        ctx.fillText("First day of the month", 100, 25);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = 'red'
        ctx.arc(20, 40, 5,0,2*Math.PI);
        ctx.fill();
        ctx.font = '12px arial';
        ctx.fillText("Hottest day of the year", 100, 45);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = 'blue'
        ctx.arc(20, 60, 5,0,2*Math.PI);
        ctx.fill();
        // ctx.textAlign = "center";
        ctx.font = '12px arial';
        ctx.fillText("Coldest day of the year", 100, 65);
        ctx.stroke();

        // write info along the axes
        ctx.fillStyle = 'gray';
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-Math.PI/2);
        ctx.textAlign = "center";
        ctx.font = '12px arial';
        ctx.fillText("Temperatures in degrees Celcius", 200, -50);
        ctx.restore();

        ctx.font = '12px arial';
        ctx.fillText("Months of the year (2017)", 400, 575);
      }
    }
  }
}

// send that request
xhr.open("GET", "knmi_data.csv", true);
xhr.send();
