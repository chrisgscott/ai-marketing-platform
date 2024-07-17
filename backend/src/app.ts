import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/client-avatar', (req, res) => {
    console.log('Received request for client avatar');
    console.log('Request body:', req.body);
  
    const { businessType, targetAudience, keyProblems, desiredOutcomes } = req.body;
  
    // For now, we'll just echo back the data
    // In the future, we'll process this with AI
    const clientAvatar = {
      businessType,
      targetAudience,
      keyProblems,
      desiredOutcomes,
      generatedDescription: `A client for a ${businessType} business who ${targetAudience}. They face problems such as ${keyProblems} and desire outcomes like ${desiredOutcomes}.`
    };
  
    console.log('Sending response:', clientAvatar);
    res.json(clientAvatar);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});