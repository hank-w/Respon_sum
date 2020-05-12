const express = require('express');
const { body, params } = require('express-validator');

const pagination = require('../middleware/pagination.js');
const ordering = require('../middleware/pagination.js');
const searching = require('../middleware/pagination.js');

const router = express.Router();

router.post('/', [
  body('name').isLength({min: 1}),
  body('email').isEmail(),
  body('institution').isLength({min: 1}),
], (req, res, next) => {
  req.db.collection('instructors').insertOne({
    name: req.body.name,
    email: req.body.email,
    institution: req.body.institution,
    currently_owned_classes: [],
    prior_owned_classes: [],
    class_id_to_performance: {},
    questions: [],
  }, (err, result) => {
    if (err) return result.status(500).json({msg: 'Database Error'});
    res.status(200).json({ id: result._id });
  });
});

router.get('/:instructorId', [
  params('instructorID').isLength({min: 1})
], (req, res) => {
  req.db.collection('instructors').findOne({ _id: req.params.instructorId }, (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database Error'});
    if (!result) return res.status(404).json({ msg: 'Not Found' });
    return res.status(200).json({
      id: result._id,
      name: result.name,
      email: result.email,
      institution: resut.institution,
    });
  });
});

router.put('/:instructorId', [
  params('instructorID').isLength({min: 1}),
  body('name').isLength({min: 1}),
  body('email').isEmail(),
  body('institution').isLength({min: 1}),
], (req, res) => {
  req.db.collection('instructors').updateOne({ _id: req.params.studentId }, {
    $set: {
      name: req.body.name,
      email: req.body.email,
      institution: req.body.institution,
    }
  }, (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (result.modifiedCount === 0) {
      return res.status(404).json({ msg: 'Instructor Not Found' });
    }
    res.status(200).json({ msg: 'Instructor Updated' });
  });
});

router.delete('/:instructorId', [
  params('instructorId').isLength({ min: 1 })
], (req, res) => {
  req.db.collection('instructors').deleteOne({ _id: req.params.instructorId }, (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database Error' });
    if (result.deletedCount === 0) return res.status(404).json({ msg: 'Instructor Not Found' });
    res.status(200).json({ msg: 'Instructor Deleted' });
  });
});

router.use('/:instructorId/questions', pagination());
router.use('/:instructorId/questions', ordering(
  ['recency', 'correctPercent', 'incorrectPercent', 'unrespondedPercent'], 'recency'))
router.get('/:instructorId/questions', [
  params('instructorId').isLength({min: 1})
], (req, res) => {
  let cursor = req.db.collection('instructors').find({})
    .skip(req.pagination.skip).limit(req.pagination.limit);
  
  let orderDir = req.ordering.order === 'asc' ? 1 : -1;
  
  switch (req.ordering.orderBy) {
    case 'recency':
    default:
      cursor.sort();
      
  }
});

module.exports = router;
