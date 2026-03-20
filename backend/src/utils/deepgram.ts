import { DeepgramClient } from "@deepgram/sdk";

const deepgramClient = new DeepgramClient();

export async function extractTranscript(fileBuffer: Buffer<ArrayBufferLike>) {
  const dgResponse = await deepgramClient.listen.v1.media.transcribeFile(
    fileBuffer,
    {
      model: "nova-3",
      smart_format: true,
      // punctuate: true,
      // utterances: true,
    },
  );

  if ("results" in dgResponse) {
    const { results } = dgResponse;

    if (results.channels?.[0]?.alternatives?.[0]?.transcript) {
      return results.channels[0].alternatives[0].transcript.trim();
    }

    if (results.utterances?.length) {
      return results.utterances
        .map((u) => u.transcript?.trim() || "")
        .filter(Boolean)
        .join(" ");
    }
  }

  return "";
}
