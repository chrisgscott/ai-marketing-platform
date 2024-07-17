import express from 'express';
import cors from 'cors';
import { generateClientAvatar } from './services/openai';
import { saveClientAvatar, getClientAvatar, getUserAvatars, connectToDatabase } from './services/database';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Connect to the database when the server starts
connectToDatabase().then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Failed to connect to MongoDB', error);
  process.exit(1);
});

app.post('/api/client-avatar', async (req, res) => {
  const { userId, businessType, targetAudience, keyProblems, desiredOutcomes } = req.body;

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

    const avatarData = {
      userId,
      businessType,
      targetAudience,
      keyProblems,
      desiredOutcomes,
      generatedAvatar
    };

    const avatarId = await saveClientAvatar(userId, avatarData);

    res.json({ ...avatarData, id: avatarId });
  } catch (error) {
    console.error('Error generating client avatar:', error);
    res.status(500).json({ error: 'Failed to generate client avatar' });
  }
});

app.get('/api/client-avatar/:id', async (req, res) => {
  try {
    const avatar = await getClientAvatar(req.params.id);
    if (avatar) {
      res.json(avatar);
    } else {
      res.status(404).json({ error: 'Avatar not found' });
    }
  } catch (error) {
    console.error('Error fetching client avatar:', error);
    res.status(500).json({ error: 'Failed to fetch client avatar' });
  }
});

app.get('/api/user/:userId/avatars', async (req, res) => {
  try {
    const avatars = await getUserAvatars(req.params.userId);
    res.json(avatars);
  } catch (error) {
    console.error('Error fetching user avatars:', error);
    res.status(500).json({ error: 'Failed to fetch user avatars' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});