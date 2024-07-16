
const express = require('express');
const port = 8080;

const dotenv = require('dotenv');
dotenv.config();


const { OpenAI } = require('openai');
const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY
});

const app = express();

app.post('/blessings', (req, res) => {
    const createCompletions = async () => {
        const body = req.body;
        let prompt;

        prompt = `Please provide me with 3 blessings in a ${body.ambience} atmosphere suitable the following details:
        event kind: ${body.event} age: ${body.age} the family closeness to the event: ${body.closeness}.
        also, return the response in a parserable JSON format like the follow:
        {
            "1":"...",
            "2":"...",
            "3":"...",        
        }`;

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: prompt
        });

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(response.choices[0].message);
        } catch {
            console.log("Error parsing JSON response");
            res.send({});
        }
        res.send({parsedResponse});

    };
    createCompletions();



})

app.listen(port, () => {
    console.log("the application running in http://localhost:", port);
});
