//Part1: Node.js Core Modules

// // 1)
// function logPathAndDir() {
//   const result = {
//     File: __filename,
//     Dir: __dirname,
//   };

//   console.log(result);
//   return result;
// }

// logPathAndDir();

// ////////////////////////
// // 2)
// const path = require("path");

// function getFileName(filePath) {
//   const currentFileName = path.basename(filePath);
//   console.log(currentFileName);
//   return currentFileName;
// }

// getFileName("/user/files/report.pdf");

/////////////////////////////////
// 3)

// const path = require("path");
// function buildPathFromObject(pathObj) {
//   const fullPath = path.format(pathObj);
//   console.log(fullPath);
//   return fullPath;
// }

// buildPathFromObject({ dir: "/folder", name: "app", ext: ".js" });
//////////////////////////

// 4)
// const path = require("path");
// function getExtension(pathString) {
//   const extension = path.extname(pathString);
//   console.log(extension);
//   return extension;
// }

// getExtension("/docs/readme.md");

///////////////////////////////
// 5)

// const path = require("path");
// function getNameAndExtension(pathString) {
//   const parsed = path.parse(pathString);
//   const result = { Name: parsed.name, Ext: parsed.ext };
//   console.log(result);
//   return result;
// }
// getNameAndExtension("/docs/readme.md");

//////////////////////////////
// 6)
// const path = require("path");
// function isAbsolutePath(pathString) {
//   const isAbsolute = path.isAbsolute(pathString);
//   console.log(isAbsolute);
//   return isAbsolute;
// }
// isAbsolutePath("/home/user/file.txt");
////////////////////////////////
// 7)
// const path = require("path");
// function joinMultipleSegments(...segments) {
//   const joinedPath = path.join(...segments);
//   console.log(joinedPath);
//   return joinedPath;
// }
// joinMultipleSegments("src", "components", "App.js");

///////////////////////////////
// 8)

// const path = require("path");
// function resolveToAbsolute(relativePath) {
//   const absolutePath = path.resolve(relativePath);
//   console.log(absolutePath);
//   return absolutePath;
// }
// resolveToAbsolute("./index.js");

///////////////////////////////
// 9)
// const Path = require("path");
// function joinTwoPaths(path1, path2) {
//   const joinedPath = Path.join(path1, path2);
//   console.log(joinedPath);
//   return joinedPath;
// }
// joinTwoPaths("/folder1", "folder2/file.txt");

/////////////////////////////////////////
// 10)
// const fs = require("fs");
// const path = require("path");

// function deleteFileAsync(filePath) {
//   fs.writeFileSync(filePath, "test content");

//   fs.unlink(filePath, (err) => {
//     if (err) {
//       console.error("Error deleting file:", err.message);
//       return;
//     }

//     const fileName = path.basename(filePath);
//     console.log(`The ${fileName} is deleted.`);
//   });
// }

// deleteFileAsync(path.resolve("./file.txt"));

/////////////////////////////////
// 11)

// const fs = require("fs");
// const path = require("path");
// function createFolderSync(folderPath) {
//   try {
//     fs.mkdirSync(folderPath, { recursive: true });
//     console.log("Success");
//   } catch (err) {
//     console.error("Error creating folder:", err.message);
//   }
// }

// const folderPath = path.resolve("./my-new-folder");
// createFolderSync(folderPath);

////////////////////////////////////////////

// 12)
// const EventEmitter = require("node:events");
// const myEmitter = new EventEmitter();

// myEmitter.on("start", () => {
//   console.log("Welcome event triggered!");
// });

// myEmitter.emit("start");

// ////////////////////////////////////
// 13)
// const EventEmitter = require("node:events");
// const myEmitter = new EventEmitter();
// myEmitter.on("login", (username) => {
//   console.log(`User ${username} has logged in.`);
// });
// myEmitter.emit("login", "Yahia");

// ////////////////////////////////////
// 14)

