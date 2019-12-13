/**
 * Two approaches to modelling documents
 * 
 *  1) Using References (Normalization) -> CONSISTENCY
 *  - working with different collections of documents e.g. author collection, course collection
 *  - requires two queries, each must be very fast
 * 
 *  let author = {
 *    name: 'Mosh'
 *  }
 * 
 *  let course = {
 *    author: 'id',
 *    authors: [
 *      'author1',
 *      'author2',
 *    ]
 *  }
 * 
 *  2) Using Embedded Documents (Denormalization) -> PERFORMANCE
 *  - can use a single query because author is already inside of the course (this is faster than multiple queries above)
 *  - if a batch update is performed, some documents may not update properly which leaves inconsistent documents
 * 
 *  let course = {
 *    author: {
 *      name: 'Mosh',
 *    }
 *  }
 * 
 *  3) Hybrid approach
 *  - embed a partial author document (name property) inside of a course document
 *  - only stores the 
 * 
 *  let author = {
 *    name: 'Mosh',
 *    // 50 other properties
 *  }
 * 
 *  let course = {
 *    author: {
 *      id: 'ref',
 *      name: 'Mosh',
 *    }
 *  }
 */

 /** Referencing Documents 
  * 
  * 
 */

const dbDebugger = require('debug')('app:db');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => dbDebugger('Connected to the database...'))
  .catch(error => console.log('Could not connect to MongoDB...', error));

const AuthorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String,
});
const Author = mongoose.model('Author', AuthorSchema);

// Only properties defined in this model are persisted to the DB
const CourseSchema = new mongoose.Schema({
  name: String,
  author: {
    type: mongoose.Schema.Types.ObjectId, // must be valid author id
    ref: 'Author', // ref = name of target collection
  },
});
const Course = mongoose.model('Course', CourseSchema);

async function createAuthor(name, bio, website) {
  const author = new Author({
    name,
    bio,
    website,
  });

  const result = await author.save();
  console.log('author save: ', result);
}

async function createCourse(name, author) {
  const course = new Course({
    name,
    author,
  });

  const result = await course.save();
  console.log('course save: ', result);
}

async function listCoursesWithoutAuthorPopulated() {
  const courses = await Course
    .find()
    .select('name author');

  console.log('query: ', courses);

  /**
   * This query returns the following. Notice that author is not populated with a document
   * 
   * [ { _id: 5df40de20641f1227cf06fa0, name: 'Node Course' },
  { _id: 5df40ff37ce91332f4726152, name: 'Node Course' },
  { _id: 5df411433ca00f1888da0874,
    name: 'Node Course',
    author: 5df40dce55dce005a4daedad } ]
   */
}

async function listCoursesWithAuthorPopulated() {
  const courses = await Course
    .find()
    .populate('author', 'name -_id') // include name, exclude _id
    // .populate('author')
    .select('name author');

  console.log('query: ', courses);

  /**
   * 
   * .populate('author') returns the following:
     [
        { _id: 5df40de20641f1227cf06fa0, name: 'Node Course' },
        { _id: 5df40ff37ce91332f4726152, name: 'Node Course' },
        { _id: 5df411433ca00f1888da0874,
          name: 'Node Course',
          author:
          { 
            _id: 5df40dce55dce005a4daedad,
            name: 'Cooper',
            bio: 'My bio',
            website: 'garycooper.io',
            __v: 0
          }
        }
      ]

      .populate('author', 'name -_id') includes only the author name and excludes the _id
      [ 
        { _id: 5df40de20641f1227cf06fa0, name: 'Node Course' },
        { _id: 5df40ff37ce91332f4726152, name: 'Node Course' },
        {
          _id: 5df411433ca00f1888da0874,
          name: 'Node Course',
          author: { name: 'Cooper' }
        }
      ]

   */
}

// createAuthor('Cooper', 'My bio', 'garycooper.io');
// createCourse('Node Course', '5df40dce55dce005a4daedad');
// listCoursesWithoutAuthorPopulated();
// listCoursesWithAuthorPopulated();

