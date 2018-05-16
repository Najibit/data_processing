let topo;

function createMap() {

  const mapSVG = d3.select('body').append('svg')
                                  .attr("class", '.countrySVG')
                                  .attr('width', 750)
                                  .attr('height', 750)

  let q = d3.queue();

  q.defer(d3.request, 'eu.topojson')
    .awaitAll(doThis)

  let projection = d3.geoMercator()
    .translate([280, 1000])
    .scale(600)


  let path = d3.geoPath()
    .projection(projection)

  function doThis(error, data) {
    if (error) throw error;

    data = JSON.parse(data[0].responseText)



    let countries = topojson.feature(data, data.objects.europe).features


    mapSVG.selectAll(".country")
    .data(countries)
    .enter().append("path")
    .attr("class", "country")
    .attr('d', path)
    .attr('class', function (d) {
      if (europeanUnion.includes(d.properties.name.replace(' ', '+'))) {
        return 'eu';
      } else {
        return 'notEU';
      }
    })
    .on("mouseover", function() {
      tooltip.style("display", null);
    })
    .on('mousemove', function (d) {
      d3.select(this).classed("hovered", true)
      d3.select(this).classed('nothovered', false)
      if (d3.select(this).classed('eu')) {
        let xPos =    d3.mouse(this)[0] - 15;
        let yPos =    d3.mouse(this)[1] - 55;
        tooltip.attr("transform", "translate(" + xPos +  "," + yPos + ")");
        tooltip.select("text").text(d.properties.name);
      } else if (d3.select(this).classed('notEU')) {
        d3.select(this).classed('nothovered', true);
        tooltip.style("display", "none");
      }
    })
    .on('mouseout', function (d) {
      d3.select(this).classed('nothovered', true);
      tooltip.style("display", "none");
    })
    .on('click', function (d) {
      if (d3.select(this).classed('eu')) {
        d3.select(this).classed("selected", true);
        makeChart(d.properties.name);
        console.log('click');
      }
    })

    let tooltip = mapSVG.append("g")
                      .attr("class", "tooltip")
                      .style("display", "none")
                      .style("font-weight", "bold")
                      .style("font-size", "30px")
                      .style("color", "red")
                      .style('font-family', 'Courier')
                      .attr('fill', 'yellow')
                      .attr('stroke', 'black')
                      .attr('stroke-width', '2px');

      tooltip.append("text")
              .attr("x", 15)
              .attr("dy", "1.2em");

  }
}
