import mongoose from "mongoose";
import { NoteModel } from "../../DB/model/note.model.js";

export const createNote = async (userId, noteData) => {
  const note = await NoteModel.create({
    ...noteData,
    userId,
  });

  return { error: false, data: note };
};

export const updateNote = async (noteId, userId, noteData) => {
  const note = await NoteModel.findById(noteId);
  if (!note) {
    return { error: true, status: 404, message: "Note not found" };
  }

  if (note.userId.toString() !== userId) {
    return { error: true, status: 403, message: "You are not the owner" };
  }

  const updatedNote = await NoteModel.findByIdAndUpdate(
    noteId,
    { $set: noteData },
    { new: true, runValidators: true },
  );

  return { error: false, data: updatedNote };
};

export const replaceNote = async (noteId, userId, newNoteData) => {
  const note = await NoteModel.findById(noteId);

  if (!note) {
    return { error: true, status: 404, message: "Note not found" };
  }

  if (note.userId.toString() !== userId) {
    return { error: true, status: 403, message: "You are not the owner" };
  }

  const replacedNote = await NoteModel.findOneAndReplace(
    { _id: noteId },
    { ...newNoteData, userId },
    { new: true, runValidators: true },
  );

  return { error: false, data: replacedNote };
};
export const updateAllNotesTitle = async (userId, title) => {
  const result = await NoteModel.updateMany({ userId }, { $set: { title } });

  if (result.matchedCount === 0) {
    return { error: true, status: 404, message: "No note found" };
  }

  return { error: false, data: result };
};
export const deleteNote = async (noteId, userId) => {
  const note = await NoteModel.findById(noteId);

  if (!note) {
    return { error: true, status: 404, message: "Note not found" };
  }
  if (note.userId.toString() !== userId) {
    return { error: true, status: 403, message: "You are not the owner" };
  }

  const deletedNote = await NoteModel.findByIdAndDelete(noteId);

  return { error: false, data: deletedNote };
};
export const getPaginatedSortedNotes = async (query) => {
  const { userId, page = 1, limit = 3 } = query;

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 3;
  const skip = (pageNum - 1) * limitNum;

  const notes = await NoteModel.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  return { error: false, data: notes };
};
export const getNoteById = async (noteId, userId) => {
  const note = await NoteModel.findById(noteId);

  if (!note) {
    return { error: true, status: 404, message: "Note not found" };
  }

  if (note.userId.toString() !== userId) {
    return { error: true, status: 403, message: "You are not the owner" };
  }

  return { error: false, data: note };
};
export const getNoteByContent = async (userId, content) => {
  const note = await NoteModel.findOne({
    userId,
    content: { $regex: content, $options: "i" },
  });

  if (!note) {
    return { error: true, status: 404, message: "No note found" };
  }

  return { error: false, data: note };
};
export const getNotesWithUser = async (userId) => {
  const notes = await NoteModel.find({
    userId: new mongoose.Types.ObjectId(userId),
  })
    .select("title userId createdAt")
    .populate({
      path: "userId",
      select: "email -_id",
    });

  return { error: false, data: notes };
};

export const getNotesAggregate = async (userId, title) => {
  const matchCondition = {
    userId: new mongoose.Types.ObjectId(userId),
  };

  if (title) {
    matchCondition.title = { $regex: title, $options: "i" };
  }

  const notes = await NoteModel.aggregate([
    { $match: matchCondition },

    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },

    { $unwind: "$user" },

    {
      $project: {
        _id: 0,
        title: 1,
        userId: 1,
        createdAt: 1,
        "user.name": 1,
        "user.email": 1,
      },
    },
  ]);

  return { error: false, data: notes };
};
export const deleteAllUserNotes = async (userId) => {
  const result = await NoteModel.deleteMany({ userId });

  return { error: false, data: result };
};
