import { Router } from "express";
import { successResponse } from "../../common/utils/success.respose.js";
import {
  createNote,
  deleteAllUserNotes,
  deleteNote,
  getNoteByContent,
  getNoteById,
  getNotesAggregate,
  getNotesWithUser,
  getPaginatedSortedNotes,
  replaceNote,
  updateAllNotesTitle,
  updateNote,
} from "./note.service.js";

const router = Router();
router.post("/", async (req, res, next) => {
  try {
    const { userId } = req.query;
    const result = await createNote(userId, req.body);
    return successResponse({
      res,
      status: 201,
      message: "Note created",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});
router.patch("/all", async (req, res, next) => {
  try {
    const { userId } = req.query;
    const { title } = req.body;
    const result = await updateAllNotesTitle(userId, title);
    if (result.error) {
      return res.status(result.status).json({ message: result.message });
    }
    return successResponse({
      res,
      status: 200,
      message: "All notes updated",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});
router.get("/note-by-content", async (req, res, next) => {
  try {
    const { userId, content } = req.query;
    const result = await getNoteByContent(userId, content);

    if (result.error) {
      return res.status(result.status).json({ message: result.message });
    }

    return successResponse({
      res,
      status: 200,
      message: "Done",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});
router.get("/note-with-user", async (req, res, next) => {
  try {
    const { userId } = req.query;

    const result = await getNotesWithUser(userId);

    return successResponse({
      res,
      status: 200,
      message: "Done",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});
router.get("/aggregate", async (req, res, next) => {
  try {
    const { userId, title } = req.query;

    const result = await getNotesAggregate(userId, title);

    return successResponse({
      res,
      status: 200,
      message: "Done",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});
router.patch("/:noteId", async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const { userId } = req.query;

    const result = await updateNote(noteId, userId, req.body);

    if (result.error) {
      return res.status(result.status).json({ message: result.message });
    }

    return successResponse({
      res,
      status: 200,
      message: "updated",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});
router.put("/replace/:noteId", async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const { userId } = req.query;
    const newNoteData = req.body;

    const result = await replaceNote(noteId, userId, newNoteData);

    if (result.error) {
      return res.status(result.status).json({ message: result.message });
    }

    return successResponse({
      res,
      status: 200,
      message: "updated",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:noteId", async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const { userId } = req.query;

    const result = await deleteNote(noteId, userId);

    if (result.error) {
      return res.status(result.status).json({ message: result.message });
    }

    return successResponse({
      res,
      status: 200,
      message: "deleted",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/paginate-sort", async (req, res, next) => {
  try {
    const result = await getPaginatedSortedNotes(req.query);

    return successResponse({
      res,
      status: 200,
      message: "Done",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    const result = await getNoteById(id, userId);

    if (result.error) {
      return res.status(result.status).json({ message: result.message });
    }

    return successResponse({
      res,
      status: 200,
      message: "Done",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});
router.delete("/", async (req, res, next) => {
  try {
    const { userId } = req.query;
    await deleteAllUserNotes(userId);

    return successResponse({
      res,
      status: 200,
      message: "Deleted",
    });
  } catch (error) {
    next(error);
  }
});
export default router;