// const fs = require("fs");
// const path = require("path");
// function readFileSyncExample(filePath) {
//   try {
//     const data = fs.readFileSync(path.resolve(filePath), "utf8");
//     console.log(`the file content => “${data}”`);
//   } catch (err) {
//     console.error("Error reading file:", err.message);
//   }
// }

// readFileSyncExample("./file.txt");
// ////////////////////////////////////////
// 15)
// const fs = require("fs");
// const path = require("path");
// function writeFileSyncExample(filePath, content) {
//   try {
//     fs.writeFileSync(path.resolve(filePath), content, "utf8");
//     console.log(`Content written to ${filePath}`);
//   } catch (err) {
//     console.error("Error writing to file:", err.message);
//   }
// }

// writeFileSyncExample("./file.txt", "Hello, World!");
// //////////////////////////////////////////

// 16)
// const fs = require("fs");
// const path = require("path");

// // 16)
// function checkFileOrDirExists(targetPath) {
//   const fullPath = path.resolve(targetPath);
//   const exists = fs.existsSync(fullPath);

//   console.log(exists);
//   return exists;
// }

// checkFileOrDirExists("./file.txt");

// ///////////////////////////////
// 17)
// const os = require("os");
// function getSystemInfo() {
//   const result = {
//     Platform: os.platform(),
//     Arch: os.arch(),
//   };

//   console.log(result);
//   return result;
// }

// getSystemInfo();

// /////////////////////////////
// 18)

// const fs = require("fs");
// const path = require("path");

// function readBigFileInChunks(filePath) {
//   const readStream = fs.createReadStream(path.resolve(filePath), "utf8");

//   readStream.on("data", (chunk) => {
//     console.log("chunk:", chunk);
//   });

//   readStream.on("error", (err) => {
//     console.error("Error reading file stream:", err.message);
//   });
// }

// readBigFileInChunks("./file.txt");
// /////////////////////////////////

// 19)
// const fs = require("fs");
// const path = require("path");

// const readStream = fs.createReadStream(path.resolve("./file.txt"), {
//   encoding: "utf-8",
//   highWaterMark: 64 * 1024,
// });
// const writeStream = fs.createWriteStream(path.resolve("./output.txt"));

// readStream.on("data", (chunk) => {
//   console.log("chunk:", chunk);
//   writeStream.write(chunk);
// });

// readStream.on("end", () => {
//   console.log("Finished reading the file.");
//   writeStream.end();
// });
// /////////////////////////////////////////////////

// 20)

// const fs = require("fs");
// const path = require("path");

// const readStream = fs.createReadStream(path.resolve("./file.txt"), {
//   encoding: "utf-8",
//   highWaterMark: 64 * 1024,
// });
// const writeStream = fs.createWriteStream(path.resolve("./output.txt"));
// readStream.pipe(writeStream);

// writeStream.on("finish", () => {
//   console.log("Finished writing to the output file.");
// });
// //////////////////////////////////////////////

// Part2: Simple CRUD Operations Using HTTP

// 1)

// const http = require("http");
// const fs = require("fs");
// const path = require("path");

// const port = 3000;
// const filePath = path.resolve("./users.json");

// const server = http.createServer((req, res) => {
//   if (req.url === "/user" && req.method === "POST") {
//     let body = "";

//     req.on("data", (chunk) => {
//       body += chunk.toString();
//     });

//     req.on("end", () => {
//       try {
//         const newUser = JSON.parse(body);

//         const fileData = fs.readFileSync(filePath, "utf8");
//         const users = JSON.parse(fileData || "[]");

//         const isEmailExists = users.some(
//           (user) => user.email === newUser.email,
//         );

//         if (isEmailExists) {
//           res.writeHead(400, { "Content-Type": "application/json" });
//           return res.end(JSON.stringify({ message: "Email already exists." }));
//         }

//         users.push(newUser);
//         fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

//         res.writeHead(201, { "Content-Type": "application/json" });
//         res.end(JSON.stringify({ message: "User added successfully." }));
//       } catch (err) {
//         res.writeHead(500, { "Content-Type": "application/json" });
//         res.end(JSON.stringify({ message: "Server error or Invalid JSON" }));
//       }
//     });
//   }
// });

