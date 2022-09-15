const mongoose = require('mongoose');

const diamasterSchema = new mongoose.Schema({
  Dia:Number,
  Status:String
});

const gaugemasterSchema = new mongoose.Schema({
  Gauge:Number,
  Status:String
});

const fabricmasterSchema = new mongoose.Schema({
  FabricType:String,
  Status:String
});

const yarnmasterSchema = new mongoose.Schema({
  YarnCount:Number,
  Status:String
});

const colormasterSchema = new mongoose.Schema({
  Color:String,
  Alternate:String,
  Status:String
});

const millmasterSchema = new mongoose.Schema({
  Mill:String,
  Status:String
});

const machinemasterSchema = new mongoose.Schema({
  MachineName:String,
  Name:String,
  Dia:Number,
  Gauge:Number,
  Status:String
});

const taxmasterSchema = new mongoose.Schema({
  TaxName:String,
  SGST:Number,
  CGST:Number,
  IGST:Number,
  Total:Number,
  Status:String
})

const companymasterSchema = new mongoose.Schema({
  Name:String,
  Address1:String,
  Address2:String,
  Country:String,
  State:String,
  City:String,
  Pincode:Number,
  PhoneNo:String,
  MobileNo:Number,
  Email:String,
  Website:String,
  GSTNo:String,
  PANNo:String
})

const suppliermasterSchema = new mongoose.Schema({
  Name:String,
  Address1:String,
  Address2:String,
  Country:String,
  State:String,
  City:String,
  Pincode:Number,
  PhoneNo:String,
  MobileNo:Number,
  Email:String,
  Website:String,
  GSTNo:String,
  PANNo:String
})

const diamaster= mongoose.model('diamaster', diamasterSchema);
const gaugemaster= mongoose.model('gaugemaster', gaugemasterSchema);
const fabricmaster= mongoose.model('fabricmaster', fabricmasterSchema);
const yarnmaster= mongoose.model('yarnmaster', yarnmasterSchema);
const colormaster= mongoose.model('colormaster', colormasterSchema);
const millmaster= mongoose.model('millmaster', millmasterSchema);
const machinemaster= mongoose.model('machinemaster', machinemasterSchema);
const taxmaster= mongoose.model('taxmaster',taxmasterSchema);
const companymaster= mongoose.model('companymaster',companymasterSchema);
const suppliermaster= mongoose.model('suppliermaster',suppliermasterSchema);

module.exports={
  diamaster,
  gaugemaster,
  fabricmaster,
  yarnmaster,
  colormaster,
  millmaster,
  machinemaster,
  taxmaster,
  companymaster,
  suppliermaster,
}
