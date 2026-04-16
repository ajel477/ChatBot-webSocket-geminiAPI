const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY
})



async function generateResponse(content) {

    const response = await ai.models.generateContent({
        
        model: "models/gemini-2.5-flash",
        contents: [{
            role: "user",
            parts: [{ text: content }]
        }]
    });

    return response.text;

};

module.exports = { generateResponse };