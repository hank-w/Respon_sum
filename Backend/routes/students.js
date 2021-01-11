const { ObjectId } = require('mongodb');
const express = require('express');
const { body, param } = require('express-validator');

const { studentDocToResponse } = require('./get-students.js');
const { responseDocToResponse } = require('./get-responses.js');
const { getCurrentOrPastClasses } = require('./get-classes.js');
const pagination = require('../middleware/pagination.js');
const ordering = require('../middleware/ordering.js');
const validate = require('../middleware/validate.js');

const router = express.Router();

router.post('/', [
  body('name').isLength({ min: 1 }),
  body('email').isEmail(),
  body('studentNumber').isLength({ min: 1 }),
  body('institution').isLength({ min: 1 }),
  validate,
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
      num_unresponded: 0,
      correct_percent: 0,
      incorrect_percent: 0,
      unresponded_percent: 0,
    },
    responses: []
  }, (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    return res.status(200).json({ id: result.insertedId });
  });
});

// query studentID
router.get('/:studentId', [
  param('studentId').isLength({ min: 1 }),
  validate,
], (req, res) => {
  req.db.collection('students').findOne({ _id: ObjectId(req.params.studentId) }, (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (!result) return res.status(404).json({ msg: 'Student Not Found' });
    return res.status(200).json(studentDocToResponse(result));
  });
});

router.put('/:studentId', [
  param('studentId').isLength({ min: 1 }),
  body('name').isLength({ min: 1 }),
  body('email').isEmail(),
  body('studentNumber').isLength({ min: 1 }),
  body('institution').isLength({ min: 1 }),
  validate,
], (req, res) => {
  req.db.collection('students').updateOne({ _id: ObjectId(req.params.studentId) }, {
    $set: {
      name: req.body.name,
      email: req.body.email,
      student_number: req.body.studentNumber,
      institution: req.body.institution,
    }
  }, (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (result.modifiedCount === 0) return res.status(404).json({ msg: 'Student Not Found' });
    res.status(200).json({ msg: 'Student Successfully Updated' });
  });
});

router.delete('/:studentId', [
  param('studentId').isLength({ min: 1 }),
  validate,
], (req, res) => {
  req.db.collection('students').deleteOne({ _id: ObjectId(req.params.studentId ) }, (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (result.deletedCount === 0) return res.status(404).json({ msg: 'Student Not Found' });
    res.status(200).json({ msg: 'Student Deleted' });
  });
});

router.use('/:studentId/responses', pagination());
router.use('/:studentId/responses', ordering(['recency', 'correct', 'wrong'], 'recency'));
router.get('/:studentId/responses', [
  param('studentId').isLength({ min: 1 }),
  validate,
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
    return res.status(200).json(docs.map(responseDocToResponse));
  });
});

router.use('/:studentId/current-classes', pagination());
router.get('/:studentId/current-classes', [
  param('studentId').isLength({ min: 1 }),
  validate,
], getCurrentOrPastClasses(req => ({ students: req.params.studentId }), true));

router.use('/:studentId/past-classes', pagination());
router.get('/:studentId/past-classes', [
  param('studentId').isLength({ min: 1 }),
  validate,
], getCurrentOrPastClasses(req => ({ students: req.params.studentId }), false));

module.exports = router;
