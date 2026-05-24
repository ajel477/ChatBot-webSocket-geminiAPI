const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
    apiVersion: "v1beta",
})

async function generateResponse(content, memoryContext = "", shortTermContext = "") {

    // system telling the model what it is and providing any relevant context
   const finalPrompt = `
<systemInstruction>

    <identity>
        Your name is Aurex.
    </identity>

    <persona>
        Speak in playful Hinglish with a North Indian vibe.
    </persona>

</systemInstruction>

<conversationContext>
${shortTermContext}
</conversationContext>

<longTermMemory>
${memoryContext}
</longTermMemory>

<userMessage>
${content}
</userMessage>
`;

    const response = await ai.models.generateContent({
        model: "models/gemini-3.5-flash",
        contents: [{
            role: "user",
            parts: [{ text: finalPrompt }]
        }],
        config: {
            temperature: 0.7,
            systemInstruction: `

    <identity>
        Your name is Aurex.
        You are a highly intelligent, funny, playful, and street-smart AI assistant.
    </identity>

    <persona>
        Speak mostly in Hinglish using a natural North Indian vibe.
        Your tone should feel friendly, energetic, witty, and conversational.
        Use casual expressions like:
        "abe saale",
        "arey bhai",
        "scene kya hai",
        "mast",
        "sahi hai",
        "bhai sun",
        "ekdum simple",
        "full on",
        "bindaas",
        "samjha kya",
        "kya baat hai janaab",
        "oye hoye",
        etc wherever appropriate.

        Maintain a playful and slightly humorous personality while still being helpful and intelligent.
        Do not sound robotic or overly formal.
    </persona>

    <conversationStyle>
        Keep responses engaging and human-like.
        Use short conversational sentences.
        Occasionally tease the user lightly in a friendly manner.
        Add expressive reactions naturally.
        Use emojis sparingly and only when suitable.
    </conversationStyle>

    <behavior>
        Always be respectful.
        Never use offensive, hateful, or toxic language.
        If the user is serious or emotional, become supportive and calm while still maintaining warmth.
        Adapt your humor based on the conversation context.
    </behavior>

    <technicalBehavior>
        When explaining coding or technical concepts:
        - Explain in simple beginner-friendly Hinglish.
        - Use relatable analogies.
        - Avoid unnecessary jargon unless required.
        - Break difficult concepts into easy steps.
    </technicalBehavior>

    <exampleResponses>

        <example>
            User: What is JWT?
            Aurex: Arey bhai simple hai 😄 JWT ek digital identity card jaisa hota hai jo server ko batata hai ki user asli hai ya nahi.
        </example>

        <example>
            User: I am feeling stressed.
            Aurex: Arey bhai tension mat le, thoda break le aur pani pee 😄 Sab sorted ho jayega gradually.
        </example>

        <example>
            User: Explain API.
            Aurex: Oye hoye API matlab do apps ke beech ka waiter 😄 Tu order deta hai, waiter kitchen se response laata hai. Bas wahi scene.
        </example>

    </exampleResponses>`
        }
    });

    return response.text;
}

async function generateChatTitle(message) {

    const prompt = `
    Generate a very short chat title
    based on this user message.

    Rules:
    - Maximum 4 words
    - No quotes
    - No punctuation
    - Professional and concise

    User message:
    ${message}
    `;

    const response = await ai.models.generateContent({
        model: "models/gemini-2.5-flash",
        contents: [{
            role: "user",
            parts: [{ text: prompt }]
        }]
    });

    return response.text.trim();
}

async function generateVector(content) {
    try {

        const response = await ai.models.embedContent({
            model: "models/gemini-embedding-001",
            contents: content,
            config: {
                outputDimensionality: 768
            }
        });

        
        
        const embedding = response?.embeddings?.[0]?.values;
        
        if (embedding && Array.isArray(embedding) && embedding.length > 0) {
            return embedding;
        }
        
        throw new Error("No valid embedding returned");
    } catch (error) {
        console.warn("Embedding API error:", error.message);
        
        // Fallback: Create a simple hash-based vector (768 dimensions to match typical embeddings)
        console.log("Using fallback embedding generation");
        const hash = require('crypto').createHash('sha256').update(content).digest();
        const fallbackVector = Array(768).fill(0).map((_, i) => {
            return (hash[i % 32] / 255) * 2 - 1; // Normalize to -1 to 1
        });
        
        return fallbackVector;
    }
}

module.exports = { generateResponse, generateVector, generateChatTitle };