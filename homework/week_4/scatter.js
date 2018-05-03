const planets = [];
const velocities = [];


window.onload = function() {

  const climates = [];
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
      velocities.push(C3PO);
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
    const width = 1000;
    const height = 500;
    const margin = {top: 20, right: 20, bottom: 30, left: 40};


    //stars

    for (let i = 0; i < 500; i++) {
      let xy = [];
      xy.push(20 + Math.random() * width);
      xy.push(Math.random() * height);
      starsXandY.push(xy);
    }


    // color color

    function getColor(climate) {
      if (climate.includes('temperate')) {
          return 'green';
      } else if (climate.includes('frozen')) {
        return '#d8f0ff';
      } else if (climate.includes('murky')) {
        return '#636363';
      } else if (climate.includes('arid')) {
        return '#fdae6b';
      } else if (climate.includes('windy')) {
        return '#d9d9d9';
      } else if (climate.includes('hot')) {
        return '#e6550d';
      } else if (climate.includes('tropical')) {
        return '#31a354';
      } else if (climate.includes('frigid')) {
        return '#9ecae1';
      } else if (climate.includes('humid')) {
        return '#9ecae1';
      } else if (climate.includes('polluted')) {
        return '#9e9ac8';
      } else if (climate.includes('superheated')) {
        return '#e60d00';
      } else if (climate.includes('artic') || climate.includes('subartic')) {
        return '#3182bd';
      }

    }




    // scales
    const xScale = d3.scaleLinear()
                        .domain([
                          d3.min(velocities, d => d[0]),
                          d3.max(velocities, d => d[0])
                        ])
                        .range([0, width]);
    const yScale = d3.scaleLinear()
                        .domain([
                          d3.min(velocities, d => d[1]),
                          d3.max(velocities, d => d[1])
                        ])
                        .range([height, 0]);

    svg.attr("width", width)
          .attr("height", height + margin.top)
          .attr("class", "svg")

    for (let i = 0; i < velocities.length; i++) {
      console.log(velocities[i][3]);
    }




    svg.selectAll("circle")
        .data(velocities)
        .enter()
        .append("circle")
        .attr('cx', d => xScale(d[0]) + margin.left)
        .attr('cy', d => yScale(d[1]) - margin.bottom)
        .attr('r', d => (5 + (d[2] * 20) / 19720))
        .attr("fill", d => getColor(d[3]))
        .style('stroke', 'black')
        .style('stroke-width', '1px')
        .attr('class', 'planet')

        svg.selectAll("ellipse")
            .data(starsXandY)
            .enter()
            .append('circle')
            .attr('cx', d => d[0])
            .attr('cy', d => d[1])
            .attr('r', 1)
            .attr('fill', 'white')
            .attr('class', 'stars')




    let xAxis = d3.axisBottom (xScale)


    let yAxis = d3.axisLeft(yScale)

    svg.append("g")
        .attr('class', 'axis')
        .attr("transform", "translate(10, " + height + ")")
        .call(xAxis);


    svg.append("g")
        .attr('class', 'axis')
        .attr("transform", "translate(" + margin.right + ", -7)")
        .call(yAxis);




      }

}
