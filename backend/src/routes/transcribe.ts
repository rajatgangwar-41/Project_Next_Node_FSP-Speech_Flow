import multer from "multer";
import { Router } from "express";
import { requireAuth, getAuth } from "@clerk/express";
import { convex, api } from "../utils/convexClient.js";
import { extractTranscript } from "../utils/deepgram.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/transcribe
router.post("/", requireAuth(), upload.single("file"), async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized - no user ID found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No audio file uploaded",
      });
    }

    // ── Deepgram transcription ───────────────────────────────────────
    const transcript = await extractTranscript(req.file.buffer);

    const title = `Audio: ${req.file.originalname.slice(0, 35)}${
      req.file.originalname.length > 35 ? "...`" : ""
    }`;

    // ── Save to Convex ───────────────────────────────────────────────
    const transcriptId = await convex.mutation(
      api.private.transcriptions.createTranscription,
      {
        clerkId: userId,
        text: transcript,
        title,
      },
    );

    if (!transcriptId) {
      throw new Error("Failed to create the transcription");
    }

    const item = {
      id: transcriptId,
      createdAt: new Date().toISOString(),
      text: transcript,
      title,
    };

    // ── Consistent response shape ────────────────────────────────────
    return res.status(201).json({
      success: true,
      item,
    });
  } catch (err: any) {
    console.error("[POST /transcribe] Error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Transcription processing failed",
    });
  }
});

// GET /api/transcribe
router.get("/", requireAuth(), async (req: any, res: any) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized - please sign in",
      });
    }

    // Query only this user's transcriptions
    const transcriptions = await convex.query(
      api.private.transcriptions.getUserTranscriptions,
      {
        clerkId: userId,
      },
    );

    const item = transcriptions.map((transcription: any) => ({
      id: transcription._id,
      createdAt: transcription._creationTime,
      text: transcription.text || "",
      title: transcription.title || undefined,
    }));

    return res.json({
      success: true,
      item,
    });
  } catch (err: any) {
    console.error("[GET /transcribe] Error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to load transcription history",
    });
  }
});

export default router;
