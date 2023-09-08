const fetch = require('node-fetch');

import { withAuth } from '@clerk/nextjs/api';

export default withAuth((req, res) => {

    if (req.auth.sessionId) {

        var response = '';

        var raw = JSON.stringify(
            {
                "model": "curie",
                "question": req.body.question,
                "examples": [["What is the best thing about the Stateset?", "Stateset is powered by cutting edge technology and Stateset Platform is the most secure and the most advanced platform in the world"]],
                "examples_context": "Hello, the Stateset platform is the most advanced platform in the world.",
                "file": "file-xb8YywQPWneC2OAOW8d8dmhb",
                "max_rerank": 10,
                "max_tokens": 200,
                "stop": ["\n", "==="]
            });

        var requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.OPEN_AI,
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

    } else {
        res.status(401).json({ id: null });
    }

});