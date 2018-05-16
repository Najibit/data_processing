function makeChart(country) {

    d3.select('#chart').remove();

    const WIDTH = 500;
    const HEIGHT = 250;
    const MARGIN = {top: 50, bottom: 50, left: 60, right: 65};


    var SVG = d3.select('body')
                  .append('svg')
                  .attr('width', WIDTH + MARGIN.left + MARGIN.right)
                  .attr('height', HEIGHT + MARGIN.top + MARGIN.bottom)
                  .style('background-color', '#efefef')
                  .attr('class', 'svg')
                  .attr('id', 'chart')


    const xScale = d3.scaleLinear()
                        .domain([0, artistCount])
                        .range([MARGIN.left, WIDTH + MARGIN.right]);
    const yScale = d3.scaleLinear()
                        .domain([0, 6000000])
                        .range([HEIGHT, 0]);


    let barWidth = 45;


    SVG.selectAll("rect")
       .data(data[country])
       .enter()
       .append("rect")
       .attr("x", (d, i) => MARGIN.left + 5 + i * (WIDTH / artistCount))
       .attr("y", 0)
       .attr("width", barWidth)
       .attr("height", d => HEIGHT - yScale(d.listeners))
       .style("opacity", 0)
       .attr("fill", "gray")
       .transition().duration(4000)
       .delay((d, i) => i * 50)
       .style("opacity", 1)
       .attr("y", d => yScale(d.listeners))
       .attr('fill', 'blue')
       .attr('stroke', 'black')

   SVG.selectAll("rect")
       .data(data[country])
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
         tooltip.select("text").text(d.name);
       })

     let tooltip = SVG.append("g")
                       .attr("class", "tooltip")
                       .style("display", "none")
                       .style("font-weight", "bold")
                       .style("font-size", "30px")
                       .style("color", "red");

     tooltip.append("text")
             .attr("x", 15)
             .attr("dy", "1.2em");

     d3.select("#chart")
         .append("text")
         .attr("class", "countryTitle")
         .attr("x", WIDTH - MARGIN.right)
         .attr("y", 0)
         .text(country)
         .style("stroke", "yellow")
         .style("fill", "yellow")
         .style("font-size", "30px")
         .style("font-family", "Courier, monospace")



     let xAxis = d3.axisBottom(xScale).ticks(0)
     let yAxis = d3.axisLeft(yScale)

     SVG.append("g")
         .attr('class', 'axis')
         .attr('transform', 'translate(0, ' + HEIGHT + ")")
         .call(xAxis);

     SVG.append("g")
         .attr('class', 'axis')
         .attr('transform', 'translate(' + MARGIN.left + ",0)")
         .call(yAxis);
}
