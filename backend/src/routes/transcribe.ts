import multer from "multer";
import { Router } from "express";
import { convex, api } from "../utils/convexClient.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/transcribe
router.post("/", upload.single("file"), async (req, res) => {
  console.log("Transcribe Request-------------------------");
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    // Here you would call your actual transcription service (Whisper, Deep gram, etc.)
    // For demo: fake transcription
    const fakeText = `This is a simulated transcription of the uploaded audio.
      File name: ${req.file.originalname}
      Size: ${(req.file.size / 1024).toFixed(1)} KB
      Date: ${new Date().toISOString()}`;

    // Store in Convex
    const id = await convex.mutation(
      api.transcriptions.createTranscription.create,
      {
        text: fakeText,
        // audioUrl: if you upload to Convex storage
        title: `Audio ${req.file.originalname.slice(0, 20)}...`,
      },
    );

    res.json({
      success: true,
      transcription: fakeText,
      id,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Transcription failed" });
  }
});

export default router;
