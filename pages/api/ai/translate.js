const fetch = require('node-fetch');

export default withAuth((req, res) => {

  if (req.auth.sessionId) {

    var response = '';
    var PROMPT = `${req.body.body}`;
  
    var raw = JSON.stringify({"input": PROMPT, "instruction": "Translate to Spanish", "temperature": 1, "top_p": 1 });
      
    var requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': proces.env.OPEN_AI
      },
      body: raw,
      redirect: 'follow'
    };
    
    fetch("https://api.openai.com/v1/engines/text-davinci-edit-001/edits", requestOptions)
    .then(response => response.json())
    .then(json => {
      return res.status(200).json(json);
    })
    .catch(error => {
      console.error(error);
      return res.status(500).send('An error occurred');
    })

} else {
  res.status(401).json({ id: null });
}

});