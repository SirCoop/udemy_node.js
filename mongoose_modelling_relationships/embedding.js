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

const CourseSchema = new mongoose.Schema({
  name: String,
  // embed author document directly into course document
  // author: {
  //   type: AuthorSchema,
  //   required: true,
  // },

  /* EMBED AN ARRAY OF SUBDOCUMENTS */
  authors: [AuthorSchema],
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

async function createCourseWithArrayOfAuthors(name, authors) {
  const course = new Course({
    name,
    authors,
  });

  const result = await course.save();
  console.log('course save: ', result);

  /**
   * Returns the following
   * 
   * {
   *  _id: 5df418c8883a111fb8577b34,
      name: 'Another Node Course',
      authors:
        [
          { _id: 5df418c8883a111fb8577b32, name: 'Mosh' },
          { _id: 5df418c8883a111fb8577b33, name: 'Cooper' }
        ],
      __v: 0
    }
   */
}

async function listCourses() {
  const courses = await Course
    .find();

  console.log('query: ', courses);

  /**
   * Returns the following: 
   * 
   * {
   *  _id: 5df414a17b27eb35bc54e820,
      name: 'Node Course',
      author: { _id: 5df414a17b27eb35bc54e81f, name: 'Mosh' }, <- subdocuments can only be changed in the context of the parent
      __v: 0
    }
   */
}

async function updateAuthorByParentQuery(courseId) {
  const course = await Course.findById(courseId);
  // subdocuments can only be changed in the context of the parent
  course.author.name = 'Gary Cooper';
  const result = await course.save();
  console.log('course save: ', result);

  /**
   * 
   * Returns the following:
   * 
   * {
      _id: 5df414a17b27eb35bc54e820,
      name: 'Node Course',
      author: { _id: 5df414a17b27eb35bc54e81f, name: 'Gary Cooper' },
      __v: 0
    }
   */
}

async function updateAuthorInDB(courseId) {
  const course = await Course.update({ _id: courseId }, {
    $set: {
      'author.name': 'John Smith',
    },
  })
  console.log('db update: ', course);
}

async function updateCourseByRemovingAuthorSubdocument(courseId) {
  const course = await Course.update({ _id: courseId }, {
    $unset: {
      'author': '',
    },
  })
  console.log('db update: ', course);
}

async function addAuthorToArrayOfAuthors(courseId, author) {
  const course = await Course.findById(courseId);
  course.authors.push(author); // change is now in memory
  const result = await course.save(); // change is now persisted
  console.log('update: ', result);

  /**
   * Returns the following
   * 
   * {
   *  _id: 5df418c8883a111fb8577b34,
      name: 'Another Node Course',
      authors:
        [
          { _id: 5df418c8883a111fb8577b32, name: 'Mosh' },
          { _id: 5df418c8883a111fb8577b33, name: 'Cooper' },
          { _id: 5df419d0b9f8351874fd0b44, name: 'El Chapo' }
        ],
      __v: 1
    }
   */
}

async function removeAuthorFromArrayofAuthors(courseId, authorId) {
  const course = await Course.findById(courseId);
  const author = course.authors.id(authorId);
  author.remove();
  const result = await course.save();
  console.log('delete author: ', result);
}

// createCourse('Node Course', new Author({ name: 'Mosh' }));

// updateAuthorByParentQuery('5df414a17b27eb35bc54e820');

// updateAuthorInDB('5df414a17b27eb35bc54e820')

// updateCourseByRemovingAuthorSubdocument('5df414a17b27eb35bc54e820');

// createCourseWithArrayOfAuthors('Another Node Course', [
//   new Author({ name: 'Mosh' }),
//   new Author({ name: 'Cooper' })
// ]);

// addAuthorToArrayOfAuthors('5df41b5734cc021280b2f62f', new Author({ name: 'El Chapo' }));

// removeAuthorFromArrayofAuthors('5df41b5734cc021280b2f62f', '5df41b5734cc021280b2f62d');