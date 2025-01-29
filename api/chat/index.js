// Load environment variables from .env.local when not in production
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }
  
  const OpenAI = require('openai');
  
  module.exports = async (req, res) => {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
  
    // Handle OPTIONS preflight request
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
  
    // Only allow POST requests
    if (req.method !== 'POST') {
      console.error("Method not allowed:", req.method);
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    // Check if the API key is loaded
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is missing! Check your .env file or environment settings.");
      return res.status(500).json({ error: 'OpenAI API key is not configured' });
    }
  
    // Log the request for debugging
    console.log("Received request with body:", req.body);
  
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  
    try {
      // Make OpenAI API call
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant.",
          },
          {
            role: "user",
            content: req.body.message || "Hello!",
          },
        ],
      });
  
      // Log the OpenAI response
      console.log("OpenAI response:", completion);
  
      // Return the response to the client
      res.status(200).json({ response: completion.choices[0].message.content });
    } catch (error) {
      // Log the error for debugging
      console.error("Error with OpenAI API call:", error);
  
      // Return error details to the client
      res.status(500).json({ error: 'Error processing OpenAI API request', details: error.message });
    }
  };
  