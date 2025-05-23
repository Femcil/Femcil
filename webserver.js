// --- Required Libraries ---
const express = require("express");
const app = express();
// Install cors if needed: In Glitch terminal, type `npm install cors`
// const cors = require('cors');

// Install a library to make HTTP requests: In Glitch terminal, type `npm install node-fetch`
const fetch = require('node-fetch'); // Or const axios = require('axios');

// You will likely need a library to handle multipart/form-data for file uploads
// Install multer if needed: In Glitch terminal, type `npm install multer`
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' }); // Configure multer for temporary storage

// You will also need a library to interact with your chosen file hosting service (e.g., Glitch Assets, AWS S3, Cloudinary)
// Example for Glitch Assets (requires Glitch API or a custom upload handler):
// const glitchAssets = require('@glitch/assets'); // This is illustrative, actual Glitch Assets upload might differ


// --- Access API Keys ---
// Make sure you have a .env file with YOUR_API_KEYs
const HEILA_API_KEY = process.env.HEILA_KEY; // Key for shapesinc/heilaprotogen
const PLANTO_API_KEY = process.env.PLANTO_KEY; // Key for shapesinc/plantogen
// Add other API keys here as you add more models


// --- Check if at least one API key is available ---
if (!HEILA_API_KEY && !PLANTO_API_KEY) { // Add checks for other keys here
  console.error("FATAL ERROR: No AI API keys found in .env file! AI feature disabled.");
  // You might want to handle this more gracefully in a production app
  // process.exit(1);
} else {
  console.log("AI API keys loaded successfully (at least one found).");
}


// --- Middleware ---
// Serve static files from the 'web' directory (this serves your Agario game)
app.use(express.static("web"));

// Add middleware to parse JSON and URL-encoded request bodies
// This is needed to read the message sent from your frontend to the /ask-heila endpoint
// Keep increased limit for potential Base64 images or other large JSON payloads
app.use(express.json({ limit: '50mb' })); // Increased limit
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Increased limit

// If using multipart/form-data for file uploads, you'll need multer middleware here
// app.use(upload.single('audioFile')); // Assuming the file input name is 'audioFile'


// Add CORS middleware if your frontend is served from a different origin
// app.use(cors());


// --- Basic Chat Filter Function ---
// Set to an empty array to disable filtering
const naughtyWords = []; // <-- Add words to filter here if needed
const replacement = "***"; // <-- What to replace filtered words with

function filterMessage(messageContent) {
    // If the content is an array (multimodal), filter the text part(s)
    if (Array.isArray(messageContent)) {
        return messageContent.map(part => {
            if (part.type === 'text' && part.text && naughtyWords.length > 0) { // Only filter if naughtyWords list is not empty
                let filteredText = part.text;
                 // Escape all special regex characters in the word before creating RegExp
                 naughtyWords.forEach(word => {
                     const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                     const regex = new RegExp(escapedWord, 'gi');
                     filteredText = filteredText.replace(regex, replacement);
                 });
                return { ...part, text: filteredText }; // Return part with filtered text
            }
            return part; // Return non-text parts unchanged (like image_url, audio_url) or text parts if no filtering is needed
        });
    } else if (typeof messageContent === 'string' && naughtyWords.length > 0) { // Only filter if naughtyWords list is not empty
        // If content is a string (for older history or text-only), filter the string
        let filteredMessage = messageContent;
         // Escape all special regex characters in the word before creating RegExp
         naughtyWords.forEach(word => {
             const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
             const regex = new RegExp(escapedWord, 'gi');
             filteredMessage = filteredMessage.replace(regex, replacement);
         });
        return filteredMessage;
    }
    return messageContent; // Return other types of content unchanged or text content if no filtering is needed
}


