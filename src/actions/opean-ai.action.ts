"use server";
import OpenAI from "openai";
import { Transcription } from "openai/resources/audio/transcriptions.mjs";

const openai = new OpenAI();

export async function getSpeechToText(form?: FormData) {
  console.log("getSpeechToText", form);
  const file = form?.get("file");
  console.log("file", file);
  if (!file) {
    return;
  }
  const transcription = await openai.audio.transcriptions.create({
    // @ts-ignore
    file: file,
    model: "whisper-1",
    response_format: "text",
  });

  return await getTextToText(transcription);
}

async function getTextToText(transcription: Transcription) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "Tu trabajo es resumir en español, de un texto dado, lo que es importante para una lista de la compra. Este texto viene sucio ya que es una transcripción de un audio. Resume en ítems que es lo que el usuario quiere anotar para comprar.",
      },
      { role: "user", content: transcription as unknown as string },
    ],
    model: "gpt-4o-mini",
  });
  return completion.choices[0].message.content;
}
