/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// -----------------Section: Handle OpenAPI API requests ----------------- //

// firebase-functions is the Firebase SDK module for writing functions.
const functions = require("firebase-functions");
// axios is a library for making HTTP requests.
const axios = require("axios");
// Automatically adds the necessary CORS headers to the response.
// Allows requests from any origin.
const cors = require("cors")({origin: true});
// provides tools for parameterized configuration in Firebase function
const { defineSecret } = require('firebase-functions/params');
// creating a reference to a secret named OPENAI_API_KEY. 
// This secret will be stored securely in Google Cloud's Secret Manager.
const openaiApiKey = defineSecret('OPENAI_API_KEY');

// Initialize Firebase Admin SDK
const admin = require('firebase-admin');
// Initialize Firebase Admin SDK
admin.initializeApp();

require('dotenv').config();

// On local, reference storage emulator instead of prod storage
if (process.env.FUNCTIONS_EMULATOR) {
  console.log("Using Emulator for Functions and Storage...");

  process.env.FIREBASE_STORAGE_EMULATOR_HOST = process.env.STORAGE_EMULATOR_HOST;
  process.env.FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST;
  process.env.FIREBASE_AUTH_EMULATOR_HOST = process.env.AUTH_EMULATOR_HOST;

  admin.firestore().settings({
      host: process.env.FIRESTORE_EMULATOR_HOST,
      ssl: false,
  });
} else {
  console.log("Using Production Firebase Storage...");
}

console.log("Storage Host:", process.env.FIREBASE_STORAGE_EMULATOR_HOST);

// -----------------Section: Use Cloud function for OpenAPI api call (so I send my secret key via cloud securely) ----------------- //
exports.fetchOpenAIResponse = functions.https.onRequest(
    { secrets: [openaiApiKey] },
    (req, res) => {
      cors(req, res, async () => {
        try {
          const apiKey = openaiApiKey.value();
          const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            req.body,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
              },
            }
          );
          res.status(200).send(response.data);
        } catch (error) {
          console.error('Error calling OpenAI:', error.response ? error.response.data : error.message);
          res.status(500).send({ error: error.response ? error.response.data : error.message });
        }
      });
    }
  );


// -----------------Section: Use Cloud function to proxy a storage file, to send to OpenAI (adds clear file extension, eliminates temp tokens that confuse API) ----------------- //


// Proxy Cloud Function
exports.getImageProxy = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      // Extract the file path from the query parameter
      const filePath = req.query.path; // e.g., "art/3"
      if (!filePath) {
        res.status(400).send('Missing file path parameter.');
        return;
      }

      // Reference the file in Firebase Storage
      const bucket = admin.storage().bucket();
      const file = bucket.file(filePath);
      console.log(`Attempting to fetch file from path: ${filePath}`);

      // Fetch metadata to determine Content-Type
      try {
        const [metadata] = await file.getMetadata();
        console.log("File metadata retrieved successfully:", metadata);
      } catch (error) {
          console.error("Failed to retrieve file metadata:", error);
          res.status(404).send("File not found.");
          return;
      }
      const contentType = metadata.contentType || 'image/jpeg';
      console.log(metadata.contentType);

      // Set headers
      res.setHeader('Content-Type', contentType);

      // Stream the file content directly to the response
      try {
        const fileStream = file.createReadStream();
        fileStream.pipe(res);
      } catch (error) {
          console.error("Error creating file stream:", error);
          res.status(500).send("Error fetching file content.");
          return;
      }

      // Handle stream errors
      fileStream.on('error', (error) => {
        console.error('Error streaming file:', error);
        res.status(500).send('Error streaming file');
      });
    } catch (error) {
      console.error('Error fetching file:', error);
      res.status(500).send('Error fetching file');
    }
  });
});