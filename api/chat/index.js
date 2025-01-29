if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config(); // Load environment variables in local development
}

// ✅ Correct OpenAI Import
const { OpenAI } = require('openai'); 

module.exports = async (req, res) => {
    try {
        // Add CORS headers
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust for security
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader(
            'Access-Control-Allow-Headers',
            'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
        );

        // Handle OPTIONS preflight request
        if (req.method === 'OPTIONS') {
            return res.status(200).end();
        }

        // Ensure request is a POST request
        if (req.method !== 'POST') {
            console.error("❌ ERROR: Received non-POST request");
            return res.status(400).json({ error: 'Invalid request. Please send a POST request with a message.' });
        }

        // Debugging: Log request body
        console.log("📩 Received request body:", req.body);

        // Ensure OpenAI API key is available
        if (!process.env.OPENAI_API_KEY) {
            console.error("❌ ERROR: OpenAI API key is missing!");
            return res.status(500).json({ error: 'Server error: OpenAI API key not configured.' });
        }

        // Validate user input
        if (!req.body.message || typeof req.body.message !== 'string') {
            console.error("❌ ERROR: Invalid message input", req.body);
            return res.status(400).json({ error: 'Invalid message format. Message must be a string.' });
        }

        // ✅ Initialize OpenAI client (Fixed)
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // Send request to OpenAI API
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: req.body.message }
            ]
        });

        // Debugging: Log OpenAI response
        console.log("✅ OpenAI Response:", completion);

        // Return response to frontend
        res.status(200).json({ response: completion.choices[0].message.content });

    } catch (error) {
        // Log detailed error for debugging
        console.error("❌ ERROR: OpenAI API call failed", error);

        res.status(500).json({
            error: 'Server error: Failed to process request.',
            details: error.message || "Unknown error"
        });
    }
};
