// src/models/Note.ts
import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  content: String,
  userId: mongoose.Schema.Types.ObjectId,
});

export default mongoose.model('Note', noteSchema);
