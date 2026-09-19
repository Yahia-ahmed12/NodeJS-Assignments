import { Router } from "express";
import {
  createBooksCollection,
  createBooksTitleIndex,
  deleteBooksBeforeYear,
  getBookByTitle,
  getBooksAggregate1,
  getBooksAggregate2,
  getBooksAggregate3,
  getBooksAggregate4,
  getBooksBetweenYears,
  getBooksByGenre,
  getBooksExcludingGenres,
  getBooksWithYearAsInteger,
  getPaginatedBooks,
  insertBook,
  insertManyBooks,
  updateBookYearByTitle,
} from "./book.service.js";
import { successResponse } from "../../common/utils/success.respose.js";

const router = Router();

router.post("/books", async (req, res, next) => {
  try {
    const data = await createBooksCollection();
    successResponse({
      res,
      status: 201,
      data,
    });
  } catch (error) {
    next(error);
  }
});
router.post("/index", async (req, res, next) => {
  try {
    const data = await createBooksTitleIndex();
    successResponse({
      res,
      data,
    });
  } catch (error) {
    next(error);
  }
});
router.post("/", async (req, res, next) => {
  try {
    const data = await insertBook(req.body);
    successResponse({
      res,
      status: 201,
      message: "Your Book inserted Succesfully",
      data,
    });
  } catch (error) {
    next(error);
  }
});
router.post("/batch", async (req, res, next) => {
  try {
    const data = await insertManyBooks(req.body);
    successResponse({
      res,
      status: 201,
      message: "Books inserted successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
});
router.patch("/:title", async (req, res, next) => {
  try {
    const { title } = req.params;
    const { year } = req.body;
    const data = await updateBookYearByTitle(title, year || 2022);

    successResponse({
      res,
      data,
    });
  } catch (error) {
    next(error);
  }
});
router.get("/title", async (req, res, next) => {
  try {
    const { title } = req.query;
    const data = await getBookByTitle(title);

    successResponse({
      res,
      data,
    });
  } catch (error) {
    next(error);
  }
});
router.get("/year", async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const data = await getBooksBetweenYears(from, to);

    successResponse({
      res,
      data,
    });
  } catch (error) {
    next(error);
  }
});
router.get("/genre", async (req, res, next) => {
  try {
    const { genre } = req.query;
    const data = await getBooksByGenre(genre);

    successResponse({
      res,
      data,
    });
  } catch (error) {
    next(error);
  }
});
router.get("/skip-limit", async (req, res, next) => {
  try {
    const data = await getPaginatedBooks();

    successResponse({
      res,
      data,
    });
  } catch (error) {
    next(error);
  }
});
router.get("/year-integer", async (req, res, next) => {
  try {
    const data = await getBooksWithYearAsInteger();

    successResponse({
      res,
      data,
    });
  } catch (error) {
    next(error);
  }
});
router.get("/exclude-genres", async (req, res, next) => {
  try {
    const data = await getBooksExcludingGenres();

    successResponse({
      res,
      data,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/before-year", async (req, res, next) => {
  try {
    const { year } = req.query;
    const data = await deleteBooksBeforeYear(year);

    successResponse({
      res,
      data,
    });
  } catch (error) {
    next(error);
  }
});
router.get("/aggregate1", async (req, res, next) => {
  try {
    const data = await getBooksAggregate1();

    successResponse({
      res,
      data,
    });
  } catch (error) {
    next(error);
  }
});
router.get("/aggregate2", async (req, res, next) => {
  try {
    const data = await getBooksAggregate2();

    successResponse({
      res,
      data,
    });
  } catch (error) {
    next(error);
  }
});
router.get("/aggregate3", async (req, res, next) => {
  try {
    const data = await getBooksAggregate3();

    successResponse({
      res,
      data,
    });
  } catch (error) {
    next(error);
  }
});
router.get("/aggregate4", async (req, res, next) => {
  try {
    const data = await getBooksAggregate4();

    successResponse({
      res,
      data,
    });
  } catch (error) {
    next(error);
  }
});
export default router;
