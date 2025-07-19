import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import multer from 'multer';


const app = express();
const port = 4000;


app.use(express.json())
app.use(cors());

const upload = multer({
    storage: multer.memoryStorage()
})

app.post('/api/ask-openai', upload.single('image'), async (req, res) => {
    try {

        const prompt = req.body.prompt;
        const image = req.file;
        const content = []
        if (prompt) {

            content.push({ text: prompt });
        }

        if (image) {
            const base64img = image.buffer.toString('base64');
            content.push({
                inlineData: {
                    mime_type: image.mimetype,
                    data: base64img
                },
            })
        }

        if (content.length === 0) {
            return res.status(400).json({ error: "No content (prompt or image) provided." });
        }

        const response = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + process.env.OPENAI_KEY,
            {
                contents: [{ parts: content }]
            },
        );
        res.json({ reply: response.data.candidates[0].content.parts[0].text });
    } catch (error) {
        console.error("OpenAI Error:", error.response?.data);
        res.status(500).json({ error: "AI failed" });
    }
});

app.listen(port, () => { console.log("server started", port) })