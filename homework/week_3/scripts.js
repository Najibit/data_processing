/*******************************************************************************
Name:         Najib el Moussaoui;
Student ID:   10819967;
Course:       Data Processing;
Date:         28-04-2018;

Description:  All the necessary JavaScript code to make a bar chart, using the
              JavaScript D3.js library. The data visualised is that of the count
              of crimes per catagory in The Netherlands in 2017.;
*******************************************************************************/

d3.select("head").append("title").text("Crime in The Netherlands").attr("class", "info");
d3.select("body").append("h4").text("Name: Najib el Moussaoui").attr("class", "info");
d3.select("body").append("h4").text("Student number: 10819967").attr("class", "info");
d3.select("body").append("h5").text("Visualizing crimes per category in The Netherlands in 2017. Hover over a bar to see the total count of crimes.").attr("class", "info");

// extract JSON from data.json file
d3.json("/data.json", function(data) {

    // add svg element to the DOM
    const svg = d3.select("body").append("svg")
                .attr("class", "svg");

    // Width and height, and some important padding to use
    const w = 1000;
    const h = 500;
    const barPadding = 50;
    const graphPadding = 200;

    // apply above dimensions to the svg
    svg.attr("width", w).attr("height", h + graphPadding).attr("style", "padding:10px;");

    // initialise empty array to store some data in for later use
    dataArray = [];


    data = d3.entries(data)["0"].value;
    d3.select("body").selectAll("p")
      .data(data)
      .enter()
      .append("p")
      .text(function(d) { dataArray.push(d3.values(d).slice(0, 3));});

    // some arrays to store some data in
    crimesArray = [];
    subjectArray = [];

    // variables to store max and min value of array
    let min = 9999999; // arbitraty value
    let max = -9999999; // arbitraty value

      // only big numbers (> 10.000) are relevant for this chart
    for (let i = 0; i < dataArray.length; i++) {
      if (dataArray[i][1] > 10000) {
        crimesArray.push(parseInt(dataArray[i][1]));
      }
    }

    // and extract all catagories
    for (let i = 0; i < data.length; i++) {
      subjectArray.push(data[i]['categorie']);
    }

    // find max value in array
    for (let i = 0; i < crimesArray.length; i++) {
        if (crimesArray[i] > max) {
          max = crimesArray[i];
        }
      }

    // find min value in array
    for (let i = 0; i < crimesArray.length; i++) {
        if (crimesArray[i] < min) {
          min = crimesArray[i];
        }
      }

    // add all bars to the chart
    svg.selectAll("rect")
       .data(crimesArray)
       .enter()
       .append("rect")
       .attr("class", "bars")
       .attr("height", 0)
       .attr("y", h)
       .transition().duration(4000) // make the bars rise at page visit
       .delay(function (d, i) { return i * 200;})
       .attr("x", function(d, i) {
        return (40 + i * (w / dataArray.length - 20)) + barPadding;
       })
       .attr("y", function(d) {
          return (h - (d / 10000) * 9);
       })
       .attr("width", w / dataArray.length - barPadding)
       .attr("height", function(d) {
          return (d / 10000) * 9;});

  // implement interactivity by displaying count of crimes on hover-over
  svg.selectAll("rect")
      .data(crimesArray)
      .on("mouseover", function() {
        tooltip.style("display", null);
      })
      .on("mouseout", function() {
        tooltip.style("display", "none");
      })
      .on("mousemove", function(d, i) {
        let xPos =    d3.mouse(this)[0] - 15;
        let yPos =    d3.mouse(this)[1] - 55;
        tooltip.attr("transform", "translate(" + xPos +  "," + yPos + ")");
        tooltip.select("text").text(`${crimesArray[i]} x`);
      })

    // make a tooltip to show the exact amount of crimes
    let tooltip = svg.append("g")
                      .attr("class", "tooltip")
                      .style("display", "none")
                      .style("font-weight", "bold")
                      // .style("font-family", "Georgia")
                      .style("font-size", "30px")
                      .style("color", "red");

      tooltip.append("text")
              .attr("x", 15)
              .attr("dy", "1.2em");

    subjectArray.splice(5, 1); // remove an unneeded value


    // make some scales for the chart
    let xScale = d3.scale.linear()
                         .range([50, 800])
                         .domain([1, 4]);


    let yScale = d3.scale.linear()
                  .domain([max + 50000, min])
                  .range([0, h]);

    // and draw the x- and y-axis
    let xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient("bottom")
                  .tickFormat((d,i) => subjectArray[i]);

    let yAxis = d3.svg.axis()
                      .scale(yScale)
                      .orient("left")
                      .ticks(10);

    // initisalise some padding to use
    let leftPadding = 50;

    // append y-axis
    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + leftPadding + ",0)")
      .call(yAxis);

    // add texts on axis
    svg.selectAll('text')
      .data(subjectArray)
      .enter()
      .append('text')
      .text(function(d, i) { return d;});

    // add x-axis, including texts
    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + h + ")")
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-90)")
      .attr("dy", "7em")
      .attr("dx", "-1em")
      .style("text-anchor", "end");
});
