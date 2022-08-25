const fetch = require('node-fetch');

export default async function(req, res) {

    var response = '';
    var command = req.body.body;
    var command_string = command.substring(command.indexOf("e") + 2, command.length); 
    var PROMPT = `Code ${command_string} in cosmwasm:
    
    `;

    console.log(command_string);
  
    var raw = JSON.stringify({"prompt": PROMPT, "max_tokens": 300, "temperature": 0, "top_p": 1, "presence_penalty": 0, "frequency_penalty": 0, "logprobs": 0, "best_of": 1, "stop": [`//`, `#`, `"""`]});
      
    var requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.OPEN_AI
      },
      body: raw,
      redirect: 'follow'
    };
    
    fetch("https://api.openai.com/v1/engines/davinci-codex/completions", requestOptions)
    .then(response => response.json())
    .then(json => {
      res.status(200).json(json);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('An error occurred');
    })
  };