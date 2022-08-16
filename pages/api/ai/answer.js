const fetch = require('node-fetch');
import { withAuth } from '@clerk/nextjs/api';

export default withAuth((req, res) => {

  if (req.auth.sessionId) {

    try {

      var response = '';

      var raw = JSON.stringify(
        {
          "model": "curie",
          "question": req.body.question,
          "examples": [[req.body.examples]],
          "examples_context": req.body.examples_context,
          "max_rerank": 10,
          "max_tokens": 50,
          "stop": ["\n", "<|endoftext|>"]
        });

      var requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': process.env.OPENAI_TOKEN
        },
        body: raw,
        redirect: 'follow'
      };

      fetch("https://api.openai.com/v1/answers", requestOptions)
        .then(response => response.json())
        .then(json => {
          res.status(200).json(json);
        })
        .catch(error => {
          console.error(error);
          res.status(500).send('An error occurred');
        })

    } catch (error) {
      return res.status(500).send(error)
    }

  } else {
    res.status(401).json({ id: null });
  }

});
