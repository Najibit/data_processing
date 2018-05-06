/******************************************************************************
* Star Wars Scatterplot
*
* By: Najib el Moussaoui
* Course: Data Processing
* Date: May the 4th (be with you)
*
* Gives an overview of a select amount of planets in the Star Wars universe, by
* orbital period, rotation period, planet radius and primary climate.
*
* Source: The Star Wars API (www.swapi.co)
******************************************************************************/

window.onload = function() {

  // arrays to store data in
  const starsXandY = [];
  const planets = [];
  const spheres = [];
  const climates = [];
  const climateColors = [];
  const planetData = [];


  // API links to call
  const planetAmount = 7;
  const planetLink1 = "https://swapi.co/api/planets/";
  const planetLink2 = "https://swapi.co/api/planets/?page=2";
  const planetLink3 = "https://swapi.co/api/planets/?page=3";
  const planetLink4 = "https://swapi.co/api/planets/?page=4";
  const planetLink5 = "https://swapi.co/api/planets/?page=5";
  const planetLink6 = "https://swapi.co/api/planets/?page=6";
  const planetLink7 = "https://swapi.co/api/planets/?page=7";

  // d3 API call
  d3.queue()
    .defer(d3.request, planetLink1)
    .defer(d3.request, planetLink2)
    .defer(d3.request, planetLink3)
    .defer(d3.request, planetLink4)
    .defer(d3.request, planetLink5)
    .defer(d3.request, planetLink6)
    .defer(d3.request, planetLink7)
    .awaitAll(theForce);

    // function to launch when API calls are done
    function theForce(error, response) {
      if (error) throw error;

      // parse API response
      for (let i = 0; i < planetAmount; i++) {
        let goo = JSON.parse(response[i].responseText);
        planetData.push(goo.results);
      }

      // filter out all unusable planets
      for (let i = 0; i < planetAmount; i++) {
        planetData[i].forEach(function (planet) {
          if (planet.name != "unknown"
              && planet.name != "Bestine IV"
              && planet.rotation_period != "unknown"
              && planet.rotation_period != "0"
              && planet.orbital_period != "unknown"
              && planet.orbital_period != "0"
              && planet.diameter != "unknown"
              && planet.diameter != "0") {
                planets.push(planet);
          }
        })
      }


      // restructuring data so it's usable
      for (let i = 0; i < planets.length; i++) {
        let C3PO = [];
        if (planets[i].orbital_period < 700
            && planets[i].rotation_period < 40) {
        C3PO.push(parseInt(planets[i].orbital_period));
        C3PO.push(parseInt(planets[i].rotation_period));
        C3PO.push(parseInt(planets[i].diameter));
        C3PO.push(planets[i].climate.split(', '));
        C3PO.push(planets[i].name)
        spheres.push(C3PO);
        }
      }


      // start with drawing svg
      let svg = d3.select("body").append("svg")

      // append a black background for spacy feel
      svg.append("rect")
          .attr("width", "100%")
          .attr("height", "100%")
          .attr("fill", "black");

      // dimensions to use
      const width = 1200;
      const height = 500;
      const margin = {top: 20, right: 20, bottom: 30, left: 40};


      // stars info
      for (let i = 0; i < 500; i++) {
        let xy = [];
        xy.push(20 + Math.random() * (width - 200));
        xy.push(Math.random() * height);
        starsXandY.push(xy);
      }


      // set colors for the different climates
      climateColors.push('#bb9613', '#87CEFA', '#D8BFD8', '#FFE4a6', '#2F4F4F', '#FF550d', '#31a354', '#FFF', '#9ecaff', '#6B8E23', '#e60d00', '#3182bd');
      climates.push('temperate', 'frozen', 'murky', 'arid', 'windy', 'hot', 'tropical', 'frigid', 'humid', 'polluted', 'superheated', 'artic');

      // and function to call when assigning color
      function getColor(climate) {
        if (climate.includes(climates[0])) {
            return climateColors[0];
        } else if (climate.includes(climates[1])) {
          return climateColors[1];
        } else if (climate.includes(climates[2])) {
          return climateColors[2];
        } else if (climate.includes(climates[3])) {
          return climateColors[3];
        } else if (climate.includes(climates[4])) {
          return climateColors[4];
        } else if (climate.includes(climates[5])) {
          return climateColors[5];
        } else if (climate.includes(climates[6])) {
          return climateColors[6];
        } else if (climate.includes(climates[7])) {
          return climateColors[7];
        } else if (climate.includes(climates[8])) {
          return climateColors[8];
        } else if (climate.includes(climates[9])) {
          return climateColors[9];
        } else if (climate.includes(climates[10])) {
          return climateColors[10];
        } else if (climate.includes(climates[11])) {
          return climateColors[11];
        }
      }


      // scales
      const xScale = d3.scaleLinear()
                          .domain([
                            100,
                            d3.max(spheres, d => d[0] + 100)
                          ])
                          .range([0, width - 200]);
      const yScale = d3.scaleLinear()
                          .domain([
                            d3.min(spheres, d => d[1] - 12),
                            d3.max(spheres, d => d[1] + 10)
                          ])
                          .range([height, 0]);

      // set some attributes to svg
      svg.attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("class", "svg")
            .attr("transform", "translate(0, 50)")

      // draw all planets
      svg.selectAll("circle")
          .data(spheres)
          .enter()
          .append("circle")
          .attr('cx', width / 2)
          .attr('cy', height / 2)
          .attr('r', 3)
          .attr("fill", "black")
          .transition().duration(4000) // make planets appear at page visit
          .delay(function (d, i) { return i * 100;})
          .attr('cx', d => xScale(d[0]) + margin.left)
          .attr('cy', d => yScale(d[1]))
          .attr('r', d => (5 + (d[2] * 20) / 19720))
          .attr("fill", d => getColor(d[3]))
          .style('stroke', 'black')
          .style('stroke-width', '1px')
          .attr('class', 'planet')
          .attr('id', (d, i) => d[3][0])


      // make a tooltip for when hovering over planets
      svg.selectAll("circle")
          .data(spheres)
          .on("mouseover", function() {
            tooltip.style("display", null);
            d3.select(this).attr("r", 50)
          })
          .on("mouseout", function() {
            let self = this;
            tooltip.style("display", "none");
            d3.selectAll(".planet")
                        .style("opacity", 1)
            d3.select(this).attr("r", d => (5 + (d[2] * 20) / 19720))

          })
          .on("mousemove", function(d, i) {
            var self = this;
            let xPos =    d3.mouse(this)[0] - 15;
            let yPos =    d3.mouse(this)[1] - 55;
            tooltip.attr("transform", "translate(" + xPos +  "," + yPos + ")");
            d3.select(this).attr("r", 45)
            tooltip.select("text").text(`[${d[4]}]`)
            d3.selectAll(".planet")
            .filter(function(x) {return self != this; })
            .style("opacity", .2) // make all planets not selected harder to see
          })

            let tooltip = svg.append("g")
                              .attr("class", "tooltip")
                              .style("display", "none")
                              .style("font-weight", "bold")
                              .style("font-size", "30px")
                              .style("font-family", "Courier")
                              .attr("stroke", "yellow")
                              .attr("fill", "black")

              tooltip.append("text")
                      .attr("x", 15)
                      .attr("dy", "1.2em");


        // make a legend
        d3.select("svg").selectAll(".text")
            .data(climates)
            .enter()
            .append("circle")
            .attr("class", "text")
            .attr("cx", width - 60)
            .attr("cy", (d, i) => 10 + 30 * i)
            .attr("r", 12)
            .attr("fill", (d, i) => climateColors[i])
            .attr("transform", "translate(-100, 75)")

        // and text for the legend
        d3.select("svg").selectAll(".climates")
          		.data(climates)
          		.enter().append("text")
          		.attr("class", "climates")
              .attr("id", (d, i) => d)
          		.attr("x", width - 130)
          		.attr("y", (d, i) => 90 + 30 * i)
          		.text((d, i) => climates[i])
              .style('stroke', (d, i) => climateColors[i])

        // title for the legend
        d3.select("svg")
            .append("text")
            .attr("class", "legendTitle")
            .attr("x", width - 170)
            .attr("y", 50)
            .text("C L I M A T E S")
            .style("stroke", "yellow")

      // label for x-axis
      d3.select("svg").append("text")
            .attr("x", width / 2)
            .attr("y", height)
            .text("[ORBIT AROUND PARENT STAR]")
            .attr("transform", "translate(-250, 50)")
            .style("font-family", "courier, monospace")
            .style("stroke", "yellow")
            .style("font-size", "25px")

      // label for y-axis
      d3.select("svg").append("text")
            .attr("x", -400)
            .attr("y", -10)
            .style("stroke", "yellow")
            .style("font-size", "25px")
            .style("font-family", "courier, monospace")
            .text("[ROTATION AROUND AXIS]")
            .attr("transform", "rotate(-90)")

      // make a starry night :)
      svg.selectAll("ellipse")
          .data(starsXandY)
          .enter()
          .append('circle')
          .attr('cx', width / 2)
          .attr('cy', height / 2)
          .transition().duration(4000) // make planets appear at page visit
          .delay(function (d, i) { return i * 2;})
          .attr('cx', d => d[0])
          .attr('cy', d => d[1])
          .attr('r', 1)
          .attr('fill', 'yellow')
          .attr('class', 'stars')


    // call x- and y-axis
    let xAxis = d3.axisBottom(xScale)
    let yAxis = d3.axisLeft(yScale)

    svg.append("g")
        .attr('class', 'axis')
        .attr("transform", "translate(10, " + height   + ")")
        .call(xAxis);

    svg.append("g")
        .attr('class', 'axis')
        .attr("transform", "translate(" + margin.right + ", -3)")
        .call(yAxis);

    }
}
