const dbDebugger = require('debug')('app:db');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => dbDebugger('Connected to the database...'))
  .catch(error => console.log('Could not connect to MongoDB...', error));

/**
 * BUILT-IN VALIDATORS, CUSTOM VALIDATORS
 */
const courseSchema = new mongoose.Schema({
  // all properties are optional unless required
  // mongo does not care about this validation, only mongoose does
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    // match: /pattern/  <= regex
  },
  category: {
    type: String,
    required: true,
    enum: ['web', 'mobile', 'network'],
    // convert value of enum property to lowercase
    lowercase: true,
    uppercase: false,
    // remove whitespace
    trim: true,
  },
  author: String,
  stores: {
    type: Array,
    // async custom validator
    isAsync: true,
    validate: {
      validator: function (value, callback) {
        setTimeout(() => {
          // Do some async work - setTimeout simulates async function such as HTTP POST
          const result = value && value.length > 0;
          // callback(result);
        }, 4000);
      },
      message: 'A course must be sold in a store.'
    }
  },
  tags: {
    type: Array,
    // custom validator
    validate: {
      validator: function(value) {
        // value && value.length ensures we account for null values
        return value && value.length > 0;
      },
      message: 'A course should have at least one tag.'
    },
  },
  date: { // default value so that we don't have to specify when we create the model
    type: Date,
    default: Date.now,
  },
  isPublished: Boolean,
  price: {
    type: Number,
    // if isPublished = true, then require price
    required: function() { return this.isPublished }, // arrow function will not work here
    min: 10,
    max: 200,
    get: v => Math.round(v),
    set: v => Math.round(v),
  },
});

const Course = mongoose.model('Course', courseSchema);

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

async function createCourseWithValidation() {
  const course = new Course({
    name: 'Angular 8 course',
    category: '  WEB    ',
    author: 'Mosh',
    stores: ['udemy'],
    tags: ['frontend'],
    isPublished: true,
    price: 15.8,
  });

  try {
    /** 
     * validate returns void therefore it needs a callback in order to execute logic on validation result
     *  course.validate(err => {
          if (err) {
        
          }
        });
    */ 
    const result = await course.save();
    console.log('Save Model: ', result);
  } catch (error) {
    // display multiple errors
    for (field in error.errors) {
      console.log('Error: ', error.errors[field].message);
    }
  }
}

// createCourseWithValidation();

async function getCourses() {
  const courses = await Course
    .find({ _id: '5df2f75f5cbede137c51aa67'})
    .sort({ name: 1 })
    .select({ name: 1, tags: 1, price: 1 });
  console.log('courses: ', courses[0]);
  // the price is rounded when getting the price property only
  console.log('courses: ', courses[0].price);
}

getCourses();
