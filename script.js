
const fetchData = () => {
  return fetch(`http://localhost:8086/query?db=exec&q=SELECT%20"price"%20FROM%20"price"`)
    .then( response => {
      if (response.status !== 200) {
        console.log(response);
      }
      return response;
    })
    .then( response => response.json() )
    .then( parsedResponse => {
      const data = [];
      parsedResponse.results[0].series[0].values.map( (elem, i) => {
        let newArr = [];
        newArr.push(new Date(Date.parse(elem[0])));
        newArr.push(elem[1]);
        data.push(newArr);
      });
      return data;
    })
    .catch( error => console.log(error) );
}

const drawGraph = () => {
  let g;
  Promise.resolve(fetchData())
    .then( data => {
      g = new Dygraph(
        document.getElementById("div_g"),
        data,
        {
          drawPoints: true,
          title: 'Bitcoin Pricing',
          titleHeight: 32,
          ylabel: 'Price (USD)',
          xlabel: 'Date',
          strokeWidth: 1.5,
          labels: ['Date', 'Price'],
        });
    });

  window.setInterval( () => {
    console.log(Date.now());
    Promise.resolve(fetchData())
      .then( data => {
        g.updateOptions( { 'file': data } );
      });
  }, 300000);
}

$(document).ready(drawGraph());
