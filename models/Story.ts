import mongoose, { Schema, Document } from "mongoose";
export interface IStory extends Document {
  story_id: number;
  book_based_story: string;
  plot: string;
  story_telling_inspiration: string;
}

const StorySchema: Schema = new Schema(
  {
    story_id: { type: Number, required: true, unique: true },
    book_based_story: { type: String, required: true },
    plot: { type: String, required: true },
    story_telling_inspiration: { type: String, required: true },
  },
  { timestamps: true }
);

StorySchema.pre<IStory>("save", async function (next) {
  try {
    if (this.isNew) {
      const modelName = (this.constructor as mongoose.Model<IStory>).modelName;
      const model = mongoose.model<IStory>(modelName);

      const lastDoc = await model.findOne().sort({ story_id: -1 }).exec();

      this.story_id = lastDoc && lastDoc.story_id ? lastDoc.story_id + 1 : 1;
    }
    next();
  } catch (error) {
    console.error("Error in auto-increment hook:", error);
    next(error as Error);
  }
});

const Story =
  mongoose.models.Story || mongoose.model<IStory>("Story", StorySchema);

export default Story;
