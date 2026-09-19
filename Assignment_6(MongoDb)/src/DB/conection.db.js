import dns from "dns";
import { MongoClient } from "mongodb";
import { DB_URI, DB_NAME } from "../config/config.js";

// استخدام DNS موثوق بدل DNS الخاص بالراوتر
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const client = new MongoClient(DB_URI);
let db;

async function bootstrapDB(app, port = 3000) {
  try {
    // 1. الاتصال بسيرفر MongoDB
    await client.connect();

    // 2. اختيار قاعدة البيانات
    db = client.db(DB_NAME);

    // 3. اختبار الاتصال
    await db.command({ ping: 1 });
    console.log("MongoDB Connected Successfully 🌸");

    // 4. تشغيل السيرفر بعد نجاح الاتصال
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Failed To connect Database:", error.message);
    process.exit(1);
  }
}

// دالة مساعدة لجلب كائن الـ db داخل الـ Controllers
const getDB = () => {
  if (!db) {
    throw new Error("Database not initialized");
  }

  return db;
};

export { db, getDB, bootstrapDB };
