const planets = [];
const spheres = [];
const climates = [];


window.onload = function() {

  const starsXandY = [];
  const planetLink1 = "https://swapi.co/api/planets/";
  const planetLink2 = "https://swapi.co/api/planets/?page=2";
  const planetLink3 = "https://swapi.co/api/planets/?page=3";
  const planetLink4 = "https://swapi.co/api/planets/?page=4";
  const planetLink5 = "https://swapi.co/api/planets/?page=5";
  const planetLink6 = "https://swapi.co/api/planets/?page=6";


  const planetAmount = 6;


  d3.queue()
    .defer(d3.request, planetLink1)
    .defer(d3.request, planetLink2)
    .defer(d3.request, planetLink3)
    .defer(d3.request, planetLink4)
    .defer(d3.request, planetLink5)
    .defer(d3.request, planetLink6)
    .awaitAll(doFunction);

  function doFunction(error, response) {
    if (error) throw error;

    const planetData = [];

    for (let i = 0; i < planetAmount; i++) {
      let goo = JSON.parse(response[i].responseText);
      planetData.push(goo.results);
    }

    for (let i = 0; i < planetAmount; i++) {
      planetData[i].forEach(function (planet) {
        if (planet.name != "unknown"
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

    // color function
    var categorical = { "name" : "schemeCategory20c", "n" : 20 };
    var colorScale = d3.scaleOrdinal(d3[categorical.name])

    // svg element




    let svg = d3.select("body").append("svg")

    svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "black");

    // dimensions
    const width = 1200;
    const height = 500;
    const margin = {top: 20, right: 20, bottom: 30, left: 40};


    //stars

    for (let i = 0; i < 500; i++) {
      let xy = [];
      xy.push(20 + Math.random() * (width - 200));
      xy.push(Math.random() * height);
      starsXandY.push(xy);
    }


    // color color

    function getColor(climate) {
      if (climate.includes('temperate')) {
          return '#00FFFF';
      } else if (climate.includes('frozen')) {
        return '#87CEFA';
      } else if (climate.includes('murky')) {
        return '#D8BFD8';
      } else if (climate.includes('arid')) {
        return '#FFE4B5';
      } else if (climate.includes('windy')) {
        return '#2F4F4F';
      } else if (climate.includes('hot')) {
        return '#e6550d';
      } else if (climate.includes('tropical')) {
        return '#31a354';
      } else if (climate.includes('frigid')) {
        return '#FFF';
      } else if (climate.includes('humid')) {
        return '#9ecaff';
      } else if (climate.includes('polluted')) {
        return '#6B8E23';
      } else if (climate.includes('superheated')) {
        return '#e60d00';
      } else if (climate.includes('artic') || climate.includes('subartic')) {
        return '#3182bd';
      }
    }

    climates.push('temperate', 'frozen', 'murky', 'arid', 'windy', 'hot', 'tropical', 'frigid', 'humid', 'polluted', 'superheated', 'artic');
    climateColors = ['#00FFFF', '#87CEFA', '#D8BFD8', '#FFE4B5', '#2F4F4F', '#e6550d', '#31a354', '#FFF', '#9ecaff', '#6B8E23', '#e60d00', '#3182bd'];
    // var gradient = svg.append("svg:defs")
    //                   .append("svg:linearGradient")
    //                   .attr("id", "gradient")
    //                   .attr("x1", "0%")
    //                   .attr("y1", "0%")
    //                   .attr("x2", "100%")
    //                   .attr("y2", "100%")
    //                   .attr("spreadMethod", "pad");
    //
    //    gradient.append("svg:stop")
    //             .attr("offset", "0%")
    //             .attr("stop-color", "#a00000")
    //             .attr("stop-opacity", 1);
    //
    //   gradient.append("svg:stop")
    //           .attr("offset", "100%")
    //           .attr("stop-color", "#aaaa00")
    //           .attr("stop-opacity", 1);




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

    svg.attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .attr("class", "svg")
          .attr("transform", "translate(0, 50)")





    svg.selectAll("circle")
        .data(spheres)
        .enter()
        .append("circle")
        .attr('cx', d => xScale(d[0]) + margin.left)
        .attr('cy', d => yScale(d[1]))
        .attr('r', d => (5 + (d[2] * 20) / 19720))
        .attr("fill", d => getColor(d[3]))
        .style('stroke', 'black')
        .style('stroke-width', '1px')
        .attr('class', 'planet')

        d3.select("svg").selectAll(".text")
            .data(climates)
            .enter().append("circle")
            .attr("class", "text")
            .attr("cx", width - 60)
            .attr("cy", (d, i) => 10 + 30 * i)
            .attr("r", 12)
            .attr("fill", (d, i) => climateColors[i])
            .attr("transform", "translate(-100, 75)")

        d3.select("svg").selectAll(".climates")
          		.data(climates)
          		.enter().append("text")
          		.attr("class", "climates")
          		.attr("x", width - 130)
          		.attr("y", (d, i) => 90 + 30 * i)
          		.text((d, i) => climates[i])
              .style('stroke', (d, i) => climateColors[i])

        d3.select("svg")
            .append("text")
            .attr("class", "legendTitle")
            .attr("x", width - 170)
            .attr("y", 50)
            .text("C L I M A T E S")
            .style("stroke", "yellow")

      d3.select("svg").append("text")
            .attr("x", width / 2)
            .attr("y", height)
            .text("ORBIT AROUND PARENT STAR")
            .attr("transform", "translate(-250, 50)")
            .style("stroke", "yellow")
            .style("font-size", "25px")

      d3.select("svg").append("text")
            .attr("x", -400)
            .attr("y", -10)
            // .attr("transform", "rotate(-90)")
            .style("stroke", "yellow")
            .style("font-size", "25px")
            .text("ROTATION AROUND AXIS")
            .attr("transform", "rotate(-90)")



function starryNight (count) {
        svg.selectAll("ellipse")
            .data(starsXandY)
            .enter()
            .append('circle')
            .attr('cx', d => d[0])
            .attr('cy', d => d[1])
            .attr('r', 1)
            .attr('fill', 'yellow')
            .attr('class', 'stars')
}

window.setInterval(starryNight(Math.random()), 1000);


    let xAxis = d3.axisBottom (xScale)


    let yAxis = d3.axisLeft(yScale)

    svg.append("g")
        .attr('class', 'axis')
        .attr("transform", "translate(10, " + height   + ")")
        .call(xAxis);


    svg.append("g")
        .attr('class', 'axis')
        .attr("transform", "translate(" + margin.right + ", -3)")
        .call(yAxis);




    // interactivity
    response = spheres;
    // implement interactivity by displaying count of crimes on hover-over
    // create d3 tip
  	var tip = d3.tip()
  		.attr("class", "d3-tip")
  		.offset([0, 0])

  		// tip should display corresponding datavalues
  		.html(function(d, i) {
  			return "<p><strong>" + d[4] + "</strong></p><p><text>("
  				+ d[0] + "," + d[1]
  				+ ") </text></p>"
  		})

  	svg.call(tip)
}
}
