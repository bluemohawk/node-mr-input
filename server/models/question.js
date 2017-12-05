const mongoose = require('mongoose');

var QuestionSchema = new mongoose.Schema({

  assignedStudy:{
    type: mongoose.Schema.Types.ObjectId
  },
  initialOrder:{
    type: Number
  },
  updatedOrder:{
    type: Number,
    default: null
  },
  mainQueue:{
    type: Boolean
  },
  textQuestion:{
    type: String,
  },
  context:{
    type: String,
  },
  logic: {
    value: String,
    condition: String
  },
  arraofImages:{

  },
  arrayOfStrings:{

  }
});

QuestionSchema.statics.findAllByStudyID = function(id) {
  var Questions = this;
console.log(id);
  return Questions.find({assignedStudy: id}).then((questions)=>{

    if (!questions) {

      return;
    } else {

      return questions;
    }
  }
  , (e)=>{
      return e;
      }
  )
};

QuestionSchema.statics.removeAllByStudyID = function (studyID) {
  var Questions = this;

  return Questions.find({assignedStudy: studyID})
  .then((questions)=>{
      
    questions.forEach(function(singleQuestion) {

      return Questions.deleteMany({"_id": singleQuestion._id})
      .then(()=>{return }, (e)=>{return e});

    });
    return  questions;

  }, (e)=>{return e}
)};



var Question = mongoose.model('Question', QuestionSchema);

module.exports = {Question};
