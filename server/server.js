require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Question} = require('./models/question');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/question', (req, res)=>{

  var body = req.body;
  var question = new Question(body);

  question.save().then(
    (doc) => { res.send(doc)},
    (e) => { res.status(400).send(e)}
  );

});

app.listen(port, ()=>{
  console.log(`Started listening at ${port}`);
})
