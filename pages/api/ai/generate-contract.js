const fetch = require('node-fetch');

export default withAuth((req, res) => {

  if (req.auth.sessionId) {

    var response = '';
    var PROMPT = `${req.body.agreementType} 
    
    This ${req.body.agreementType} is made and entered into as of ${req.body.agreementStartDate} and expires ${req.body.agreementEndDate} between ${req.body.counterpartyName}
    and ${req.body.nodeName}.`;
  
    var raw = JSON.stringify({"prompt": PROMPT, "max_tokens": 500, "temperature": .095, "top_p": 1, "presence_penalty": 0.6});
      
    var requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': proces.env.OPEN_AI
      },
      body: raw,
      redirect: 'follow'
    };
    
    fetch("https://api.openai.com/v1/engines/text-davinci-002/completions", requestOptions)
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