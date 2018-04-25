d3.select("head").append("title").text("Crime in The Netherlands");
d3.select("body").append("h4").text("Name: Najib el Moussaoui")
d3.select("body").append("h4").text("Student number: 10819967")
d3.select("body").append("h5").text("Visualizing crimes per category in The Netherlands in 2017.");

var dataSet;

d3.json("/data.json", function(data) {
  var svg = d3.select("body").append("svg");

  // Width and height
    var w = 1000;
    var h = 500;
    var barPadding = 1;

  svg.attr("width", w).attr("height", h).attr("style", "padding:10px;");

  dataArray = [];

  data = d3.entries(data)["0"].value;
  // console.log(data[0]["Totaal geregistreerde misdrijven (2015)"]);
  d3.select("body").selectAll("p")
    .data(data)
    .enter()
    .append("p")
    .text(function(d) { dataArray.push(d3.values(d).slice(0, 3)); return d3.values(d).slice(0, 3); });

  svg.selectAll("rect")
     .data(dataArray)
     .enter()
     .append("rect")
     .attr("x", function(d, i) {
        return i * (w / dataArray.length) + barPadding;
     })
     .attr("y", function(d) {
        console.log(d[1])
        return h - (d[1] / 10000) * 9;
     })
     .attr("width", w / dataArray.length - barPadding)
     .attr("height", function(d) {
        return (d[1] / 10000) * 9;})

  var xAxis = d3.svg.axis();


});
