const express = require('express');
const { body, params } = require('express-validator');

const router = express.Router();

router.post('/', [
  body('name').isLength({min: 1}),
  body('email').isEmail(),
  body('institution').isLength({min: 1}),
], (req, res, next) => {
  req.db.collection('students').insertOne({
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

module.exports = router;
