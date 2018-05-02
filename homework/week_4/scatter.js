

window.onload = function() {

  const planets = [];
  const velocities = [];

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
      C3PO.push(parseInt(planets[i].diameter))
      velocities.push(C3PO);
      }
    }

    // svg element
    let svg = d3.select("body").append("svg")

    // dimensions
    const width = 1000;
    const height = 500;
    const margin = {top: 20, right: 20, bottom: 30, left: 40};


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

          console.log(velocities)
          console.log(planets)

    svg.selectAll("circle")
        .data(velocities)
        .enter()
        .append("circle")
        .attr('cx', d => xScale(d[0]) + margin.left)
        .attr('cy', d => yScale(d[1]) - margin.bottom)
        .attr('r', 5)

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