// --- Heila AI Integration Endpoint ---
// This is a separate endpoint for your frontend to send AI messages to
// If using multipart/form-data, this endpoint might need to be configured with multer middleware
app.post('/ask-heila', async (req, res) => {

  // Expecting the entire conversation history in the 'messages' field
  // This now includes the structured content array for user messages
  // If using file uploads, the structure of req.body might be different
  const conversationHistory = req.body.messages;
  // *** Get the selected model from the request body ***
  const selectedModel = req.body.model || "shapesinc/heilaprotogen"; // Default to heilaprotogen if not provided


  // --- Logic to select the correct API key and model name based on the requested model ---
  let apiKey;
  let modelNameForApi; // Variable to hold the correct model name string for the API call

  if (selectedModel === 'shapesinc/heilaprotogen') {
      apiKey = HEILA_API_KEY; // Use Heila's key
      modelNameForApi = 'shapesinc/heilaprotogen'; // Use Heila's model name
  } else if (selectedModel === 'shapesinc/plantogen') {
      apiKey = PLANTO_API_KEY; // Use Plantogen's key
      modelNameForApi = 'shapesinc/plantogen'; // Use Plantogen's model name
  }
  // Add more else if blocks here for any other models you add to the dropdown
  else {
      // Handle cases where an unknown model is requested, maybe default or send an error
      console.error(`Unknown model requested: ${selectedModel}`);
      return res.status(400).json({ error: `Invalid model specified: ${selectedModel}.` });
  }

  // Check if the required API key is available for the selected model
  if (!apiKey) {
      console.error(`AI request received for ${selectedModel}, but API key is missing.`);
      return res.status(500).json({ error: `AI feature not configured for ${selectedModel} (API key missing).` });
  }


  if (!conversationHistory || conversationHistory.length === 0) {
     console.log("Received empty conversation history.");
     return res.status(400).json({ error: "No messages provided" });
  }

  // *** PLACEHOLDER FOR MP3 FILE HANDLING (if you decide to add it later) ***
  // If the request contains a file upload (e.g., from the "Attach" button for an MP3):
  // ... (Your file handling and public URL generation logic here) ...


  // *** Apply filter to the latest user message content before sending to AI ***
  // Assuming the latest user message is the last one in the array
  const latestUserMessageIndex = conversationHistory.length - 1;
  if (latestUserMessageIndex >= 0 && conversationHistory[latestUserMessageIndex].role === 'user') {
      // Filter the content of the latest user message
      conversationHistory[latestUserMessageIndex].content = filterMessage(conversationHistory[latestUserMessageIndex].content);
  }
  // You might also want to filter previous user messages in history if needed


  // --- Call the External Shapes.inc API ---
  const shapesApiEndpoint = 'https://api.shapes.inc/v1/chat/completions'; // <--- Your API URL
  const requestBody = {
      // *** Use the dynamically determined model name ***
      model: modelNameForApi, // Use the model from the request body

      // Pass the entire conversation history (with structured/filtered content)
      messages: conversationHistory, // <--- Pass the array directly as received

      // ... other parameters like temperature, max_tokens, etc. if required/desired by the API
  };

  try {
    console.log(`Sending request to Shapes API for model: ${modelNameForApi}`);
    // console.log("Request body being sent to Shapes API:", JSON.stringify(requestBody, null, 2)); // Uncomment for detailed debugging

    const apiResponse = await fetch(shapesApiEndpoint, {
      method: 'POST', // Use the correct HTTP method
      headers: {
        'Content-Type': 'application/json', // API expects JSON
        // *** Use the dynamically determined API key ***
        'Authorization': `Bearer ${apiKey}` // Your API key header
      },
      body: JSON.stringify(requestBody) // Send the request body
    });

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      console.error(`Shapes API returned error ${apiResponse.status}: ${errorBody}`);
      return res.status(apiResponse.status).json({ error: `Error from AI API: ${apiResponse.status}`, details: errorBody });
    }

    const aiResponseData = await apiResponse.json();
    // console.log("Received data from Shapes API:", aiResponseData); // Uncomment for detailed debugging

    // Extract the AI's reply content
    let aiReplyContent = '';
    if (aiResponseData.choices && aiResponseData.choices[0] && aiResponseData.choices[0].message && aiResponseData.choices[0].message.content) {
        // The AI's reply content might be a string or an array depending on the API response structure for multimodal replies
        aiReplyContent = aiResponseData.choices[0].message.content;
    } else if (aiResponseData.reply) { // Check for the simpler 'reply' field as seen in previous debugging
         aiReplyContent = aiResponseData.reply;
    } else {
        console.warn("AI response data structure unexpected:", aiResponseData);
        aiReplyContent = "Error: Could not extract AI reply from response.";
    }


    // *** Apply filter to the AI's response content
    // Assuming AI replies are primarily text, filter the string content
    // If AI replies can also be structured (like the input), the filter function needs to handle that
    const filteredAiResponse = filterMessage(aiReplyContent); // Apply filter


    // --- Send the Filtered AI's reply content back to your frontend ---
    // Send the content directly, the frontend addMessage function handles displaying it
    res.json({ reply: filteredAiResponse });

  } catch (error) {
    console.error("Error calling or processing Shapes API response:", error);
    res.status(500).json({ error: "Internal server error contacting AI" });
  }
});


// --- Start the Server ---
// Use process.env.PORT for Glitch's assigned port
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});