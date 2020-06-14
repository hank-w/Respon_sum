module.exports.instructorDocToResponse = function instructorDocToResponse(doc) {
  return {
    id: doc._id,
    name: doc.name,
    email: doc.email,
    institution: doc.institution,
  };
};
