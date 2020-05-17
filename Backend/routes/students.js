const express = require('express');
const { body, params } = require('express-validator');

const pagination = require('../middleware/pagination.js');
const ordering = require('../middleware/ordering.js');

const router = express.Router();

router.post('/', [
  body('name').isLength({ min: 1 }),
  body('email').isEmail(),
  body('studentNumber').isLength({ min: 1 }),
  body('institution').isLength({ min: 1 })
], (req, res) => {
  req.db.collection('students').insertOne({
    name: req.body.name,
    email: req.body.email,
    student_number: req.body.studentNumber,
    institution: req.body.institution,
    current_classes: [],
    prior_classes: [],
    class_id_to_performance: {},
    overall_performance: {
      num_correct: 0,
      num_incorrect: 0,
      num_unresponded: 0
    },
    responses: []
  }, (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    res.status(200).json({ id: result._id });
  });
});

// query studentID
router.get('/:studentId', [
  params('studentId').isLength({ min: 1 })
], (req, res) => {
  req.db.collection('students').findOne({ _id: req.params.studentId }, (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (!result) return res.status(404).json({ msg: 'Student Not Found' });
    return res.status(200).json({
      id: result._id,
      name: result.name,
      email: result.email,
      studentNumber: result.student_number,
      institution: result.institution,
      performance: {
        numCorrect: result.num_correct,
        numIncorrect: result.num_correct,
        numUnresponded: result.num_unresponded
      }
    });
  });
});

router.put('/:studentId', [
  params('studentId').isLength({ min: 1 }),
  body('name').isLength({ min: 1 }),
  body('email').isEmail(),
  body('studentNumber').isLength({ min: 1 }),
  body('institution').isLength({ min: 1 })
], (req, res) => {
  req.db.collection('students').updateOne({ _id: req.params.studentId }, {
    $set: {
      name: req.body.name,
      email: req.body.email,
      student_number: req.body.studentNumber,
      institution: req.body.institution,
    }
  }, (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (result.modifiedCount === 0) return res.status(404).json({ msg: 'Student Not Found' });
    res.status(200).json({ msg: 'Student Updated' });
  });
});

router.delete('/:studentId', [
  params('studentId').isLength({ min: 1 })
], (req, res) => {
  req.db.collection('students').deleteOne({ _id: req.params.studentId }, (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (result.deletedCount === 0) return res.status(404).json({ msg: 'Student Not Found' });
    res.status(200).json({ msg: 'Student Deleted' });
  });
});

router.use('/:studentId/responses', pagination());
router.use('/:studentId/responses', ordering(['recency', 'correct', 'wrong'], 'recency'));
router.get('/:studentId/responses', [
  params('studentId').isLength({ min: 1 })
], (req, res) => {
  let query = {
    student: req.params.studentId
  };
  
  if (req.ordering.orderBy === 'correct' || req.ordering.orderBy === 'wrong') {
    query.correct = { $exists: true };
  }
  // query responses for a student
  let cursor = req.db.collection('responses').find(query)
    .skip(req.pagination.skip).limit(req.pagination.limit);
  
  let orderDir = req.ordering.order === 'asc' ? 1 : -1;
  let inverseOrderDir = (orderDir === 1) ? -1 : 1;
  
  switch (req.ordering.orderBy) {
    case 'recency':
    default:
      cursor.sort('timestamp', inverseOrderDir);
      break;
    case 'correct':
      cursor.sort(['correct', 'timestamp'], orderDir);
      break;
    case 'wrong':
      cursor.sort([['correct', inverseOrderDir], ['timestamp', orderDir]]);
      break;
  }
  
  cursor.toArray((err, docs) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    
    let responses = [];
    for (let doc of docs) {
      let response = {
        id: doc._id,
        timestamp: doc.timestamp,
        studentId: doc.student,
        classId: doc['class'],
        questionId: doc.question,
        questionType: doc.question_type,
      };
      
      if (doc.hasOwnProperty('correct')) {
        response.correct = doc.correct;
      }
      if (doc.hasOwnProperty('answer_number')) {
        response.answerNumber = doc.answer_number;
      }
      if (doc.hasOwnProperty('answer_text')) {
        response.answerText = doc.answer_text;
      }
      
      responses.push(response);
    }
    
    res.status(200).json(responses);
  });
});

module.exports = router;
