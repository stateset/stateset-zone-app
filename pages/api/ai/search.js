export default async function(req, res) {

    var DOCUMENTS = req.documents;
    var QUERY = req.query
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
      
    var raw = JSON.stringify({"documents": DOCUMENTS, "query": QUERY});
      
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch("https://api.openai.com/v1/engines/davinci/search", requestOptions)
    .then(response => response.json())
    .then(json => {
      res.status(200).json(json);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('An error occurred');
    })
};