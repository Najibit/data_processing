/*
Het is nog (lang) niet af. Het idee is om een kaart van de Europese Unie te hebben,
waarbij je per land kan zien wat de top 10 muziekartiesten zijn. Ik kwam er echter halverwege achter,
dat je enkel het aantal listens wereldwijd ziet, niet per land. Kan ik ook een scorebord maken per land met de top 10 artiesten?
Of moet het een grafiek zijn?

*/


let countries = ['Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech+Republic', 'Denmark',
                  'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary',
                  'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta',
                  'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia',
                  'Slovenia', 'Spain', 'Sweden', 'United+Kingdom'];

const API_KEY = "&api_key=3720eb4ef07788c0a16540ceda7dcb61";
const URL = "http://ws.audioscrobbler.com/2.0/?method=geo.gettopartists&country=";
const FORMAT = "&format=json&limit=10";
const data = {};
let artistCount = 10;


const API_LINKS = [];

for (let i = 0; i < countries.length; i++) {
  API_LINKS.push(URL + countries[i] + API_KEY + FORMAT);
}

window.onload = function() {

  const Q = d3.queue();

  for (let i = 0; i < countries.length; i++) {
    Q.defer(d3.request, API_LINKS[i]);
  }

    Q.awaitAll(shuffle);

  // function to launch when API calls are done
  function shuffle(error, response) {
    if (error) throw error;

    let information = JSON.parse(response[0].responseText);


    for (let i = 0; i < response.length; i++) {
      // make a dict for information per country
      let countryData = {};

      // parse response to JSON
      let info = JSON.parse(response[i].responseText);

      // max amount of artists per country
      // let artistCount = 10;

      // all artist information
      let artists = [];

      // extract country names
      // data['country'] = info.topartists['@attr'].country;
      let country = info.topartists['@attr'].country;

      // extract top 10 artists
      for (let j = 0; j < artistCount; j++) {
        let musician = {};

        musician['name'] = info.topartists.artist[j].name;
        musician['listeners'] = parseInt(info.topartists.artist[j].listeners);
        musician['url'] = info.topartists.artist[j].url;

        artists.push(musician);
      }

      // and add to info per country dict
      countryData['artists'] = artists;
      // push info per country dict to data array
      data[country] = artists;
      // data.push(countryData);
    }

    // start drawing

    const WIDTH = 500;
    const HEIGHT = 500;
    const MARGIN = {top: 50, bottom: 50, left: 50, right: 50};

    const SVG = d3.select('body')
                    .append('svg')
                    .attr('width', WIDTH + MARGIN.left + MARGIN.right)
                    .attr('height', HEIGHT + MARGIN.top + MARGIN.bottom)
                    .style('background-color', '#efefef')
                    .attr('class', 'svg')



    const xScale = d3.scaleLinear()
                        .domain([0, artistCount])
                        .range([MARGIN.left, WIDTH + MARGIN.right]);
    const yScale = d3.scaleLinear()
                        .domain([0, 6000000])
                        .range([HEIGHT, 0]);

    console.log(yScale(data.Austria[0].listeners))
    console.log(data.Austria[0].listeners);

    SVG.selectAll("rect")
       .data(data.Austria)
       .enter()
       .append("rect")
       .attr("class", "bars")
       .attr("x", 50)
       .attr("y", (d, i) => i * 40)
       .attr("width", 500)
       .attr("height", 35)
       .attr('fill', 'white')
       .attr('stroke', 'black')
       .text(data.Austria.listeners)


       // let xAxis = d3.axisBottom(xScale).ticks(0)
       // let yAxis = d3.axisLeft(yScale)

     //   SVG.append("g")
     //       .attr('class', 'axis')
     //       .attr('transform', 'translate(0, ' + HEIGHT + ")")
     //       .call(xAxis);
     //
     //   SVG.append("g")
     //       .attr('class', 'axis')
     //       .attr('transform', 'translate(' + MARGIN.left + ",0)")
     //       .call(yAxis);
     //
     // }

}


}
