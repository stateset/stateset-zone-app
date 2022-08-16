const fetch = require('node-fetch');

export default async function(req, res) {

  var response = '';
  var PROMPT = `The following is a message sent from ${req.body.from} to ${req.body.to}, two eCommerce companies. The subject of the message is ${req.body.subject}.

  Hello ${req.body.to},
  
  This is ${req.body.from}. `;

  var raw = JSON.stringify({"prompt": PROMPT, "max_tokens": 60, "temperature": .095});
    
  var requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': proces.env.OPEN_AI
    },
    body: raw,
    redirect: 'follow'
  };
  
  fetch("https://api.openai.com/v1/engines/davinci/completions", requestOptions)
  .then(response => response.json())
  .then(json => {
    res.status(200).json(json);
  })
  .catch(error => {
    console.error(error);
    res.status(500).send('An error occurred');
  })
};