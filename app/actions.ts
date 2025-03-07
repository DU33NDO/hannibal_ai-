"use server";

import { generateText } from "ai";
import OpenAI from "openai";
import { openai as aiSdkOpenai } from "@ai-sdk/openai";
import dbConnect from "../lib/mongodb";
import Story from "../models/Story";

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function summarizePlot(storyText: string): Promise<string> {
  try {
    const { text } = await generateText({
      model: aiSdkOpenai("gpt-4o"),
      prompt: `Summarize the following story into a single concise sentence that captures its essence and main plot points:
      
      ${storyText}`,
      maxTokens: 100,
    });

    return text.trim();
  } catch (error) {
    console.error("Error summarizing plot:", error);
    return "A mysterious tale of suspense and psychological intrigue.";
  }
}

async function isPlotDuplicate(plotSummary: string): Promise<boolean> {
  try {
    await dbConnect();

    const existingStories = await Story.find({}, "plot");

    if (existingStories.length === 0) {
      return false;
    }

    for (const story of existingStories) {
      try {
        const { text } = await generateText({
          model: aiSdkOpenai("gpt-4o"),
          prompt: `Compare these two plot summaries and determine if they are essentially telling the same story with different words. Answer only with "yes" if they are similar or "no" if they are different:
          
          Plot 1: ${plotSummary}
          Plot 2: ${story.plot}`,
          maxTokens: 10,
        });

        if (text.trim().toLowerCase() === "yes") {
          return true;
        }
      } catch (error) {
        console.error("Error checking plot similarity:", error);
      }
    }
  } catch (error) {
    console.error("Database error in isPlotDuplicate:", error);
  }

  return false;
}

export async function generateStory(
  quote: string,
  bookBasedStory?: string,
  storyTellingInspiration?: string
) {
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
    await dbConnect();

    let existingPlots: string[] = [];
    try {
      const existingStories = await Story.find({}, "plot");
      existingPlots = existingStories.map((story) => story.plot);
    } catch (error) {
      console.error("Error fetching existing stories:", error);
    }

    const bookBased = bookBasedStory || "";

    const inspiration = storyTellingInspiration || "Hannibal Lecter";

    const prompt = `
  You are writing a disturbing short story in the style of ${inspiration} in Russian Language.
  The story should be inspired by this quote: "${quote}"
  ${
    bookBased
      ? `This story should incorporate elements from this book or text: "${bookBased}"`
      : ""
  }
  You are writing a dark psychological thriller in Russian, inspired by the writing style of ${inspiration}. 
Craft a gripping, unsettling short story based on this quote: 

"${quote}"

The story should evolve dynamically, featuring a clear beginning, development, climax, and resolution. Avoid keeping the story stuck in a single moment or scene—ensure that significant events unfold, leading to new discoveries, conflicts, and emotional shifts.

Character development and internal struggles should be central. Dive deeply into their thoughts, emotions, and the hidden fears that drive them forward. The narrative should feel fluid, where each paragraph pushes the story forward rather than repeating the same tension.

Consider the following **three acts** structure:
1. **Introduction & Setup:** Establish the protagonist, their initial state, and a mysterious or unsettling event.
2. **Development & Conflict:** Escalate the tension with unexpected twists, moral dilemmas, and deepening character psychology.
3. **Climax & Resolution:** Deliver a shocking or psychologically intense turning point, followed by a haunting or thought-provoking conclusion.

This story is set in a dark, enigmatic atmosphere. Let it be both beautifully artistic and deeply disturbing.

Avoid repetition of previous storylines and ensure that each generated story is **completely unique**. Here is the ongoing backstory:

Sasha, an FBI agent secretly fascinated by the infamous Hannibal Lecter, struggles with her dual life—outwardly dedicated to justice, yet secretly aiding his crimes. The only person she can confide in is German, her psychologist. However, German himself is a serial killer, posing as a therapist to find his next victims. He is precise, cold, and observant—until Sasha enters his life. He falls obsessively in love with her, unable to decide whether to kill her or prolong their sessions, leading to an intense psychological battle.

This time, take the story in a **new direction.** Change the circumstances, challenge the characters with new dilemmas, introduce a significant event that forces their dynamic to shift. Push the limits of suspense and psychological depth.

Keep the story within 400 words, maintaining a refined yet chilling tone. Write in Russian. Do not include introductory explanations—just
 
  
  ${
    existingPlots.length > 0
      ? `Avoid plots similar to any of these existing story plots:
  ${existingPlots.join("\n")}`
      : ""
  }
    `;

    const { text } = await generateText({
      model: aiSdkOpenai("gpt-4o"),
      prompt,
      maxTokens: 400,
    });

    const fullStory = text.trim();

    const plotSummary = await summarizePlot(fullStory);

    const isDuplicate = await isPlotDuplicate(plotSummary);

    if (isDuplicate) {
      return generateStory(
        quote + " Make the story completely unique.",
        bookBasedStory,
        storyTellingInspiration
      );
    }

    try {
      const storyCount = await Story.countDocuments();

      const newStory = new Story({
        story_id: storyCount + 1,
        book_based_story: bookBased || fullStory,
        plot: plotSummary,
        story_telling_inspiration: inspiration,
      });

      await newStory.save();

      const sentences = fullStory.split(/(?<=[.!?])\s+/);
      const chunkSize = Math.ceil(sentences.length / 10);
      const storyParts = Array.from({ length: 10 }, (_, i) =>
        sentences.slice(i * chunkSize, (i + 1) * chunkSize).join(" ")
      );

      return {
        success: true,
        storyParts,
        storyId: newStory.story_id,
        plot: plotSummary,
      };
    } catch (error) {
      console.error("Error saving story to database:", error);

      const sentences = fullStory.split(/(?<=[.!?])\s+/);
      const chunkSize = Math.ceil(sentences.length / 10);
      const storyParts = Array.from({ length: 10 }, (_, i) =>
        sentences.slice(i * chunkSize, (i + 1) * chunkSize).join(" ")
      );

      return {
        success: true,
        storyParts,
        plot: plotSummary,
        dbError: "Story generated but not saved to database",
      };
    }
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

export async function getAllStories() {
  try {
    await dbConnect();
    const stories = await Story.find({}).sort({ story_id: -1 });
    return { success: true, stories };
  } catch (error) {
    console.error("Error retrieving stories:", error);
    return { success: false, stories: [] };
  }
}

export async function getStoryById(storyId: number) {
  try {
    await dbConnect();
    const story = await Story.findOne({ story_id: storyId });

    if (!story) {
      return { success: false, story: null, message: "Story not found" };
    }

    return { success: true, story };
  } catch (error) {
    console.error(`Error retrieving story #${storyId}:`, error);
    return { success: false, story: null, message: "Error retrieving story" };
  }
}
