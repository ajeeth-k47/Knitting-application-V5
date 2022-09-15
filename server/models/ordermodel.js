const mongoose = require('mongoose');
const conn = require('./database');

const yarnlistSchema = new mongoose.Schema({
    yarn:String,
    mill:String,
    color:String,
    weight:Number
  });


const orderlistSchema = new mongoose.Schema({
    orderNo:String,
    company:String,
    orderDate:Date,
    supplier:String,
    yarnCount:[
        yarnlistSchema
    ],
    yarnWeight:Number,
    balanceWeight:Number,
    status:String
});

const programlistSchema = new mongoose.Schema({
  orderNo:String,
  programNo:String,
  programDate:Date,
  supplier:String,
  fabricType:String,
  dia:Number,
  gauge:Number,
  loopLength:String,
  designNo:String,
  gsm:String,
  Weight:Number,
  targetDate:String,
  price:Number,
  tax:String,
  rolls:Number,
  production:Number,
  balance:Number,
  deliveredWgt:Number,
  deliveredrolls:Number,
  deliveryStatus:String
})

const deliveredProgramlistSchema = new mongoose.Schema({
  orderNo:String,
  programNo:String,
  deliveryNo:String,
  designNo:String,
  supplier:String,
  deliveryDate:Date,
  weight:Number,
  rollcount:Number,
  totalPrice:Number
})

const returnyarnSchema = new mongoose.Schema({
  orderNo:String,
  returnWeight:Number,
  returnDate:String,
  reason:String
})

const timelineSchema = new mongoose.Schema({
  orderNo:String,
  reference:String,
  datetime:Date,
  action:String,
  description:String
})


const primarykeylookupSchema = new mongoose.Schema({
   modelName:String,
   lastPrimaryKey:String,
   generatedDate:Date
})


const rollDetailSchema = new mongoose.Schema({
  programNo:String,
  orderNo:String,
  designNo:String,
  rollWeight:Number,
  rollcount:Number,
  rollDate:Date
})


const billinglistSchema = new mongoose.Schema({
  billNo:String,
  billDate:Date,
  orderNo:String,
  programNo:String,
  supplier:String,
  weight:Number,
  price:Number,
  tax:String,
  totalPrice:Number,
  totalBalance:Number,
  paymentStatus:String

})

const orderlist= mongoose.orderDB.model('orderlist', orderlistSchema);
const yarnlist= mongoose.orderDB.model('yarnlist', yarnlistSchema);
const programlist = mongoose.orderDB.model('programlist', programlistSchema); 
const returnyarn = mongoose.orderDB.model('returnyarn', returnyarnSchema); 
const timeline = mongoose.orderDB.model('timeline', timelineSchema);
const primarykeyLookup = mongoose.orderDB.model('primarykeyLookup',primarykeylookupSchema);
const rollDetails = mongoose.orderDB.model('rollDetails',rollDetailSchema);
const deliveredProgramlist = mongoose.orderDB.model('deliveredProgramlist',deliveredProgramlistSchema); 
const billinglist = mongoose.orderDB.model('billinglist',billinglistSchema);

module.exports = {
  orderlist,
  yarnlist,
  programlist,
  returnyarn,
  timeline,
  primarykeyLookup,
  rollDetails,
  deliveredProgramlist,
  billinglist
}


