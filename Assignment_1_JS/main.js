// A. Part 1: Coding Questions

// 1)
const str = "123";
const result = Number(str) + 7;
console.log(result);

////////////////////////////
// 2)
function checkFalsy(value) {
  if (!value) {
    return "Invalid";
  }
  return "Valid";
}
console.log(checkFalsy(0));
///////////////////
// 3)
for (let i = 1; i <= 10; i++) {
  if (i % 2 === 0) {
    continue;
  }
  console.log(i);
}

// /////////////////
// 4)

const numbers = [1, 2, 3, 4, 5];
const evenNumbers = numbers.filter((num) => num % 2 === 0);
console.log(evenNumbers);

// //////////////

// 5)
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const mergedArray = [...arr1, ...arr2];

console.log(mergedArray);

// ////////////////////
// 6)
function getDayName(dayNumber) {
  let dayName;

  switch (dayNumber) {
    case 1:
      dayName = "Sunday";
      break;
    case 2:
      dayName = "Monday";
      break;
    case 3:
      dayName = "Tuesday";
      break;
    case 4:
      dayName = "Wednesday";
      break;
    case 5:
      dayName = "Thursday";
      break;
    case 6:
      dayName = "Friday";
      break;
    case 7:
      dayName = "Saturday";
      break;
    default:
      dayName = "Invalid day number";
  }

  return dayName;
}

console.log(getDayName(2));

// ////////////////////////
// 7)
const strings = ["a", "ab", "abc"];
const lengths = strings.map((str) => str.length);
console.log(lengths);

// ////////////////////////
// 8)
function checkDivisibility(num) {
  if (num % 3 === 0 && num % 5 === 0) {
    return "Divisible by both";
  }
  return "Not divisible by both";
}
console.log(checkDivisibility(15));

// ////////////////////////
// 9)
const square = (num) => num * num;

console.log(square(5));

// ////////////////////////
// 10)
function formatPerson(person) {
  const { name, age } = person;
  return `${name} is ${age} years old`;
}

const person = { name: "John", age: 25 };
console.log(formatPerson(person));

// //////////////////////
// 11)
function sumAll(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

console.log(sumAll(1, 2, 3, 4, 5));

// ////////////////////
// 12)
function delaySuccess() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Success");
    }, 3000);
  });
}

delaySuccess().then((message) => {
  console.log(message);
});
// ////////////////////
// 13)
function findMax(arr) {
  return arr.reduce((max, current) => (current > max ? current : max), arr[0]);
}
console.log(findMax([1, 3, 7, 2, 4]));

// ////////////////////
// 14)
function getObjectKeys(obj) {
  return Object.keys(obj);
}

const person = { name: "John", age: 30 };
console.log(getObjectKeys(person));

// ////////////////////
// 15)
function splitIntoWords(str) {
  return str.split(" ");
}
const sentence = "The quick brown fox";
console.log(splitIntoWords(sentence));

// //////////////////////////////////////////////

// B. Part 2: Essay Questions

// 1)
/* 
(foreach)

 1-Array prototype method (Array.prototype.forEach)
 2-Arrays (and some array-like objects like NodeList)
 3-Does NOT support break or continue
 4-Does not wait for promises inside callback functions
 5-Provides index as a built-in second argument
 */

/*
 (for...of)

 1-Built-in JavaScript loop statement
 2-Any Iterable object (Arrays, Strings, Maps, Sets, etc.)
 3-Supports break and continue
 4-Waits for promises inside async functions
 5-Does not provide index as a built-in argument

 */

//  ////////////////////

// 2)
/*
Hoisting is JavaScript's default behavior of moving variable and function declarations to the top of their containing scope (global or function scope) during the compilation phase, before the code is executed.

.Variables declared with var are hoisted and initialized with undefined.

.Functions declared with function statements are hoisted along with their complete definition.

.Variables declared with let and const are hoisted as well, but they remain uninitialized.*/

sayHello();

function sayHello() {
  console.log("Hello!");
}

console.log(age);
var age = 25;

/*
The Temporal Dead Zone (TDZ) is the time period between the start of a block scope and the point where a variable declared with let or const is evaluated and initialized.

During this period, the variable exists in memory (because it was hoisted), but accessing it will throw a ReferenceError.

*/

{
  console.log(score);

  let score = 100;
  console.log(score);
}

///////////////////////////////////////////

// 3)
/* 
(Loose Equality)
1-Performs implicit type conversion if the types are different before comparing values.
2-Checks value only (after potential type conversion).
3-Can lead to unexpected/unintuitive results due to type coercion rules.
*/

/*
(Strict Equality)
1-Does NOT perform type conversion. Returns false if types are different.
2-Checks both value AND data type.
3-Highly predictable and safer to use.
*/
/////////////////////////////
// 4)

/*
The try-catch statement is JavaScript's primary mechanism for handling runtime errors gracefully without crashing your code execution.
**try block: You place the code that might throw an error inside this block.

**catch block: If an exception/error occurs inside the try block, JavaScript stops executing the try block and immediately jumps to the catch block, passing the error object as a parameter. */

try {
  let result = 10 / unknownVariable;
} catch (error) {
  console.error("An error occurred:", error.message);
}

// /////////////////////
// 5)

// Type Conversion (also known as Explicit Type Conversion or Type Casting) happens when you manually convert a value from one data type to another using built-in functions or constructors like Number(), String(), or Boolean().

const strNumber = "42";
const num = Number(strNumber);

const age = 25;
const ageString = String(age);

const isZero = Boolean(0);

//Type Coercion (also known as Implicit Type Conversion) happens automatically by JavaScript itself behind the scenes when an operation involves incompatible types.

const result1 = "The answer is " + 42;

const result2 = "10" - 2;
const result3 = "5" * "2";

if ("Hello") {
  console.log("This will run!");
}
