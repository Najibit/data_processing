d3.select("head").append("title").text("Crime in The Netherlands");
d3.select("body").append("h4").text("Name: Najib el Moussaoui")
d3.select("body").append("h4").text("Student number: 10819967")
d3.select("body").append("h5").text("Visualizing crimes per category in The Netherlands in 2017.");

var dataSet;

d3.json("/data.json", function(data) {
  var svg = d3.select("body").append("svg")
              .attr("class", "svg");

  // Width and height
    var w = 1000;
    var h = 500;
    var barPadding = 50;
    var graphPadding = 200;

  svg.attr("width", w).attr("height", h + graphPadding).attr("style", "padding:10px;");

  dataArray = [];

  data = d3.entries(data)["0"].value;
  // console.log(data[0]["Totaal geregistreerde misdrijven (2015)"]);
  d3.select("body").selectAll("p")
    .data(data)
    .enter()
    .append("p")
    .text(function(d) { dataArray.push(d3.values(d).slice(0, 3)); return d3.values(d).slice(0, 3); });

  crimesArray = [];
  subjectArray = [];
  let min = 9999999; // arbitraty value
  let max = -9999999; // arbitraty value

    // only big numbers are relevant for this chart
  for (let i = 0; i < dataArray.length; i++) {
    if (dataArray[i][1] > 10000) {
      crimesArray.push(parseInt(dataArray[i][1]));
    }
  }

  for (let i = 0; i < data.length; i++) {
    subjectArray.push(data[i]['categorie']);
  }

  // subjectArray.pop(subjectArray[5]);


  for (let i = 0; i < crimesArray.length; i++) {
      if (crimesArray[i] > max) {
        max = crimesArray[i];
      }
    }

  for (let i = 0; i < crimesArray.length; i++) {
      if (crimesArray[i] < min) {
        min = crimesArray[i];
      }
    }


    console.log(data, min, max)

  // crimesArray.sort();

  svg.selectAll("rect")
     .data(crimesArray)
     .enter()
     .append("rect")
     .attr("class", "bars")
     .attr("height", 0)
     .attr("y", h)
     .transition().duration(3000)
     .delay(function (d, i) { return i * 200;})
     .attr("x", function(d, i) {
      return (40 + i * (w / dataArray.length - 20)) + barPadding;
     })
     .attr("y", function(d) {
        return (h - (d / 10000) * 9);
     })
     .attr("width", w / dataArray.length - barPadding)
     .attr("height", function(d) {
        return (d / 10000) * 9;})


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
        tooltip.select("text").text(`${crimesArray[i]}x`);
      })

  let tooltip = svg.append("g")
                    .attr("class", "tooltip")
                    .style("display", "none")
                    .style("font-weight", "bold")
                    .style("font-family", "Georgia")
                    .style("font-size", "30px")
                    .style("color", "red")

      tooltip.append("text")
              .attr("x", 15)
              .attr("dy", "1.2em")

    subjectArray.splice(5, 1)

    let xScale = d3.scale.linear()
                         .range([50, 800])
                         .domain([1, 4])


    let yScale = d3.scale.linear()
                  .domain([max + 50000, min])
                  .range([0, h]);

    let yAxis = d3.svg.axis()
                      .scale(yScale)
                      .orient("left")
                      .ticks(10);

    let xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient("bottom")
                  .tickFormat((d,i) => subjectArray[i])



                  // .ticks(5);  //Set rough # of ticks

    let leftPadding = 50;

    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + leftPadding + ",0)")
      .call(yAxis);


    svg.selectAll('text')
      .data(subjectArray)
      .enter()
      .append('text')
      .text(function(d, i) { return d;})


    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + h + ")")
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-90)")
      .attr("dy", "7em")
      .attr("dx", "-1em")
      .style("text-anchor", "end")




});
