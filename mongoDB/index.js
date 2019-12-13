const dbDebugger = require('debug')('app:db');
const mongoose = require('mongoose');

/** CONNECT
 * 
 * Each environment will have a different connection string
 * Use node env vars for this string
 * mongodb<host><dbName>
 * 
 * connect() returns a promise
 */
mongoose.connect('mongodb://localhost/playground')
  .then(() => dbDebugger('Connected to the database...'))
  .catch(error => console.log('Could not connect to MongoDB...', error));

/** SCHEMA
 * 
 * Schema defines the shape of documents in mongo
 * Collections are similar to tables in SQL, except collections store documents   
 * Document is a container of key/value pairs
 * 
 * Schema => Document => Collection => MongoDB
 * 
 * TYPES: String, Number, Date, Buffer (store binary data), Boolean, ObjectID (assigning unit identifiers), Array
 */

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [ String ],
  date: { // default value so that we don't have to specify when we create the model
    type: Date,
    default: Date.now,
  },
  isPublished: Boolean,
  price: Number,
});

/** MODEL
 * 
 * Schema compiles into a model, which gives us a class
 * Create an object (model) based on the class, which maps to a document in the DB
 * 
 * Model = instance of schema; similar to Classes and objects as instances of a class
 */

// model() returns a class based on the schema and associated collection
const Course = mongoose.model('Course', courseSchema);

/** CREATE A MODEL
 * 
 * Create a model from 'Course' class
 * 
 * Documents in mongo can be complex objects
 * 
 * Relational DBs would require 3 tables for this model
 * 1) Courses
 * 2) Tags
 * 3) Course-Tags as an intermediate table because there is a many-to-many relationship between courses and tags
 */
const course = new Course({
  name: 'Node.js Course',
  author: 'Mosh',
  tags: [ 'node', 'backend'],
  isPublished: true,
});

/**  CRUD OPERATIONS
 * 
 * save() is an async method because it takes time to complete CRUD operations
 * The result is the actual course object that is saved
 * This object has a unique ID assigned by Mongo
 * 
*/

async function createCourse(name, author, isPublished, price) {
  // create a model and save it
  const course = new Course({
    name: `${name}.js Course`,
    author: `${author}`,
    tags: [ 'node', 'backend'],
    isPublished: `${isPublished}`,
    price: `${price}`,
  });

  const result = await course.save();
  console.log('Save Model: ', result);
}

// comment out so that it doesn't run every time I run this file
// createCourse('Node', 'Mosh', true, 10.00);
// createCourse('React', 'Cooper', true, 12.00);
// createCourse('Angular', 'Mosh', false, 3.52);

/** QUERY MONGO DB
 * 
 */

async function getCourses() {
  // fetch all
  const allCourses = await Course.find();
  console.log('All Courses: ', allCourses);
  // fetch with filter and customize query
  const filteredCourses = await Course
    .find({ author: 'Mosh' })    
    .limit(10)
    .sort({ name: 1 }) // 1 = ascending, -1 = descending, can take multiple key/value pairs
    .select({ name: 1, tags: 1 }); // select only the properties I wish to return
  console.log('Filtered Courses: ', filteredCourses);
}

// getCourses();

/** COMPLEX QUERIES with COMPARISON OPERATORS
 * 
 * eq = (equal)
 * ne = (not equal)
 * gt = (greater than)
 * gte = (greater than or equal to)
 * lt = (less than)
 * lte = (less than or equal to)
 * in
 * nin (not in)
 * 
 */

async function getCoursesWithComparisonOperators() {
  // fetch with filter and customized query
  const filteredCourses = await Course
    /** find courses: 10 <= price <= 20 */
    // .find({ price: { $gte: 10, $lte: 20 }})
    /** find courses that are 10, 15, or 20 dollars exactly */
    .find({ price: { $in: [10, 15, 20] }}) 
    .limit(10)
    .sort({ name: 1 }) // 1 = ascending, -1 = descending, can take multiple key/value pairs
    .select({ name: 1, price: 1 }); // select only the properties I wish to return
  console.log('Filtered Courses: ', filteredCourses);
}

// getCoursesWithComparisonOperators();

/** COMPLEX QUERIES with LOGICAL OPERATORS
 * 
 * or
 * and
 * 
 */

async function getCoursesWithLogicalOperators() {
  // fetch with filter and customized query
  const filteredCourses = await Course
    .find()
    /** Mosh || isPublished */
    .or([ { author: 'Mosh' }, { isPublished: true } ])
    /** Mosh && isPublished */
    // .and([ { author: 'Mosh' }, { isPublished: true } ])
    .limit(10)
    .sort({ name: 1 }) // 1 = ascending, -1 = descending, can take multiple key/value pairs
    .select({ name: 1, price: 1 }); // select only the properties I wish to return
  console.log('Filtered Courses: ', filteredCourses);
}

