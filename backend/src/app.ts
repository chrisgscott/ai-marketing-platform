import express from "express";
import cors from "cors";
import { generateClientAvatar, generateUSP } from "./services/openai";
import {
  saveClientAvatar,
  getClientAvatar,
  getUserAvatars,
  saveUSP,
  connectToDatabase,
  getUSP,
} from "./services/database";
import { registerUser, loginUser } from './services/auth';
import { authMiddleware, AuthRequest } from './middleware/auth';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

connectToDatabase()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error: Error) => {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  });

app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await registerUser(email, password);
    res.status(201).json({ message: 'User registered successfully', userId: user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await loginUser(email, password);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.post("/api/client-avatar", authMiddleware, async (req: AuthRequest, res) => {
  const { businessType, targetAudience, keyProblems, desiredOutcomes } = req.body;
  const userId = req.user!.userId;

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
      generatedAvatar,
    };

    const avatarId = await saveClientAvatar(userId, avatarData);

    res.json({ ...avatarData, id: avatarId });
  } catch (error) {
    console.error("Error generating client avatar:", error);
    res.status(500).json({ error: "Failed to generate client avatar" });
  }
});

app.post("/api/usp", authMiddleware, async (req: AuthRequest, res) => {
  const {
    businessName,
    productService,
    targetAudience,
    keyBenefits,
    competitors,
  } = req.body;
  const userId = req.user!.userId;

  try {
    const clientAvatars = await getUserAvatars(userId);

    const MAX_AVATARS = 3;

    let avatarContext = "";
    if (clientAvatars.length > 0) {
      const selectedAvatars = clientAvatars.slice(0, MAX_AVATARS);
      avatarContext =
        "Additional context from previously generated client avatars:\n" +
        selectedAvatars
          .map(
            (avatar: any) => `
      Business Type: ${avatar.businessType}
      Target Audience: ${avatar.targetAudience}
      Key Problems: ${avatar.keyProblems}
      Desired Outcomes: ${avatar.desiredOutcomes}
      Generated Avatar: ${avatar.generatedAvatar}
    `
          )
          .join("\n\n");

      if (clientAvatars.length > MAX_AVATARS) {
        avatarContext += `\n\nNote: ${
          clientAvatars.length - MAX_AVATARS
        } additional avatar(s) not shown.`;
      }
    } else {
      avatarContext = "No previous client avatars available.";
    }

    const prompt = `
        Create a Unique Selling Proposition (USP) for the following business:
        Business Name: ${businessName}
        Product/Service: ${productService}
        Target Audience: ${targetAudience}
        Key Benefits: ${keyBenefits}
        Competitors: ${competitors}
  
        ${avatarContext}
  
        Based on this information, generate a compelling and unique USP that:
        1. Clearly communicates the main benefit of the product/service
        2. Differentiates the business from competitors
        3. Resonates with the target audience
        4. Is concise and memorable (preferably one sentence)
  
        ${
          clientAvatars.length > 0
            ? "Also, provide a brief explanation of how this USP relates to the client avatars and overall business strategy."
            : ""
        }
      `;

    const generatedUSP = await generateUSP(prompt);

    const uspData = {
      userId,
      businessName,
      productService,
      targetAudience,
      keyBenefits,
      competitors,
      generatedUSP,
      basedOnAvatars: clientAvatars.length > 0,
    };

    const uspId = await saveUSP(userId, uspData);

    res.json({ ...uspData, id: uspId });
  } catch (error) {
    console.error("Error generating USP:", error);
    res.status(500).json({ error: "Failed to generate USP" });
  }
});

app.get("/api/client-avatar/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const avatar = await getClientAvatar(req.params.id);
    if (avatar) {
      if (avatar.userId === req.user!.userId) {
        res.json(avatar);
      } else {
        res.status(403).json({ error: "Access denied" });
      }
    } else {
      res.status(404).json({ error: "Avatar not found" });
    }
  } catch (error) {
    console.error("Error fetching client avatar:", error);
    res.status(500).json({ error: "Failed to fetch client avatar" });
  }
});

app.get("/api/user/avatars", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const avatars = await getUserAvatars(req.user!.userId);
    res.json(avatars);
  } catch (error) {
    console.error("Error fetching user avatars:", error);
    res.status(500).json({ error: "Failed to fetch user avatars" });
  }
});

app.get("/api/usp/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const usp = await getUSP(req.params.id);
    if (usp) {
      if (usp.userId === req.user!.userId) {
        res.json(usp);
      } else {
        res.status(403).json({ error: "Access denied" });
      }
    } else {
      res.status(404).json({ error: "USP not found" });
    }
  } catch (error) {
    console.error("Error fetching USP:", error);
    res.status(500).json({ error: "Failed to fetch USP" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});