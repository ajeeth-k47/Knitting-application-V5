
const {operatorslist,operatormapping} = require('../models/operatormodel');
const {machinemaster} = require('../models/mastermodel');


exports.operatorlistpage = async(req,res) => {
  try{
      const operators=await operatorslist.find({});
      res.render('operators/operatorlist',{operators});
  }
  catch(error){
    res.send('error occured ',error);
  }
}

exports.operatormappingpage = async(req,res) => {
  try{
      const values=await operatormapping.find({});
      res.render('operators/operatormapping',{values});
  }
  catch(error){
    res.send('error occured ',error);
  }
}


exports.createpage = async(req,res) => {
  try{
      res.render('operators/createoperator');
  }
  catch(error){
    res.send('error occured' ,error);
  }
}

exports.createmapping = async(req,res) => {
  try{
      const operators=await operatorslist.find({});
      const machines = await machinemaster.find({});
      res.render('operators/createmapping',{operators,machines});
  }
  catch(error){
    res.send('error occured' ,error);
  }
}

exports.updatepage = async(req,res) => {
  try{

      const operator= await operatorslist.findOne({Code:req.body.code, Name:req.body.name});
      res.render('operators/updateoperator',{detail:operator});

  }
  catch(error){
    res.send('error occured' ,error);
  }
}

exports.search = async(req,res) => {
  try{

    if(req.body.page=='operatorlist')
    {
      const operators=await operatorslist.find({Name:{$regex:(req.body.name).toUpperCase()}});
      res.render('operators/operatorlist',{operators});
    }
    else if(req.body.page=='operatormapping')
    {
      const values=await operatormapping.find({Name:{$regex:(req.body.name).toUpperCase()}});
      res.render('operators/operatormapping',{values});
    }

  }
  catch(error){
    res.send('No records found')
  }
}


exports.searchbydate = async(req,res) => {
  try{

      var workdate =new Date(req.body.workdate);
      var datevalue = workdate.getDate()+"-"+(workdate.getMonth()+1)+"-"+workdate.getFullYear();
      const values=await operatormapping.find({Date:datevalue,Shift:req.body.shift});
      res.render('operators/operatormapping',{values});

  }
  catch(error){
    res.send('No records found')
  }
}
/*exports.updatepage = async(req,res) => {
  try{
      res.render('operators/update',{name:req.body.mastername});
  }
  catch(error){
    res.send('error occured' ,error);
  }
}*/


exports.addOperator = async(req,res) => {
  try{
   var today = new Date();
   var birthDate = new Date(req.body.DOB);
   var age = today.getFullYear() - birthDate.getFullYear();
   var m = today.getMonth() - birthDate.getMonth();
   if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
   {
       age--;
   }
  var joiningDate= new Date(req.body.DOJ);
    const newOperator = new operatorslist({
      Code:req.body.id,
      Name:(req.body.name).toUpperCase(),
      Gender:req.body.gender,
      DOB:birthDate.getDate()+"-"+(birthDate.getMonth()+1)+"-"+birthDate.getFullYear(),
      Age:age,
      DOJ:joiningDate.getDate()+"-"+(joiningDate.getMonth()+1)+"-"+joiningDate.getFullYear(),
      AadhaarNo:req.body.Aadhaar,
      MobileNo:Number(req.body.mobile),
      Status:req.body.status
    })
    await newOperator.save();
    res.redirect('operatorlist');
  }
  catch(error){
    res.send('error occured');
  }
}


exports.addMapping = async(req,res) => {
  try{
    var workdate =new Date(req.body.workdate);
    const newMapping = new operatormapping({
      Name:req.body.operator,
      Machine:req.body.machine,
      Date:workdate.getDate()+"-"+(workdate.getMonth()+1)+"-"+workdate.getFullYear(),
      Shift:req.body.shift
    })
    await newMapping.save();
    res.redirect('operatormapping');
  }
  catch(error){
    res.send('error occured');
  }
}


exports.updateOperator =  async(req,res) => {
  try{

    var today = new Date();
    var birthDate = (req.body.DOB).split("-");
    var age = today.getFullYear() - Number(birthDate[2]);
    var m = today.getMonth() - Number(birthDate[1]);
    if (m < 0 || (m === 0 && today.getDate() < Number(birthDate[0])))
    {
        age--;
    }
    const filter = {Code:req.body.updatedforid , Name:req.body.updatedforname};
    const update = {
      Code:req.body.id,
      Name:(req.body.name).toUpperCase(),
      Gender:req.body.gender,
      DOB:req.body.DOB,
      Age:age,
      DOJ:req.body.DOJ,
      AadhaarNo:req.body.Aadhaar,
      MobileNo:Number(req.body.mobile),
      Status:(req.body.status).charAt(0).toUpperCase() + (req.body.status).substr(1).toLowerCase()
    }
    await operatorslist.findOneAndUpdate(filter,update,{new:true});
    res.redirect('operatorlist');
  }
  catch(error){
    res.send('error occured');
  }
}