// getCoursesWithLogicalOperators();

/** COMPLEX QUERIES with REGULAR EXPRESSIONS
 * 
 * Starts with Mosh (^)                                         =>  { author: /^Mosh/ }
 * Ends with Hamedani ($ = end of string, i = case insensitive) =>  { author: /Hamedani$/i }
* Author contains 'Mosh'                                       =>  { author: .*Mosh.*}  // missing (//) due to this being in a comment
 */

async function getCoursesWithRegularExpressions() {
  // fetch with filter and customized query
  const filteredCourses = await Course
    // Starts with Mosh (^)
    .find({ author: /^Mosh/ })
    // .find({ author: /Hamedani$/i })
    // .find({ author: /.*Mosh.*/ })
    .limit(10)
    .sort({ name: 1 }) // 1 = ascending, -1 = descending, can take multiple key/value pairs
    .select({ name: 1, price: 1 }); // select only the properties I wish to return
  console.log('Filtered Courses: ', filteredCourses);
}

// getCoursesWithRegularExpressions();

/** COUNTING
 * 
 * Get number of documents instead of actual documents
 * 
 * 
 */

async function getCoursesCount() {
  // fetch with filter and customized query
  const filteredCourses = await Course
    .find({ author: 'Mosh', isPublished: true })
    .limit(10)
    .sort({ name: 1 }) // 1 = ascending, -1 = descending, can take multiple key/value pairs
    .count();
  console.log('Filtered Courses: ', filteredCourses);
}

// getCoursesCount();

/** PAGINATION
 * 
 * 
 * 
 * 
 */

async function getCoursesWithPagination() {
  // hardcoded here, but would be query string params in real world
  // e.g. /api/courses?pageNumber=2&pageSize=10
  const pageNumber = 2;
  const pageSize = 10;
  // fetch with filter and customized query
  const filteredCourses = await Course
    .find({ author: 'Mosh', isPublished: true })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort({ name: 1 }) // 1 = ascending, -1 = descending, can take multiple key/value pairs
    .select({ name: 1, tags: 1 });
  console.log('Filtered Courses: ', filteredCourses);
}

// getCoursesWithPagination();

/** UPDATE MONGO DOCUMENTS
 * 
 * Two Approaches
 * 
 * 1) Query First Approach
 *  findById()
 *  Modify
 *  save()
 * 
 * 2) Update First
 *  Update DB directly
 *  Optionally, get the updated document
 * 
 * 
 */


 // Query First
async function updateCourseQueryFirst(id) {
  const course = await Course.findById(id)
  if (!course) return;
  // course.isPublished = true;
  // course.author = 'Another Author';
  course.set({
    isPublished: true,
    author: 'Another Author',
  });
  const result = await course.save();
  console.log('update result: ', course);
}

// updateCourseQueryFirst('5ddaf3c965611d47c0c98363');

// Update First - updates without checking or retrieving course
// useful to update many documents in DB directly without user input
async function updateCourseUpdateFirst(id) {
  // update all courses with isPublished = false
  // const result = await Course.update({ isPublished: false })
  const result = await Course.update({ isPublished: false }, {
    $set: {
      author: 'Gary Cooper',
      isPublished: true,
    },
  });
  console.log('db update result: ', result);
}

// updateCourseUpdateFirst('5ddaf3c965611d47c0c98363');

// Sometimes we want the updated document
async function updateCourseFindByIdAndUpdate(id) {
  // returns original document unless we pass { new: true }
  const course = await Course.findByIdAndUpdate( id,
    {
      $set: {
        author: 'Gary M Cooper Jr.',
        isPublished: false,
      },    
    }, { new: true },
  );
  console.log('updateCourseFindByIdAndUpdate course: ', course);
}

// updateCourseFindByIdAndUpdate('5ddaf3c965611d47c0c98363');

/** REMOVING A DOCUMENT
 * 
 * 
 * 
 * 
 */

async function removeCourse(id) {
  /* finds first course matching filter and deletes it */
  // Course.deleteOne({ isPublished: false })
  /* delete one specific course by id */
  // const result = await Course.deleteOne({ _id: id });
  /* delete multiple */
  // const result = await Course.deleteMany({ isPublished: false });
  /* return removed course */
  const course = await Course.findByIdAndRemove(id);
  console.log('delete: ', course);
}

// removeCourse('5ddaf3c965611d47c0c98363');











