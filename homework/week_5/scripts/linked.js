
/*
euro.fm linked view charts

Name: Najib el Moussaoui
Course: Dataprocessing
Date: 18/05/2018


Shows an interactive view between a map of the European union, the percentage of individuals that has internetaccess, 
the percentage of individuals that uses the internet to listen to music, the top 10 ranking artists (of all time) in the respective countries,
and the amount of listens of these artists worldwide.

*/


let europeanUnion; 

const data = {};


// for (let i = 0; i < europeanUnion.length; i++) {
//   API_LINKS.push(URL + europeanUnion[i] + API_KEY + FORMAT);
// }

window.onload = function() {
  
  
  const API_LINKS = [];
  const API_KEY = "&api_key=3720eb4ef07788c0a16540ceda7dcb61";
  const URL = "https://ws.audioscrobbler.com/2.0/?method=geo.gettopartists&country=";
  const FORMAT = "&format=json&limit=10";

  let internetUsage = [];
  let internetUsageStats = [];
  let internetAccess = [];
  
  europeanUnion = ['Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech+Republic', 'Denmark',
                  'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary',
                  'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta',
                  'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia',
                  'Slovenia', 'Spain', 'Sweden', 'United+Kingdom'];
  
  for (let i = 0; i < europeanUnion.length; i++) {
  API_LINKS.push(URL + europeanUnion[i] + API_KEY + FORMAT);
  }


  d3.csv("isoc_ci_ifp_iu_1_Data.csv", function(data) {

    for (let i = 0; i < data.length; i++) {
      let countryAccess = [];
      if ((europeanUnion.includes(data[i].GEO.replace(' ', '+'))
          || data[i].GEO == "Germany (until 1990 former territory of the FRG)")
          && data[i].INDIC_IS == "Last internet use: in the last 12 months"
          && data[i].IND_TYPE == 'All Individuals'
          && data[i].UNIT == "Percentage of individuals"
          && data[i].TIME == '2017'
        ) {
        countryAccess.push(data[i].GEO.replace('(until 1990 former territory of the FRG)', ''));
        countryAccess.push(parseInt(data[i].Value) / 100);
        internetAccess.push(countryAccess);
      }
    }
  })

  d3.csv("internetusage.csv", function(data) {
    for (let i = 1; i < data.length; i++) {
      internetUsage.push(data[i]['country;2010;2014'].split(';'));
    }

    for (let i = 0; i < internetUsage.length; i++) {
      if (europeanUnion.includes(internetUsage[i][0].replace(' ', '+'))) {
        internetUsage[i][1] / 100;
        internetUsage[i][2] / 100;
        internetUsageStats.push(internetUsage[i]);
      }
    }
  })

  const Q = d3.queue();

  for (let i = 0; i < europeanUnion.length; i++) {
    Q.defer(d3.request, API_LINKS[i]);
  }

    Q.awaitAll(shuffle);

  // function to launch when API calls are done
  function shuffle(error, response) {
    if (error) throw error;

    for (let i = 0; i < response.length; i++) {
      // make a dict for information per country
      let countryData = {};

      // parse response to JSON
      let info = JSON.parse(response[i].responseText);

      // all artist information
      let artists = [];

      // extract country names
      let country = info.topartists['@attr'].country;

      const artistCount = 10;

      // extract top 10 artists
      for (let j = 0; j < artistCount; j++) {
        let musician = {};

        musician['name'] = info.topartists.artist[j].name;
        musician['listeners'] = parseInt(info.topartists.artist[j].listeners);
        musician['url'] = info.topartists.artist[j].url;

        artists.push(musician);
      }

      data[country] = artists;
    }


let random = Math.floor(Math.random() * europeanUnion.length)

      createMap(0);

      document.getElementById("data1").addEventListener("click", function(){
        createMap(0);
      });
      document.getElementById("data2").addEventListener("click", function(){
        createMap(1);
      });

     }

}
