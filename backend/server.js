import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import { Groq } from "groq-sdk"; 

import deliveryRoutes from './routes/delivery.routes.jsx';

// import marketplaceRoutes from './routes/marketplace.routes.js';
// import advisoryRoutes from './routes/advisory.routes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// app.use('/api/auth', authRoutes);


app.post("/api/groq", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Invalid or empty messages array" });
    }

    // Initialize Groq client
    const groq = new Groq({ apiKey:"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" });

    // Send message to Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: messages[0].content, // Use the first message in the array
        },
      ],
      model: "llama3-8b-8192", 
    });

  
    res.status(200).json(chatCompletion.choices[0].message.content);
  } catch (error) {
    console.error("Error in Groq API:", error);
    res.status(500).json({ error: "Failed to process the request" });
  }
});


// app.use('/api/marketplace', marketplaceRoutes);
// app.use('/api/advisory', advisoryRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));


  
app.get("/", (req,res) => {
  res.send('welcome to agro backend')
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
