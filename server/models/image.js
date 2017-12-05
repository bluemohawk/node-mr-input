var mongoose = require('mongoose');

var ImageSchema = new mongoose.Schema({

    title: {
      type: String,
      required: false,
      minlength:1,
      trim: false
    },
    bitMap: {
      type: String,
      required: false
    },
    completedAt: {
      type: Number,
      default: null
    },
    assignedQuestion: {
      type: mongoose.Schema.Types.ObjectId,
      required: false
    }
});

ImageSchema.statics.removeAllByQuestionID = function (questions) {
  var Images = this;

  if (Array.isArray(questions)) {
    return questions.forEach( function(singleQuestion) {

      return Images.deleteMany({"assignedQuestion": singleQuestion._id})
      .then((images)=>{return console.log(images.deletedCount);}, (e)=>{return console.log(e);})
    })
  } else {

    return Images.deleteMany({"assignedQuestion": questions._id})
    .then((images)=>{return console.log(images.deletedCount);}, (e)=>{return console.log(e);})

  }

};

var Image = mongoose.model('Image', ImageSchema);

module.exports = {Image};
