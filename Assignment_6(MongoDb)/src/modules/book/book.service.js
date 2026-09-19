import { getDB } from "../../DB/conection.db.js";
import { getBookModel } from "../../DB/model/book.model.js";
import { getLogModel } from "../../DB/model/log.model.js";
export const createBooksCollection = async () => {
  const db = getDB();

  const collections = await db.listCollections({ name: "books" }).toArray();
  if (collections.length > 0) {
    return {
      message: "Collection 'books' already exists",
    };
  }

  await db.createCollection("books", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["title"],
        properties: {
          title: {
            bsonType: "string",
            minLength: 1,
            description: "title must be a non-empty string",
          },
        },
      },
    },
  });

  return {
    message: "Collection 'books' created successfully with validation rule",
  };
};

export const createBooksTitleIndex = async () => {
  const data = await getBookModel().createIndex({ title: 1 });
  return data;
};

export const insertBook = async (bookData) => {
  const data = await getBookModel().insertOne(bookData);
  return data;
};

export const insertManyBooks = async (booksData) => {
  const data = await getBookModel().insertMany(booksData);
  return data;
};
export const updateBookYearByTitle = async (title, year) => {
  const data = await getBookModel().updateOne({ title }, { $set: { year } });
  return data;
};
export const getBookByTitle = async (title) => {
  const data = await getBookModel().findOne({ title });
  return data;
};
export const getBooksBetweenYears = async (from, to) => {
  const data = await getBookModel()
    .find({
      year: {
        $gte: Number(from),
        $lte: Number(to),
      },
    })
    .toArray();
  return data;
};
export const getBooksByGenre = async (genre) => {
  const data = await getBookModel().find({ genres: genre }).toArray();
  return data;
};
export const getPaginatedBooks = async () => {
  const data = await getBookModel()
    .find()
    .sort({ year: -1 })
    .skip(2)
    .limit(3)
    .toArray();
  return data;
};
export const getBooksWithYearAsInteger = async () => {
  const data = await getBookModel()
    .find({ year: { $type: "int" } })
    .toArray();
  return data;
};
export const getBooksExcludingGenres = async () => {
  const data = await getBookModel()
    .find({
      genres: { $nin: ["Horror", "Science Fiction"] },
    })
    .toArray();
  return data;
};
export const deleteBooksBeforeYear = async (year) => {
  const data = await getBookModel().deleteMany({
    year: { $lt: Number(year) },
  });
  return data;
};
export const getBooksAggregate1 = async () => {
  const data = await getBookModel()
    .aggregate([
      {
        $match: {
          year: { $gt: 2000 },
        },
      },
      {
        $sort: {
          year: -1,
        },
      },
    ])
    .toArray();
  return data;
};
export const getBooksAggregate2 = async () => {
  const data = await getBookModel()
    .aggregate([
      {
        $match: {
          year: { $gt: 2000 },
        },
      },
      {
        $project: {
          _id: 0,
          title: 1,
          author: 1,
          year: 1,
        },
      },
    ])
    .toArray();
  return data;
};
export const getBooksAggregate3 = async () => {
  const data = await getBookModel()
    .aggregate([
      {
        $unwind: "$genres",
      },
      {
        $project: {
          _id: 0,
          title: 1,
          genres: 1,
        },
      },
    ])
    .toArray();
  return data;
};

export const getBooksAggregate4 = async () => {
  const data = await getLogModel()
    .aggregate([
      {
        $addFields: {
          bookObjectId: {
            $convert: {
              input: "$book_id",
              to: "objectId",
              onError: null,
              onNull: null,
            },
          },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "bookObjectId",
          foreignField: "_id",
          as: "book_details",
        },
      },
      {
        $project: {
          _id: 0,
          action: 1,
          "book_details.title": 1,
          "book_details.author": 1,
          "book_details.year": 1,
        },
      },
    ])
    .toArray();

  return data;
};
