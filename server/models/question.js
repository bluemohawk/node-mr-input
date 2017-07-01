const mongoose = require('mongoose');

var QuestionSchema = new mongoose.Schema({

  questionType:{
    type: String,
    required: false
  },
  mainQuestion:{
    type: String,
    required: false
  }

});

var Question = mongoose.model('Question', QuestionSchema);

module.exports = {Question};