// server.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

// /////////////////////////////

// 2)
// const http = require("http");
// const fs = require("fs");
// const path = require("path");

// const port = 3000;
// const filePath = path.resolve("./users.json");

// const server = http.createServer((req, res) => {
//   if (req.method === "PATCH" && req.url.startsWith("/user/")) {
//     const id = req.url.split("/")[2];

//     let body = "";
//     req.on("data", (chunk) => {
//       body += chunk.toString();
//     });

//     req.on("end", () => {
//       try {
//         const updates = JSON.parse(body);

//         const fileData = fs.readFileSync(filePath, "utf8");
//         const users = JSON.parse(fileData || "[]");

//         const userIndex = users.findIndex((user) => user.id == id);

//         if (userIndex === -1) {
//           res.writeHead(404, { "Content-Type": "application/json" });
//           return res.end(JSON.stringify({ message: "User ID not found." }));
//         }

//         users[userIndex] = { ...users[userIndex], ...updates };

//         fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

//         const updatedKey = Object.keys(updates)[0] || "info";

//         res.writeHead(200, { "Content-Type": "application/json" });
//         res.end(
//           JSON.stringify({
//             message: `User ${updatedKey} updated successfully.`,
//           }),
//         );
//       } catch (err) {
//         res.writeHead(400, { "Content-Type": "application/json" });
//         res.end(
//           JSON.stringify({ message: "Invalid JSON body or file error." }),
//         );
//       }
//     });
//   }
// });

// server.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

/////////////////////////////////////////////////////////////
// 3)
// const http = require("http");
// const fs = require("fs");
// const path = require("path");

// const port = 3000;
// const filePath = path.resolve("./users.json");

// const server = http.createServer((req, res) => {
//   if (req.method === "DELETE" && req.url.startsWith("/user/")) {
//     const id = req.url.split("/")[2];

//     req.on("data", () => {});

//     req.on("end", () => {
//       try {
//         const fileData = fs.readFileSync(filePath, "utf8");
//         const users = JSON.parse(fileData || "[]");

//         const userIndex = users.findIndex((user) => user.id == id);

//         if (userIndex === -1) {
//           res.writeHead(404, { "Content-Type": "application/json" });
//           return res.end(JSON.stringify({ message: "User ID not found." }));
//         }

//         users.splice(userIndex, 1);

//         fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

//         res.writeHead(200, { "Content-Type": "application/json" });
//         res.end(JSON.stringify({ message: "User deleted successfully." }));
//       } catch (err) {
//         res.writeHead(500, { "Content-Type": "application/json" });
//         res.end(JSON.stringify({ message: "Internal server error." }));
//       }
//     });
//   }
// });

// server.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
/////////////////////////////////////////////////////////

// 4)
// const http = require("http");
// const fs = require("fs");
// const path = require("path");

// const port = 3000;
// const filePath = path.resolve("./users.json");

// const server = http.createServer((req, res) => {
//   if (req.method === "GET" && req.url === "/user") {
//     try {
//       const fileData = fs.readFileSync(filePath, "utf8");
//       const users = JSON.parse(fileData || "[]");
//       res.writeHead(200, { "Content-Type": "application/json" });
//       res.end(JSON.stringify(users));
//     } catch (err) {
//       res.writeHead(500, { "Content-Type": "application/json" });
//       res.end(JSON.stringify({ message: "Error reading users data." }));
//     }
//   }
// });

// server.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

//////////////////////////////////////////
// 5)

const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 3000;
const filePath = path.resolve("./users.json");

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url.startsWith("/user/")) {
    const id = req.url.split("/")[2];

    try {
      const fileData = fs.readFileSync(filePath, "utf8");
      const users = JSON.parse(fileData || "[]");

      const foundUser = users.find((user) => user.id == id);

      if (!foundUser) {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "User not found." }));
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(foundUser));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Error reading users data." }));
    }
  }
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

///////////////////
