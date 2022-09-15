const mongoose = require('mongoose');
const conn = require('./database');



const operatorlistSchema = new mongoose.Schema({
  Code:Number,
  Name:String,
  Gender:String,
  DOB:String,
  Age:Number,
  DOJ:String,
  AadhaarNo:String,
  MobileNo:Number,
  Status:String
});

const operatormappingSchema = new mongoose.Schema({
  Name:String,
  Machine:String,
  Date:String,
  Shift:String
});



const operatorslist= mongoose.operatorDB.model('operatorslist', operatorlistSchema);
const operatormapping= mongoose.operatorDB.model('operatormapping', operatormappingSchema);

module.exports = {
  operatorslist,
  operatormapping,
}
