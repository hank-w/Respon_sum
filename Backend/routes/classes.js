const { ObjectId } = require('mongodb');
const express = require('express');
const { body, param } = require('express-validator');

const { studentDocToResponse } = require('./get-students.js');
const { instructorDocToResponse } = require('./get-instructors.js');
const { classDocToResponse } = require('./get-classes.js');
const { questionDocToResponse } = require('./get-questions.js');
const { responseDocToResponse } = require('./get-responses.js');
const { statsDocToResponse } = require('./get-stats.js');
const pagination = require('../middleware/pagination.js');
const ordering = require('../middleware/ordering.js');
const searching = require('../middleware/searching.js');
const validate = require('../middleware/validate.js');

const router = express.Router();

// Note: when setting up the DB you must run
// >>> db.classes.createIndex({ name: 'text' })
// to allow searching over class names. Case insensitive, can search by letters
// Note this might not be necessary now with $regex.
// later down the line: implement searching by instructor and institution

router.use('/', pagination());
router.use('/', searching());
router.get('/', (req, res) => {
  // check if parameters are filled with query
  let query = {};
  if (req.query.active !== undefined) {
    query.active = (req.query.active === 'true');
  }
  if (req.query.institution !== undefined) {
    query.institution = req.query.institution + '';
  }
  if (req.searching.query !== null) {
    query.name = { $regex: req.searching.query, $options: 'i' };
  }
  
  req.db.collection('classes')
  .find(query)
  .skip(req.pagination.skip)
  .limit(req.pagination.limit)
  .toArray((err, docs) => {
    if (err) return res.status(500).json({ msg: 'Database Error', error: err });
    res.status(200).json(docs.map(classDocToResponse));
  });
});

router.post('/', [  
  body('name').isLength({ min: 1 }),
  body('active').toBoolean(),
  body('institution').isLength({ min: 1 }),
  body('instructorIds').custom(value => Array.isArray(value) && value.length >= 1),
  body('instructorIds.*').not().isEmpty(),
  validate,
], (req, res) => {
  // check that all the instructors exist
  req.db.collection('instructors').countDocuments({
    _id: { $in: req.body.instructorIds.map(ObjectId) }
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
      res.status(200).json({ id: result.insertedId });
    });
  });
});

router.get('/:classId', [
  param('classId').isLength({ min: 1 }),
  validate,
], (req, res) => {
  req.db.collection('classes').findOne({ _id: ObjectId(req.params.classId ) }, (err, doc) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (!doc) return res.status(404).json({ msg: 'Class Not Found' });
    res.status(200).json(classDocToResponse(doc));
  });
});

router.put('/:classId', [
  param('classId').isLength({ min: 1 }),
  body('name').isLength({ min: 1 }),
  body('active').toBoolean(),
  body('institution').isLength({ min: 1 }),
  body('instructorIds').custom(value => Array.isArray(value) && value.length >= 1),
  body('instructorIds.*').not().isEmpty(),
  validate,
], (req, res) => {
  req.db.collection('classes').updateOne({ _id: ObjectId(req.params.classId ) }, {
    $set: {
      name: req.body.name,
      active: req.body.active,
      institution: req.body.institution,
      instructorIds: req.body.instructorIds,
    }
  }, (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (result.modifiedCount === 0) {
      return res.status(404).json({ msg: 'Class Not Updated' });
    }
    res.status(200).json({ msg: 'Class Successfully Updated' });
  });
});

router.delete('/:classId', [
  param('classId').isLength({ min: 1 }),
  validate,
], (req, res) => {
  req.db.collection('classes').deleteOne({ _id: ObjectId(req.params.classId ) }, (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (result.deletedCount === 0) return res.status(404).json({ msg: 'Class Not Found' });
    res.status(200).json({ msg: 'Class Deleted' });
  });
});

router.get('/:classId/active', [
  param('classId').isLength({ min: 1 }),
  validate,
], (req, res) => {
  req.db.collection('classes').findOne({ _id: ObjectId(req.params.classId ) }, (err, doc) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (!doc) return res.status(404).json({ msg: 'Class Not Found' });
    res.status(200).json({ active: doc.active });
  });
});

// todo: fix inconsistencies when changing active
router.put('/:classId/active', [
  param('classId').isLength({ min: 1 }),
  body('active').toBoolean(),
  validate,
], (req, res) => {
  req.db.collection('classes').updateOne({ _id: ObjectId(req.params.classId ) }, {
    $set: {
      active: req.body.active,
    }
  }, (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (result.modifiedCount === 0) {
      return res.status(404).json({ msg: 'Class Not Updated' });
    }
    res.status(200).json({ msg: 'Class Active Status Successfully Updated' });
  });
});

