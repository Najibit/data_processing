/*

euro.fm linked view charts

Name: Najib el Moussaoui
Student ID: 10819967
Course: Dataprocessing
Date: 18/05/2018

Contains the create map function, with two different maps for two different datasets.
*/

function createMap(number) {

  // remove current map when new map is initiated
  d3.selectAll('.countrySVG').remove();

  // append new svg for new map
  const mapSVG = d3.select('body').append('svg')
                                  .attr("class", 'countrySVG')
                                  .attr('width', 750)
                                  .attr('height', 750);



  
  let q = d3.queue();
  
  // get a topojson file from Europe
  q.defer(d3.request, 'eu.topojson')
    .awaitAll(getTunes);
  
  // some configurations to the map
  let projection = d3.geoMercator()
    .translate([280, 1000])
    .scale(600);

  // and the paths
  let path = d3.geoPath()
    .projection(projection);

  // get all country data
  function getTunes(error, data) {
    if (error) throw error;
    
    // parse data to JSON structure
    data = JSON.parse(data[0].responseText);

    // save countries in variable
    let countries = topojson.feature(data, data.objects.europe).features

    // Edit some properties so the data is usable
    for (let i = 0; i < countries.length; i++) {
      let name = countries[i].properties.name;
      if (countries[i].properties.name == 'Czech Rep.') {
        countries[i].properties.name = 'Czech Republic';
      }
    }

    // add all countries to the map
    mapSVG.selectAll(".country")
    .data(countries)
    .enter()
    .append("path")
    .attr('d', path)
    .attr("id", d => d.properties.name.replace(' ', ''))
    .attr('class', function (d) {
      if (europeanUnion.includes(d.properties.name.replace(' ', '+'))
          || d.properties.name == 'Czech Rep.') { 
        return 'eu';
      } else {
        return 'notEU';
      }
    })
    
    // adding  some functionality when hovering over a country
    .on("mouseover", function() {
      tooltip.style("display", null);
    })
    .on('mousemove', function (d) {
      d3.select(this).classed("hovered", true);
      d3.select(this).classed('nothovered', false);
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
        
        // make chart about country clicked on
        makeChart(d.properties.name);
      }
    })


    // make colours
    let colours = ['#ffffff','#f0f0f0','#d9d9d9','#bdbdbd','#969696','#737373','#525252','#252525','#000000'];
    let colourNumbersAccess = [];
    let colourNumbersUsage = [];
    
    // add the numbers about internet access to an array so it's usable for colouring
    for (let i = 0; i < internetAccess.length; i++) {
        colourNumbersAccess.push(internetAccess[i][1]);
      }
  
    // add the numbers about internet usage to an array so it's usable for colouring
    for (let i = 0; i < internetUsageStats.length; i++) {
      colourNumbersUsage.push(internetUsageStats[i][2]);
    }

    // colour brew function for the map / legend
    let colorBrew;

    if (number == 0) {
      colorBrew = d3.scaleQuantize()
        .domain([d3.min(colourNumbersAccess), d3.max(colourNumbersAccess)])
        .range(colorbrewer.Blues[9]);
    } else if (number == 1) {
      colorBrew = d3.scaleQuantize()
        .domain([d3.min(colourNumbersUsage), d3.max(colourNumbersUsage)])
        .range(colorbrewer.Greens[9]);
    }

    if (number == 0) {
      for (let i = 0; i < internetAccess.length; i++) {
          mapSVG.select(`#${internetAccess[i][0].replace(' ', '')}`)
                .attr('fill', colorBrew(internetAccess[i][1]));
          }
    } else if (number == 1) {
      for (let i = 0; i < internetUsageStats.length; i++) {
          mapSVG.select(`#${internetUsageStats[i][0].replace(' ', '')}`)
                .attr('fill', colorBrew(internetUsageStats[i][2]));
          }
    }

    // add a tooltip 
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

    // some shiny transition at page visit/switch
    d3.select('.countrySVG')
      .append('rect')
      .attr('height', 700)
      .attr('width', 800)
      .attr('fill', 'white')
      .style('opacity', 1)
      .attr('class', 'reccie')
      .transition().duration(1000)
      .delay((d, i) => i * 50)
      .style('opacity', 0)
      .attr('fill', 'white')
      .remove();

    // add a map title
    d3.select(".countrySVG")
        .append("text")
        .attr("class", "mapTitle")
        .attr("x", 100)
        .attr("y", 650)
        .text((number == 0) ? 'Percentage of individuals that have access to the internet' : 'Percentage of individuals that use the internet to listen to music')
        .style('opacity', 0)
        .transition().duration(1000)
        .delay((d, i) => i * 50)
        .style('opacity', 1)
        .style("stroke", "black")
        .style("fill", "black")
        .style("font-size", "15px")
        .style("font-family", "Courier, monospace");

    // ranking legend
    let ranks = [6, 6.6, 7.3, 7.9, 8.5, 9.3, 10];
    ranks.reverse();

    // add svg for legend
    let legendSVG = d3.select("body")
                      .append('svg')
                      .attr('width', 40)
                      .attr('height', 400)
                      .attr('class', 'legendsvg')
                      .attr('stroke', 'black');

      // get the colour-stats array
      colourNumbersUsage.sort();
      colourNumbersUsage.reverse();

      // fill in the legend depending on the chart
      if (number == 0) {
        legendSVG.selectAll('rect')
                  .data(ranks)
                  .enter()
                  .append('rect')
                  .attr('width', '40px')
                  .attr('height', '40px')
                  .attr('x', 0)
                  .attr('y', (d, i) => i * 40)
                  .attr('fill', d => colorBrew(d / 10));
      } else {
        legendSVG.selectAll('rect')
                  .data(ranks)
                  .enter()
                  .append('rect')
                  .attr('width', '40px')
                  .attr('height', '40px')
                  .attr('x', 0)
                  .attr('y', (d, i) => i * 40)
                  .attr('fill', (d, i) => colorBrew(colourNumbersUsage[i * 4]));
      }

      // append a percentage to the legend
      legendSVG.append('text')
                .attr("x", 20)
                .attr("y", 400)
                .text("100%")
                .style('opacity', 0)
                .transition().duration(1000)
                .delay((d, i) => i * 50)
                .attr("x", 2)
                .attr("y", 30)
                .style('opacity', 1)
                .style("stroke", "white")
                .style("fill", "white")
                .style("font-size", "15px")
                .style("font-family", "Courier, monospace");
  }
}
