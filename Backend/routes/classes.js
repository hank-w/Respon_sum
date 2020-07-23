const express = require('express');
const { body, params } = require('express-validator');

const { studentDocToResponse } = require('./get-students.js');
const { instructorDocToResponse } = require('./get-instructors.js');
const { classDocToResponse } = require('./get-classes.js');
const { questionDocToResponse } = require('./get-questions.js');
const { responseDocToResponse } = require('./get-responses.js');
const { statsDocToResponse } = require('./get-stats.js');
const pagination = require('../middleware/pagination.js');
const ordering = require('../middleware/ordering.js');
const searching = require('../middleware/searching.js');

const router = express.Router();

// Note: when setting up the DB you must run
// >>> db.classes.createIndex({ name: 'text' })
// to allow searching over class names.
// later down the line: implement searching by instructor and institution

router.use('/', pagination());
router.use('/', searching());
router.get('/', (req, res) => {
  // check if parameters are filled with query
  let query = {};
  if (req.query.active !== undefined) {
    query.active = !!req.query.active;
  }
  if (req.query.institution !== undefined) {
    query.institution = req.query.institution + '';
  }
  if (req.searching.searchText !== null) {
    query.$text = { $search: req.searching.searchText };
  }
  
  req.db.collection('classes')
  .find(query)
  .skip(req.pagination.skip)
  .limit(req.pagination.limit)
  .toArray((err, docs) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    res.status(200).json(docs.map(classDocToResponse));
  });
});

router.post('/', [  
  body('name').isLength({ min: 1 }),
  body('active').toBoolean(),
  body('institution').isLength({ min: 1 }),
  body('instructorIds').custom(value => Array.isArray(value) && value.length >= 1),
  body('instructorIds.*').not().isEmpty(),
], (req, res) => {
  // check that all the instructors exist
  req.db.collection('instructors').countDocuments({
    _id: { $in: req.body.instructorIds }
  }, { limit: req.body.instructorIds.length }, (err, count) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (count !== req.body.instructorIds.length) {
      return res.status(422).json({ msg: 'Invalid or duplicate instructor IDs' });
    }
    
    req.db.collection('classes').insertOne({
      name: req.body.name,
      active: req.body.active,
      institution: req.body.institution,
      instructors: req.body.instructorIds,
      students: [],
      questions: [],
      responses: [],
      aggregate_stats: {
        num_correct: 0,
        num_incorrect: 0,
        num_unanswered: 0,
        correct_percent: 0,
        incorrect_percent: 0,
        unresponded_percent: 0,
      }
    }, (err, result) => {
      if (err) return res.status(500).json({ msg: 'Database Error' });
      res.status(200).json({ id: result._id });
    });
  });
});

router.get('/:classId', [
  params('classId').isLength({ min: 1 })
], (req, res) => {
  req.db.collection('classes').findOne({ _id: req.params.classId }, (err, doc) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (!doc) return res.status(404).json({ msg: 'Class Not Found' });
    res.status(200).json(classDocToResponse(doc));
  });
});

router.put('/:classId', [
  params('classId').isLength({ min: 1 }),
  body('name').isLength({ min: 1 }),
  body('active').toBoolean(),
  body('institution').isLength({ min: 1 }),
  body('instructorIds').custom(value => Array.isArray(value) && value.length >= 1),
  body('instructorIds.*').not().isEmpty(),
], (req, res) => {
  req.db.collection('classes').updateOne({ _id: req.params.classId }, {
    $set: {
      name: req.body.name,
      active: req.body.active,
      institution: req.body.institution,
      instructorIds: req.body.instructorIds,
    }
  }, (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (result.modifiedCount === 0) {
      return res.status(404).json({ msg: 'Class Not Found' });
    }
    res.status(200).json({ msg: 'Class Successfully Updated' });
  });
});

router.delete('/:classId', [
  params('classId').isLength({ min: 1 })
], (req, res) => {
  req.db.collection('classes').deleteOne({ _id: req.params.classId }, (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (result.deletedCount === 0) return res.status(404).json({ msg: 'Class Not Found' });
    res.status(200).json({ msg: 'Class Deleted' });
  });
});

router.get('/:classId/active', [
  params('classId').isLength({ min: 1 })
], (req, res) => {
  req.db.collection.findOne({ _id: req.params.classId }, (err, doc) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (!doc) return res.status(404).json({ msg: 'Class Not Found' });
    res.status(200).json({ active: doc.active });
  });
});

