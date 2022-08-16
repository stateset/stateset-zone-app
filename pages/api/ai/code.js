const fetch = require('node-fetch');

import { withAuth } from '@clerk/nextjs/api';

export default withAuth((req, res) => {

  if (req.auth.sessionId) {

    var response = '';
    var PROMPT = `${req.body.body}:
    
    `;
  
    var raw = JSON.stringify({"prompt": PROMPT, "max_tokens": 300, "temperature": 0, "top_p": 1, "presence_penalty": 0, "frequency_penalty": 0, "logprobs": 0, "best_of": 1, "stop": ["//", "#"]});
      
    var requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': proces.env.OPEN_AI
      },
      body: raw,
      redirect: 'follow'
    };
    
    fetch("https://api.openai.com/v1/engines/code-davinci-002/completions", requestOptions)
    .then(response => response.json())
    .then(json => {
      res.status(200).json(json);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('An error occurred');
    })
  
  } else {
    res.status(401).json({ id: null });
  }

});
