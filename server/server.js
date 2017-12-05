require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const multer = require('multer');
const upload = multer(); //{ dest: 'tmp-uploads/'}
const fs = require('fs');

var {mongoose} = require('./db/mongoose');
var {Question} = require('./models/question');
var {Study} = require('./models/study')
var {Image} = require('./models/image');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

//create a new study
app.post('/studies', upload.array(), (req, res)=>{

  var study = new Study(req.body);

  study.save().then(
    (doc) => {res.send(doc)},
    (e) => {res.status(400).send(e);}
  );

});

//modify an existing study
app.patch('/studies/:studyId', upload.array(), (req, res) =>{

  var studyId = req.params.studyId;
  if (!ObjectID.isValid(studyId)) {
    return res.status(404).send({text: 'study Id invalid'});
  };

  function delete_null_properties(test, recurse) {
    for (var i in test) {//for each key
      var a = test[i];// get the value
      if (!a) {//if the value is empty
        delete test[i];//then delete the key/value pair
      } else if (recurse && typeof test[i] === 'object' || _.isEmpty(test[i])) {
        //if the key is paired to an empty oject then delete the pair.
        delete test[i];
        delete_null_properties(test[i], recurse);
      };
    }
    return test;
  }

  var updatedElements = delete_null_properties(req.body, true);

  Study.findOneAndUpdate({
      _id:studyId,
    }, {
      $set: updatedElements
    }, {
      new: true
    }).then((study)=>{
      if (!study) {
        return res.status(404).send({text:'study to be modified not found'});
      };
      res.send(study);
    }).catch((e)=>{
      res.status(400).send(e);
    })
});

//get all studies
app.get('/studies', (req, res)=>{

  Study.find().then((studies)=>{

    if (!studies) {
       return res.status(404).send({text:'No studies found'});
    } else {
      res.send(studies);
    }
  }
  , (e)=>{
      res.send(e);
      }
  )
});

//create a new question and assign it to a study
app.post('/questions', upload.array(), (req, res)=>{

  var question = new Question(req.body);

  question.save().then(
    (doc) => {
      res.send(doc)},
    (e) => {res.status(400).send(e)}
  );

});

//get all questions associated to one study
app.get('/questions/:studyId', (req, res)=>{

  var studyId = req.params.studyId;
  if (!ObjectID.isValid(studyId)) {
    return res.status(404).send({text: 'study Id invalid'});
  };
  //does the study exist
  Study.findByStudyId(studyId)
  .then((study)=>{
    //retrieve all associated questions
    return Question.findAllByStudyID(study._id);
    })
  .then((questions)=>{

    res.send(questions);
    })
  .catch((errorMessage)=>{
    res.status(400).send(errorMessage);
    });
});

// //delete an existing study and associated questions and images
app.delete('/studies/:studyId', (req, res) => {

  var id = req.params.studyId;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({text: 'study Id invalid'});
  };


  Study.findOneAndRemove({ _id:id })

  .then((study) =>{

    if(!study) {
      return res.status(404).send({text: 'No study found'})
    }

    return Question.removeAllByStudyID(study._id);

  }).then((questions)=>{

    if(!questions) {
        return res.status(404).send({text: 'No questions found'})
      }

     return Image.removeAllByQuestionID(questions);

  }).then((images)=>{
    return res.status(200).send(console.log("done"));

  }).catch((e)=>{
    res.status(400).send(e);
  });
});

//modify an existing question
app.patch('/questions/:questionId', upload.array(), (req, res) =>{

  var questionId = req.params.questionId;
  if (!ObjectID.isValid(questionId)) {
    return res.status(404).send({text: 'question Id invalid'});
  };

  function delete_null_properties(test, recurse) {
    for (var i in test) {//for each key
      var a = test[i];// get the value
      if (!a) {//if the value is empty
        delete test[i];//then delete the key/value pair
      } else if (recurse && typeof test[i] === 'object' || _.isEmpty(test[i])) {
        //if the key is paired to an empty oject then delete the pair.
        delete test[i];
        delete_null_properties(test[i], recurse);
      };
    }
    return test;
  }

  var updatedElements = delete_null_properties(req.body, true);

  Question.findOneAndUpdate({
      _id:questionId,
    }, {
      $set: updatedElements
    }, {
      new: true
    }).then((question)=>{
      if (!question) {
        return res.status(404).send({text:'questions to modified not found'});
      };
      res.send(question);
    }).catch((e)=>{
      res.status(404).send(e);
    })
});

//delete an existing question and associated images
app.delete('/questions/:questionId', (req, res) => {

  var id = req.params.questionId;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({text: 'question Id invalid'});
  };

  Question.findOneAndRemove({
    _id:id,
  }).then((question)=>{

    if(!question) {
      return res.status(404).send({text: 'No question found'})
    }

    Image.removeAllByQuestionID(question);
    res.status(200).send(question);

  }).catch((e)=>{
    return res.status(400).send();
  });
});

//load one image and assign it to a question
app.post('/images', upload.single('image'), (req, res)=>{

  var image = new Image({
      title: req.file.originalname,
      bitMap: req.file.buffer.toString('base64'),
      assignedQuestion: req.body.assignedQuestion

    });

    image.save().then(
      (doc) => {res.send("success")},
      (e) => {res.status(400).send(e)}
    )

});

app.listen(port, ()=>{
  console.log(`Started listening at ${port}`);
});
