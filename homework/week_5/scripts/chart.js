/*
euro.fm linked view charts

Name: Najib el Moussaoui
Student ID: 10819967
Course: Dataprocessing
Date: 18/05/2018

Contains the create chart function, called when a country is on the map is clicked.
*/

function makeChart(country) {

    // remove existing chart on the page
    d3.selectAll('#chart').remove();

    // set dimensions
    const WIDTH = 500;
    const HEIGHT = 300;
    const MARGIN = {top: 50, bottom: 50, left: 60, right: 65};
    const barWidth = 45;

    // append svg for chart
    let SVG = d3.select('body')
                  .append('svg')
                  .attr('width', WIDTH + MARGIN.left + MARGIN.right)
                  .attr('height', HEIGHT + MARGIN.top + MARGIN.bottom)
                  .attr('class', 'svg')
                  .attr('id', 'chart');

    // add an x-scale, which ranks from 1 - 10
    const xScale = d3.scaleLinear()
                        .domain([0, artistCount])
                        .range([MARGIN.left, WIDTH + MARGIN.right]);
    
    // and a y-scale, for the amount of listeners worldwide
    const yScale = d3.scaleLinear()
                        .domain([0, 6000000])
                        .range([HEIGHT, 0]);

    
  
    // add some colors for the bars, gray palette
    barColors = ['#ffffff','#f0f0f0','#d9d9d9','#bdbdbd','#969696','#737373','#525252','#252525', '#111111','#000000'];
    barColors.reverse();

    // and append a bar per artist
    SVG.selectAll("rect")
       .data(data[country])
       .enter()
       .append("rect")
       .attr("x", (d, i) => MARGIN.left + 5 + i * (WIDTH / artistCount))
       .attr("y", 0)
       .attr("width", barWidth)
       .attr("height", d => HEIGHT - yScale(d.listeners))
       .style("opacity", 0)
       .transition().duration(4000)
       .delay((d, i) => i * 50)
       .style("opacity", 1)
       .attr("y", d => yScale(d.listeners))
       .attr('fill', (d, i) => barColors[i])
       .attr('stroke', 'black')

       // create a tip with information when hovering over a bar
       let tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-10, -20])
        .html(function(d, i) {
          return "<strong>Rank: " + i + "<br>Artist: </strong>" + d.name + "<br><strong>Listeners worldwide: </strong>" + d.listeners +"</span>";
        })

       // and show that tip when hovering over a bar
       SVG.selectAll("rect")
           .data(data[country])
           .on("mouseover", function(d, i) {
             tip.show(d, i+1)
           })
           .on("mouseout", function(d, i) {
             tip.hide(d, i)
           })

     // add the country name under the chart    
     d3.select("#chart")
         .append("text")
         .attr("class", "countryTitle")
         .attr("x", WIDTH / 2)
         .attr("y", HEIGHT + MARGIN.bottom - 5)
         .text(country)
         .style('opacity', 0)
         .transition().duration(1000)
         .delay((d, i) => i * 50)
         .style('opacity', 1)
         .style("stroke", "black")
         .style("fill", "black")
         .style("font-size", "30px")
         .style("font-family", "Courier, monospace")


     // create an x- and y-axis
     let xAxis = d3.axisBottom(xScale).ticks(0)
     let yAxis = d3.axisLeft(yScale)

     // call x-axis
     SVG.append("g")
         .attr('class', 'axis')
         .attr('transform', 'translate(0, ' + HEIGHT + ")")
         .call(xAxis);

     // call y-axis
     SVG.append("g")
         .attr('class', 'axis')
         .attr('transform', 'translate(' + MARGIN.left + ",0)")
         .call(yAxis);
    
     // call tip window
     SVG.call(tip);
}
