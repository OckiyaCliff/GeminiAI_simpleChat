const PORT = 8000;
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_KEY);

app.post('/gemini', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
      history: req.body.history,
    });

    const msg = req.body.message;
    const result = await chat.sendMessage(msg);
    const text = result.response.text; // Assuming 'text' contains the final response text

    res.json({ response: text });
  } catch (error) {
    console.error(error);
    if (error.status === 400) {
      res.status(400).send('Bad Request: Ensure your billing account is set up and linked.');
    } else {
      res.status(500).send('Something went wrong with the AI service.');
    }
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));