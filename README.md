# 🎙️ Speech-to-Text Transcription App (MERN Stack)

## 📌 Project Overview

This project allows users to:

- 🎤 Record audio or upload audio files
- 🔊 Convert audio into text using a Speech-to-Text API
- 💾 Store and retrieve transcriptions from a database

Built using the **CERN stack (Convex, Express, React, Node.js)** with modern tools like Tailwind CSS and Clerk Auth.

---

## 🚀 Tech Stack

### Frontend

- Next.js
- Tailwind CSS
- Shadcn UI
- Fetch API
- MediaRecorder API

### Backend

- Node.js
- Express.js
- Multer (file uploads)
- Clerk (Auth)

### Database

- Convex DB

### Speech-to-Text API

- Deepgram

---

## ⚙️ Features

- 🎤 Record audio directly from browser
- 📁 Upload audio files (WAV, MP3, etc.)
- 🔄 Convert speech → text
- ⏳ Loading states while processing
- 💾 Save transcriptions to DB
- 📜 View transcription history
- ❌ Error handling & validation
- 🔐 Authentication

---

## 📂 Project Structure

```
project-root/
│
├── frontend/          # Next frontend
│   ├── src/app/
│        └── page.tsx
│
├── backend/          # Express backend
│   ├── src/
│       ├──routes/
│       └── server.ts
│
└── README.md
```

---

## 🛠️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/rajatgangwar-41/Project_Next_Node_FSP-Speech_Flow
cd Project_Next_Node_FSP-Speech_Flow
```

---

### 2️⃣ Frontend Setup (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

---

### 3️⃣ Backend Setup (Node + Express)

```bash
cd backend
npm install
```

Start server:

```bash
npm run dev
```

---

### 4️⃣ Environment Variables (.env)

```env
PORT=4000

CONVEX_DEPLOYMENT="xyz"
CONVEX_URL="xyz"
CONVEX_SITE_URL="xyz"

CLERK_SECRET_KEY="xyz"
CLERK_PUBLISHABLE_KEY="xyz"
CLERK_WEBHOOK_SECRET="xyz"

DEEPGRAM_API_KEY="xyz"
```

---

## 🎧 API Integration (Example: OpenAI Whisper)

### Backend Route Example

```js
import express from "express";
import multer from "multer";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    const filePath = req.file.path;

    const response = await deepgram(
      "https://api.openai.com/v1/audio/transcriptions",
      fs.createReadStream(filePath),
    );

    res.json({ text: response.data.text });
  } catch (error) {
    res.status(500).json({ error: "Transcription failed" });
  }
});
```

---

## 🎨 Frontend Features

### UI Includes:

- 📁 File Upload Button
- 🎤 Record Audio Button (MediaRecorder)
- 📜 Transcription Display Section
- ⏳ Loading Indicator

---

## 🔗 Connecting Frontend & Backend

```js
const formData = new FormData();
formData.append("audio", file);

const response = await fetch("/api/transcribe", {
  method: "POST",
  body: formData,
});
setTranscript(response.data.text);
```

## 📦 Saving & Fetching Data

- Save transcription after API response
- Fetch all previous records
- Display in UI (cards/list view)

---

## 🎨 UI Enhancements

- ✨ Tailwind styling
- 🧾 Card-based history view
- 🎬 Animations (hover, loading)
- 📱 Responsive design

---

## ⚠️ Error Handling

- Invalid file types
- API failures
- Empty recordings
- Network issues

Example:

```js
if (!file) {
  return alert("Please upload an audio file");
}
```

---

## 🔐 Authentication

- Clerk / JWT
- User-specific transcription history
- Secure API routes

---

## 🚀 Deployment

### Backend

- Render
- Ensure environment variables are set

### Frontend

- Vercel

---

## 🧪 Testing Checklist

- ✅ File upload works
- ✅ Recording works
- ✅ API returns transcription
- ✅ Data saved in DB
- ✅ History loads correctly
- ✅ Error cases handled

---

## 📘 Future Improvements

- 🌍 Multi-language transcription
- 🧠 AI summarization of transcripts
- 🔍 Search in transcripts
- 📥 Export to PDF/Doc
- 🔊 Real-time transcription

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch
3. Make changes
4. Submit PR

---

## 📄 License

This project is licensed under the MIT License.

---

## 💡 Conclusion

This project demonstrates:

- Full-stack development (MERN)
- API integration
- File handling
- Real-world feature building

Perfect for learning and showcasing in interviews 🚀