router.put('/:classId/active', [
  params('classId').isLength({ min: 1 }),
  body('active').toBoolean()
], (req, res) => {
  req.db.collection('classes').updateOne({ _id: req.params.classId }, {
    $set: {
      active: req.body.active,
    }
  }, (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (result.modifiedCount === 0) {
      return res.status(404).json({ msg: 'Class Not Found' });
    }
    res.status(200).json({ msg: 'Class Active Status Successfully Updated' });
  });
});

router.get('/:classId/instructors', [
  params('classId').isLength({ min: 1 }),
], (req, res) => {
  req.db.collection('classes').findOne({ _id: req.params.classId }, (err, classDoc) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (!classDoc) return res.status(404).json({ msg: 'Class Not Found' });
    const instructorIds = classDoc.instructors;
    req.db.collection('instructors').find({ _id: { $in: instructorIds } }).toArray((err, docs) => {
      if (err) return res.status(500).json({ msg: 'Database Error' });
      res.status(200).json(docs.map(instructorDocToResponse));
    });
  });
});

router.put('/:classId/instructors/:instructorId', [
  param('classId').isLength({ min: 1 }),
  param('instructorId').isLength({ min: 1 }),
], (req, res) => {
  // make sure the instructor exists before adding
  req.db.collection('instructors').countDocuments({ _id: req.params.instructorId },
      { limit: 1 }, (err, count) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (count !== 1) return res.status(404).json({ msg: 'Instructor Not Found' });

    req.db.collection('class').updateOne({
      _id: req.params.classId,
      active: true,
    }, {
      $addToSet: { instructors: req.params.instructorId },
    }, (err, result) => {
      if (err) return res.status(500).json({ msg: 'Database Error' });
      if (result.modifiedCount === 0) {
        return res.status(404).json({ msg: 'Class not found or not active' });
      }
  
      req.db.collection('instructors').updateOne({ _id: req.params.instructorId }, {
        $addToSet: { currently_owned_classes: req.params.classId },
      }, (err, result) => {
        if (err) return res.status(500).json({ msg: 'Database Error' });
        if (result.modifiedCount === 0) {
          return res.status(404).json({ msg: 'Instructor Not Found (????)' });
        }
        return res.status(200).json({ msg: 'Instructor Successfully Linked' });
      });
    });
  });
});

router.delete('/:classId/instructors/:instructorId', [
  params('classId').isLength({ min: 1 }),
  params('instructorId').isLength({ min: 1 }),
], (req, res) => {
  req.db.collection('classes').updateOne({
    _id: req.params.classId,
    active: true,
  }, {
    $pull: { instructors: req.params.instructorId },
  }, (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (result.modifiedCount !== 1) {
      return res.status(404).json({ msg: 'Class not found or not active' });
    }
    
    req.db.collection('instructors').updateOne({ _id: req.params.instructorId }, {
      $pull: { currently_owned_classes: req.params.classId },
    }, (err, result) => {
      if (err) return res.status(500).json({ msg: 'Database Error' });
      if (result.modifiedCount === 0) {
        return res.status(404).json({ msg: 'Instructor Not Found (????)' });
      }
      return res.status(200).json({ msg: 'Instructor Successfully Unlinked' });
    });
  });
});

router.use('/:classId/students', pagination());
router.get('/:classId/students', [
  params('classId').isLength({ min: 1 }),
], (req, res) => {
  req.db.collection('classes').findOne({ _id: req.params.classId }, (err, classDoc) => {
    if (err) return res.status(500).json({ msg: 'Class Not Found' });
    const studentIds = classDoc.students;
    req.db.collection('students')
    .find({ _id: { $in: studentIds} })
    .skip(req.pagination.skip)
    .limit(req.pagination.limit)
    .toArray((err, docs) => {
      if (err) return res.status(500).json({ msg: 'Database Error'});
      res.status(200).json(docs.map(studentDocToResponse));
    });
  });
});

router.put('/:classId/students/:studentId', [
  param('classId').isLength({ min: 1 }),
  param('studentId').isLength({ min: 1 }),
], (req, res) => {
  // make sure the student exists before adding
  req.db.collection('instructors').countDocuments({ _id: req.params.studentId },
      { limit: 1 }, (err, count) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (count !== 1) return res.status(404).json({ msg: 'Student Not Found' });
      
    req.db.collection('class').updateOne({
      _id: req.params.classId,
      active: true,
    }, {
      $addToSet: { students: req.params.studentId },
    }, (err, result) => {
      if (err) return res.status(500).json({ msg: 'Database Error' });
      if (result.modifiedCount == 0) {
        return res.status(404).json({ msg: 'Class not found or not active' });
      }
      req.db.collection('students').updateOne({ _id: req.params.instructorId }, {
        $addToSet: { current_classes: req.params.classId },
      }, (err, result) => {
        if (err) return res.status(500).json({ msg: 'Database Error' });
        if (result.modifiedCount === 0) {
          return res.status(404).json({ msg: 'Student Not Found' });
        }
        return res.status(200).json({ msg: 'Student Successfully Linked' });
      });
    });
  });
});

