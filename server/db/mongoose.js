var mongoose = require('mongoose');

mongoose.promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI ||'mongodb://localhost:27017/MR_Input');

module.exports = {mongoose};
