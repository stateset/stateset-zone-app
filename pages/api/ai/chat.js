const fetch = require('node-fetch');

import { withAuth } from '@clerk/nextjs/api';

export default ((req, res) => {

    var response = '';
    var PROMPT = `The following is a conversation with an OpenAI agent. The agent is intelligent, creative, clever, and very friendly.

    Human: Hello, who are you?
    Polite AI: I am an AI created by OpenAI. How can I help you today?
    Human: ${req.body.body}
    Polite AI:`;
  
    var raw = JSON.stringify({"prompt": PROMPT, "max_tokens": 150, "temperature": 1, "top_p": 1, "presence_penalty": 0.6, "stop": ["\n", " Human:", " AI:"]});
      
    var requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.OPEN_AI
      },
      body: raw,
      redirect: 'follow'
    };
    
    fetch("https://api.openai.com/v1/engines/text-davinci-002/completions", requestOptions)
    .then(response => response.json())
    .then(json => {
      return res.status(200).json(json);
    })
    .catch(error => {
      console.error(error);
      return res.status(500).send('An error occurred');
    })

});