router.delete('/:classId/student/:studentId', [
  params('classId').isLength({ min: 1 }),
  params('studentId').isLength({ min: 1 }),
], (req, res) => {
  req.db.collection('classes').updateOne({
    _id: req.params.classId,
    active: true,
  }, {
    $pull: { students: req.params.studentId },
  }, (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (result.modifiedCount !== 1) {
      return res.status(404).json({ msg: 'Class not found or not active' });
    }
    req.db.collection('students').updateOne({ _id: req.params.studentId }, {
      $pull: { current_classes: req.params.classId },
    }, (err, result) => {
      if (err) return res.status(500).json({ msg: 'Database Error' });
      if (result.modifiedCount === 0) {
        return res.status(404).json({ msg: 'Student Not Found' });
      }
      return res.status(200).json({ msg: 'Student Successfully Unlinked' });
    });
  });
});

router.get('/:classId/student/:studentId/performance', [
  params('classId').isLength({ min: 1 }),
  params('studentId').isLength({ min: 1 }),
], (req, res) => {
  req.db.collection('students').findOne({ _id: req.params.studentId }, (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (!result) return res.status(404).json({ msg: 'Student Not Found' });
    if (!(req.params.classId in result.class_id_to_performance)) {
      return res.status(400).json({ msg: 'Student Not In Class' });
    }
    const stats = result.class_id_to_performance[req.params.classId];
    return res.status(200).json(statsDocToResponse(stats));
  });
});

router.use('/:classId/responses', pagination());
router.use('/:classId/responses', ordering(['recency', 'correct', 'incorrect'], 'recency'));
router.use('/:classId/responses', searching());
router.get('/:classId/responses', [
  param('classId').isLength({ min: 1 }),
], (req, res) => {
  const query = {
    'class': req.params.classId,
  };

  if (req.query.query) {
    query.$text = req.searching.query;
  }
  if (req.ordering.orderBy === 'correct' || req.ordering.orderBy === 'incorrect') {
    query.correct = { $exists: true };
  }

  const cursor = req.db.collection('responses')
  .find(query)
  .skip(req.pagination.skip)
  .limit(req.pagination.limit);

  const orderDir = req.ordering.order === 'asc' ? 1 : -1;
  const inverseOrderDir = (orderDir === 1) ? -1 : 1;

  switch (req.ordering.orderBy) {
    case 'recency':
    default:
      cursor.sort('timestamp', inverseOrderDir);
      break;
    case 'correct':
      cursor.sort(['correct', 'timestamp'], orderDir);
      break;
    case 'incorrect':
      cursor.sort([['correct', inverseOrderDir], ['timestamp', orderDir]]);
      break;
  }

  cursor.toArray((err, docs) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    return res.status(200).json(docs.map(responseDocToResponse));
  });
});

router.use('/:classId/questions', pagination());
router.use('/:classId/questions', searching());
router.get('/:classId/questions', [
  param('classId').isLength({ min: 1 }),
], (req, res) => {
  const query = {
    'class': req.params.classId,
  };

  if (req.query.query) {
    query.$text = req.searching.query;
  }
  if (req.query.viewableByStudents !== undefined) {
    query.viewable_by_students = req.query.viewableByStudents;
  }
  
  req.db.collection('questions')
  .find(query)
  .skip(req.pagination.skip)
  .limit(req.pagination.limit)
  .toArray((err, docs) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    return res.status(200).json(docs.map(questionDocToResponse));
  });
});

router.post('/:classID/questions', [
  body('type').isLength({ min: 1 }),
], (req, res) => {
  if (req.body.type === 'multiple-choice') {
    req.db.collection('questions').insertOne({
      questionText: req.body.questionText,
      numAnswers: req.body.numAnswers,
      correctAnswer: req.body.correctAnswer,
    });
  }
  if (req.body.type === 'short-answer') {
    req.db.collection('questions').insertOne({
      questionText: req.body.questionText,
      numAnswers: 1,
      answerText: req.body.answerText
    })
  }  
   (err, result) => {
     if (err) return res.status(500).json({ msg: 'Database Error'});
     res.status(200).json({ id: result._id});
   };
});

router.get('/:classId/questions/questionId', [
  params('classId').isLength({ min: 1})
], (req, res))

module.exports = router;
