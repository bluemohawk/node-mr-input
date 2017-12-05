const mongoose = require('mongoose');

var StudySchema = new mongoose.Schema({

  // @property (nonatomic) NSString *title;
  // @property (nonatomic) NSString *subtitle;
  // @property (nonatomic) NSArray *ArrayOfQuestionnaires;
  // @property (nonatomic) NSNumber *StudyNumber;
  // @property (nonatomic) NSNumber *reward;
  // @property (nonatomic) PFFile *StudyPicture;

  title: {
    type: String,
    required: false,
    minlength:1,
    trim: false
  },
  subTitle: {
    type: String,
    required: false
  },
  studyNumber: {
    type: Number
  },
  ArrayOfQuestionnaires:{
    type:[mongoose.Schema.Types.ObjectId],
    default: null
  },
  logicTable: {
    //
  }

});


StudySchema.statics.findByStudyId = function (studyId) {
  var Study = this;
  //findOne returns an object, whereas find returns a cursor (an array of objects)
  return Study.findOne({ _id:studyId })
  .then((study)=> {

      if(!study) {

        return;

      } else {

        return study;
      }
    }, (e)=>{
      return e;
    }
  )
};

// StudySchema.statics.removeByID = function(studyID) {
//   var Study = this;
//
//   return Study.findOne({_id: studyID})
//   .then((study)=>{
//
//     Study.deleteMany({"_id": study._id})
//     .then(()=>{}, (e)=>{return e});
//
//     });
//     return  study;
//
//   }, (e)=>{return e}
// )};

var Study = mongoose.model('Study', StudySchema);

module.exports = {Study};
