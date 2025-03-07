"use server";

import { generateText } from "ai";
import OpenAI from "openai";
import { openai as aiSdkOpenai } from "@ai-sdk/openai";

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateStory(quote: string) {
  if (!quote || typeof quote !== "string") {
    return {
      success: false,
      storyParts: ["Invalid input provided."],
    };
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error("Missing OpenAI API key in environment variables");
    return {
      success: false,
      storyParts: ["Configuration error. Please contact the administrator."],
    };
  }

  try {
    const prompt = `
  You are writing a disturbing short story in the style of Hannibal Lecter.
  The story should be inspired by this quote: "${quote}"
  Make it elegantly unsettling, sophisticated yet deeply menacing.
  Keep it within 200 words, maintaining a refined but chilling tone.
  Do not include any introductory text or quotation marks. Just provide the raw story text.
  Write in Russian language. Here is the backstory: Sasha-agent of the FBI, secretly an admirer
  of Hannibal, tries to help him in every possible way with his crimes, outwardly sociable and 
  friendly, shares Hannibal's ideas and dreams of meeting him. She leads a double life and
  therefore suffers from the fact that she can not tell anyone but German, because she came 
  to him for a session of psychology. German is a serial killer hiding under the disguise of
  a psychologist. He secretly kills his clients, cold but pragmatic, notices small details,
  is closed in himself, but after Sasha comes to the session, falls in love with her and
  can't decide to kill her, tries in every possible way to prolong the sessions with her 
  and begins to show that he is madly in love with her.
    `;

    const { text } = await generateText({
      model: aiSdkOpenai("gpt-4o"),
      prompt,
      maxTokens: 400,
    });

    const fullStory = text.trim();

    const sentences = fullStory.split(/(?<=[.!?])\s+/);
    const chunkSize = Math.ceil(sentences.length / 10);
    const storyParts = Array.from({ length: 10 }, (_, i) =>
      sentences.slice(i * chunkSize, (i + 1) * chunkSize).join(" ")
    );

    return { success: true, storyParts };
  } catch (error) {
    console.error("Error generating story:", error);
    return {
      success: false,
      storyParts: [
        "The whispers grow louder as the darkness deepens. Soon, you'll understand the meaning behind these words. Soon, you'll see what lies beneath the surface.",
      ],
    };
  }
}
