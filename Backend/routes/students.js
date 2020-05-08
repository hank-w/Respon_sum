const express = require('express');
const { body, params } = require('express-validator');

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

module.exports = router;