router.get('/:classId/instructors', [
  param('classId').isLength({ min: 1 }),
  validate,
], (req, res) => {
  req.db.collection('classes').findOne({ _id: ObjectId(req.params.classId ) }, (err, classDoc) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (!classDoc) return res.status(404).json({ msg: 'Class Not Found' });
    const instructorIds = classDoc.instructors;
    req.db.collection('instructors')
    .find({ _id: { $in: instructorIds.map(ObjectId) } })
    .sort({ name: 1 })
    .toArray((err, docs) => {
      if (err) return res.status(500).json({ msg: 'Database Error' });
      res.status(200).json(docs.map(instructorDocToResponse));
    });
  });
});

router.put('/:classId/instructors/:instructorId', [
  param('classId').isLength({ min: 1 }),
  param('instructorId').isLength({ min: 1 }),
  validate,
], (req, res) => {
  // make sure the instructor exists before adding
  req.db.collection('instructors').countDocuments({ _id: ObjectId(req.params.instructorId ) },
      { limit: 1 }, (err, count) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (count !== 1) return res.status(404).json({ msg: 'Instructor Not Found' });

    req.db.collection('classes').updateOne({
      _id: ObjectId(req.params.classId),
      active: true,
    }, {
      $addToSet: { instructors: req.params.instructorId },
    }, (err, result) => {
      if (err) return res.status(500).json({ msg: 'Database Error' });
      if (result.modifiedCount === 0) {
        return res.status(404).json({ msg: 'Class not updated or not active' });
      }
  
      req.db.collection('instructors').updateOne({ _id: ObjectId(req.params.instructorId ) }, {
        $addToSet: { owned_classes: req.params.classId },
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
  param('classId').isLength({ min: 1 }),
  param('instructorId').isLength({ min: 1 }),
  validate,
], (req, res) => {
  req.db.collection('classes').updateOne({
    _id: ObjectId(req.params.classId),
    active: true,
  }, {
    $pull: { instructors: req.params.instructorId },
  }, (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (result.modifiedCount !== 1) {
      return res.status(404).json({ msg: 'Class not updated or not active' });
    }
    
    req.db.collection('instructors').updateOne({ _id: ObjectId(req.params.instructorId ) }, {
      $pull: { owned_classes: req.params.classId },
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
  param('classId').isLength({ min: 1 }),
  validate,
], (req, res) => {
  req.db.collection('classes').findOne({ _id: ObjectId(req.params.classId ) }, (err, classDoc) => {
    if (err) return res.status(500).json({ msg: 'Class Not Found' });
    const studentIds = classDoc.students;
    req.db.collection('students')
    .find({ _id: { $in: studentIds.map(ObjectId) } })
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
  validate,
], (req, res) => {
  // make sure the student exists before adding
  req.db.collection('students').countDocuments({ _id: ObjectId(req.params.studentId ) },
      { limit: 1 }, (err, count) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (count !== 1) return res.status(404).json({ msg: 'Student Not Found' });
      
    req.db.collection('classes').updateOne({
      _id: ObjectId(req.params.classId),
      active: true,
    }, {
      $addToSet: { students: req.params.studentId },
    }, (err, result) => {
      if (err) return res.status(500).json({ msg: 'Database Error' });
      if (result.modifiedCount == 0) {
        return res.status(404).json({ msg: 'Class not found or not active, or already linked' });
      }
      req.db.collection('students').updateOne({ _id: ObjectId(req.params.studentId ) }, {
        $addToSet: { classes: req.params.classId },
        $set: { ['class_id_to_performance.' + req.params.classId]: {
          num_correct: 0,
          num_incorrect: 0,
          num_unresponded: 0,
        } },
      }, (err, result) => {
        if (err) return res.status(500).json({ msg: 'Database Error' });
        if (result.modifiedCount === 0) {
          return res.status(404).json({ msg: 'Student not found or already linked' });
        }
        return res.status(200).json({ msg: 'Student Successfully Linked' });
      });
    });
  });
});

router.delete('/:classId/students/:studentId', [
  param('classId').isLength({ min: 1 }),
  param('studentId').isLength({ min: 1 }),
  validate,
], (req, res) => {
  req.db.collection('classes').updateOne({
    _id: ObjectId(req.params.classId),
    active: true,
  }, {
    $pull: { students: req.params.studentId },
  }, (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (result.modifiedCount !== 1) {
      return res.status(404).json({ msg: 'Class not found or not active' });
    }
    req.db.collection('students').updateOne({ _id: ObjectId(req.params.studentId ) }, {
      $pull: { classes: req.params.classId },
      $unset: { ['class_id_to_performance.' + req.params.classId]: '' }
    }, (err, result) => {
      if (err) return res.status(500).json({ msg: 'Database Error' });
      if (result.modifiedCount === 0) {
        return res.status(404).json({ msg: 'Student Not Found' });
      }
      return res.status(200).json({ msg: 'Student Successfully Unlinked' });
    });
  });
});

router.get('/:classId/students/:studentId/performance', [
  param('classId').isLength({ min: 1 }),
  param('studentId').isLength({ min: 1 }),
  validate,
], (req, res) => {
  req.db.collection('students').findOne({ _id: ObjectId(req.params.studentId ) }, (err, result) => {
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
  validate,
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
  validate,
], (req, res) => {
  const query = {
    'class': req.params.classId,
  };

  if (req.searching.query) {
    query.$or = [
      { correct_answer: { '$regex': req.searching.query, '$options': 'i' } },
      { question_text: { '$regex': req.searching.query, '$options': 'i' } },
      { answer_texts: { '$regex': req.searching.query, '$options': 'i' } },
    ];
  }
  if (req.query.viewableByStudents !== undefined) {
    query.viewable_by_students = (req.query.viewableByStudents === 'true');
  }

  req.db.collection('questions')
  .find(query)
  .skip(req.pagination.skip)
  .limit(req.pagination.limit)
  .toArray((err, docs) => {
    if (err) return res.status(500).json({ msg: 'Database Error', err });
    return res.status(200).json(docs.map(questionDocToResponse));
  });
});

router.post('/:classId/questions', [
  body('type').isLength({ min: 1 }),
  validate,
], (req, res) => {
  const doc = {
    'class': req.params.classId,
    type: req.body.type,
    asked: 0,
    timestamps: [],
    responses: [],
    viewable_by_students: false,
    stats: [],
    instructors: [],
  };
  if (req.body.questionText !== undefined) {
    doc.question_text = req.body.questionText;
  }
  if (req.body.correctAnswer !== undefined) {
    doc.correct_answer = req.body.correctAnswer;
  }
  if (req.body.type === 'multiple-choice') {
    doc.num_answers = req.body.numAnswers;
    if (req.body.answerTexts !== undefined) {
      doc.answer_texts = req.body.answerTexts;
    }
  } else if (req.body.type !== 'short-answer') {
    return res.status(400).error({ msg: 'Invalid Type' });
  }
  req.db.collection('questions').insertOne(doc, (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    req.db.collection('classes').updateOne({ _id: ObjectId(req.params.classId) }, {
      $push: { questions: result.insertedId + '' }
    }, (err, classResult) => {
      if (err) return res.status(500).json({ msg: 'Database Error' });
      if (classResult.modifiedCount === 0) {
        return res.status(404).json({ msg: 'Class Not Found' });
      }
      res.status(200).json({ id: result.insertedId });
    });
  });
});

router.get('/:classId/questions/:questionId', [
  param('classId').isLength({ min: 1 }),
  param('questionId').isLength({ min: 1 }),
  validate,
], (req, res) => {
  req.db.collection('questions').findOne({ _id: ObjectId(req.params.questionId ) }, (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (!result) return res.status(404).json({ msg: 'Question Not Found' });
    return res.status(200).json(questionDocToResponse(result));
  });
});

router.put('/:classId/questions/:questionId', [
  param('classId').isLength({ min: 1 }),
  param('questionId').isLength({ min: 1 }),
  body('type').isLength({ min: 1 }),
  validate,
], (req, res) => {
  let toSet = {};
  if (req.body.correctAnswer !== undefined) toSet.correct_answer = req.body.correctAnswer;
  if (req.body.type === "multiple-choice") {
    toSet.num_answers = req.body.numAnswers;
    if (req.body.answerTexts !== undefined) toSet.answer_texts = req.body.answerTexts;
  }
  req.db.collection('questions').updateOne({ _id: ObjectId(req.params.questionId ) }, {
    $set: toSet
  }, (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (result.modifiedCount === 0) {
      return res.status(404).json({ msg: 'Question not found, or not updated' });
    }
    return res.status(200).json({ msg: 'Question Succesfully Updated' });
  });
});

router.delete('/:classId/questions/:questionId', [
  param('classId').isLength({ min: 1 }),
  param('questionId').isLength({ min: 1 }),
  validate,
], (req, res) => {
  req.db.collection('questions').deleteOne({ _id: ObjectId(req.params.questionId ) }, (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (result.deletedCount === 0) return res.status(404).json({ msg: 'Question Not Found' });
    req.db.collection('classes').updateOne({ _id: ObjectId(req.params.classId ) }, {
      $pull: {
        questions: req.params.questionId,
      }
    }, (err, result) => {
      if (err) return res.status(500).json({ msg: 'Database Error' });
      if (result.modifiedCount === 0) {
        return res.status(404).json({ msg: 'Class Not Found' });
      }
      return res.status(200).json({ msg: 'Question Successfully Deleted' });
    });
  });
});

router.get('/:classId/questions/:questionId/viewable-by-students', [
  param('classId').isLength({ min: 1}),
  param('questionId').isLength({ min: 1}),
  validate,
], (req, res) => {
  req.db.collection('questions').findOne({ _id: ObjectId(req.params.questionId) }, (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    return res.status(200).json({ viewableByStudents: result.viewable_by_students });
  });
});

router.put('/:classId/questions/:questionId/viewable-by-students', [
  param('classId').isLength({ min: 1 }),
  param('questionId').isLength({ min: 1 }),
  body('viewableByStudents').isBoolean(),
  validate,
], (req, res) => {
  req.db.collection('questions').updateOne({ _id: ObjectId(req.params.questionId) }, {
    $set: {
      viewable_by_students: req.body.viewableByStudents,
    }
  }, (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (result.modifiedCount === 0) {
      return res.status(404).json({ msg: 'Question not found or not updated' });
    }
    return res.status(200).json({ msg: 'Successfully Updated' });
  });
});

router.use('/:instructorId/questions', pagination());
router.use('/:instructorId/questions', ordering(['recency', 'correct', 'incorrect'], 'recency'));
router.get('/:classId/questions/:questionId/responses', [
  param('classId').isLength({ min: 1 }),
  param('questionId').isLength({ min: 1 }),
  validate,
], (req, res) => {
  let cursor = req.db.collection('responses').find({
    question: req.params.questionId,
  }).skip(req.pagination.skip).limit(req.pagination.limit);

  let orderDir = req.ordering.order === 'asc' ? 1 : -1;
  let inverseOrderDir = (orderDir === 1) ? -1 : 1;

  switch (req.ordering.orderBy) {
    case 'recency':
    default:
      cursor.sort('timestamp', inverseOrderDir);
      break;
    case 'correctPercent':
      cursor.sort('correct', orderDir);
      break;
    case 'incorrectPercent':
      cursor.sort('correct', inverseOrderDir);
      break;
  }

  cursor.toArray((err, docs) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    return res.status(200).json(docs.map(responseDocToResponse));
  });
});

function getResponseQuery(req) {
  return { student: req.params.studentId, question: req.params.questionId };
}


router.get('/:classId/questions/:questionId/responses/:studentId', [
  param('classId').isLength({ min: 1 }),
  param('questionId').isLength({ min: 1 }),
  param('studentId').isLength({ min: 1 }),
  validate,
], (req, res) => {
  req.db.collection('responses').findOne(getResponseQuery(req), (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (!result) return res.status(404).json({ msg: 'Response Not Found' });
    return res.status(200).json(responseDocToResponse(result));
  });
});

router.put('/:classId/questions/:questionId/responses/:studentId', [
  param('classId').isLength({ min: 1 }),
  param('questionId').isLength({ min: 1 }),
  param('studentId').isLength({ min: 1 }),
  validate,
], (req, res) => {
  req.db.collection('questions').findOne({ _id: ObjectId(req.params.questionId) }, (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (!result) return res.status(404).json({ msg: 'Question Not Found' });

    let doc = {
      timestamp: Date.now(),
      student: req.params.studentId,
      question: req.params.questionId,
      'class': req.params.classId,
    };
    const questionType = result.type;
    if (questionType === 'multiple-choice') {
      doc.answer_number = req.body.answerNumber;
    } else {
      doc.answer_text = req.body.answerText;
    }

    req.db.collection('responses').updateOne(
      getResponseQuery(req),
      { $set: doc },
      { upsert: true },
      (err, result) => {
        if (err) return res.status(500).json({ msg: 'Database Error', err });
        if (result.modifiedCount === 0) {
          return res.status(404).json({ msg: 'Response Not Found' });
        }
        return res.status(200).json({ msg: 'Successfully Updated' });
      });
  });
});

router.delete('/:classId/questions/:questionId/responses/:studentId', [
  param('classId').isLength({ min: 1 }),
  param('questionId').isLength({ min: 1 }),
  param('studentId').isLength({ min: 1 }),
  validate,
], (req, res) => {
  req.db.collection('responses').deleteOne(getResponseQuery(req), (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (result.deletedCount === 0) return res.status(404).json({ msg: 'Response Not Found' });
    return res.status(200).json({ msg: 'Response Successfully Deleted' });
  });
});

module.exports = router;
