const mongoose = require('mongoose');
mongoose.connect(process.env.MASTERDB_URI,{ useNewUrlParser: true , useUnifiedTopology: true , maxPoolSize:3});

const db = mongoose.connection;
db.on('error' , console.error.bind(console, 'connection error:'));
db.once('open' , function(){
  console.log('Connected with masterdatabase');
});

mongoose.operatorDB=mongoose.createConnection(process.env.OPERATORDB_URI,{ useNewUrlParser: true , useUnifiedTopology: true , maxPoolSize:3 });
mongoose.orderDB=mongoose.createConnection(process.env.ORDERDB_URI,{ useNewUrlParser: true , useUnifiedTopology: true , maxPoolSize:3 });

//Models
const {diamaster,gaugemaster,fabricmaster,yarnmaster,colormaster,millmaster,machinemaster,taxmaster,companymaster,suppliermaster} = require('./mastermodel');
const {operatorslist,operatormapping} = require('./operatormodel');
const {orderlist,yarnlist,programlist,returnyarn,timeline,primarykeyLookup,rollDetails,billinglist} = require('./ordermodel');

module.exports = mongoose;
