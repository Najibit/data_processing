
/*
Het is nog (lang) niet af. Het idee is om een kaart van de Europese Unie te hebben,
waarbij je per land kan zien wat de top 10 muziekartiesten zijn. Ik kwam er echter halverwege achter,
dat je enkel het aantal listens wereldwijd ziet, niet per land. Kan ik ook een scorebord maken per land met de top 10 artiesten?
Of moet het een grafiek zijn

Stappenplan:
1. Van 1 land een staafdiagram maken
2. Aan de hand van JQuery de staafdiagram laten veranderen
3. Een landkaart instellen en aan de hand daarvan laten veranderen
4. Met CSS styling doen
5. Bootstrap functionaliteiten toevoegen.

*/


let europeanUnion = ['Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech+Republic', 'Denmark',
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

for (let i = 0; i < europeanUnion.length; i++) {
  API_LINKS.push(URL + europeanUnion[i] + API_KEY + FORMAT);
}

window.onload = function() {

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

      createMap();

     }

}
