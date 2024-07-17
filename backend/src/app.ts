import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateClientAvatar } from './services/openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/client-avatar', async (req, res) => {
  const { businessType, targetAudience, keyProblems, desiredOutcomes } = req.body;

  const prompt = `Create a detailed client avatar for a ${businessType} business. 
  Target Audience: ${targetAudience}
  Key Problems: ${keyProblems}
  Desired Outcomes: ${desiredOutcomes}
  
  Please provide a comprehensive client avatar including:
  1. Demographic details
  2. Psychographic characteristics
  3. Goals and aspirations
  4. Pain points and challenges
  5. Preferred communication channels
  6. Decision-making factors
  7. A day in their life`;

  try {
    const generatedAvatar = await generateClientAvatar(prompt);

    const response = {
      businessType,
      targetAudience,
      keyProblems,
      desiredOutcomes,
      generatedAvatar
    };

    res.json(response);
  } catch (error) {
    console.error('Error generating client avatar:', error);
    res.status(500).json({ error: 'Failed to generate client avatar' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});