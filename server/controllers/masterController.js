
const {diamaster,gaugemaster,fabricmaster,yarnmaster,colormaster,millmaster,machinemaster,taxmaster,companymaster,suppliermaster} = require('../models/mastermodel');



//--------------GET MASTER---------------------------

exports.diapage = async(req,res) => {
  try{
    const dias = await diamaster.find({});
    res.render('masters/diamaster',{dias});
  }
  catch(error){
    res.send('error occured');
  }
}

exports.gaugepage = async(req,res) => {
  try{
    const gauges = await gaugemaster.find({});
    res.render('masters/gaugemaster',{gauges});
  }
  catch(error){
    res.send('error occured ',error);
  }
}

exports.fabricpage = async(req,res) => {
  try{
    const fabrics = await fabricmaster.find({});
    res.render('masters/fabricmaster',{fabrics});
  }
  catch(error){
    res.send('error occured ',error);
  }
}

exports.yarnpage = async(req,res) => {
  try{
    const yarns = await yarnmaster.find({});
    res.render('masters/yarnmaster',{yarns});
  }
  catch(error){
    res.send('error occured ',error);
  }
}

exports.colorpage = async(req,res) => {
  try{
    const colors = await colormaster.find({});
    const visibility = 1;
    res.render('masters/colormaster',{colors,visibility});
  }
  catch(error){
    res.send('error occured ',error);
  }
}

exports.millpage = async(req,res) => {
  try{
    const mills = await millmaster.find({});
    res.render('masters/millmaster',{mills});
  }
  catch(error){
    res.send('error occured ',error);
  }
}

exports.machinepage = async(req,res) => {
  try{
    const dias = await diamaster.find({});
    const gauges = await gaugemaster.find({});
    const machines = await machinemaster.find({});
    res.render('masters/machinemaster' ,{dias,gauges,machines});
  }
  catch(error){
    res.send('error occured ' ,error);
  }
}

exports.taxpage = async(req,res) => {
  try{
    const taxs = await taxmaster.find({});
    res.render('masters/taxmaster' ,{taxs});

  }
  catch(error){
    res.send('error occured ' ,error);
  }
}

exports.createpage = async(req,res) => {
  try{
      res.render('masters/create',{name:req.body.mastername});
  }
  catch(error){
    res.send('error occured' ,error);
  }
}

exports.updatepage = async(req,res) => {
  try{
    if(req.body.mastername == "Company"){
      const company = await companymaster.findOne({id:req.body.id, Name:req.body.name});
      res.render('masters/update',{name:req.body.mastername , detail:company});
    }
    else if(req.body.mastername == "Color")
    {
      const colors = await colormaster.findOne({Color:req.body.name});
      const visibility = 0;
      res.render('masters/colormaster',{colors,visibility});
    }
    else{
      const supplier = await suppliermaster.findOne({id:req.body.id, Name:req.body.name});
      res.render('masters/update',{name:req.body.mastername , detail:supplier});
    }
  }
  catch(error){
    res.send('error occured' ,error);
  }
}

exports.companypage = async(req,res) => {
  try{
    const companies = await companymaster.find({})
    res.render('masters/companymaster',{companies});
  }
  catch(error){
    res.send('error occured' ,error)
  }
}

exports.supplierpage = async(req,res) => {
  try{
    const suppliers = await suppliermaster.find({})
    res.render('masters/suppliermaster',{suppliers});
  }
  catch(error){
    res.send('error occured' ,error)
  }
}
//---------------------POST MASTERS-----------------------------------

exports.searchMaster = async(req,res) => {
  try{

    if(req.body.page=='diamaster')
    {
      const dias = await diamaster.find({Dia:req.body.name});
      res.render('masters/diamaster',{dias});
    }
    else if(req.body.page=='gaugemaster')
    {
      const gauges = await gaugemaster.find({Gauge:req.body.name});
      res.render('masters/gaugemaster',{gauges});
    }
    else if(req.body.page=='fabricmaster')
    {
      const fabrics = await fabricmaster.find({FabricType:{$regex:(req.body.name).toUpperCase()}});
      res.render('masters/fabricmaster',{fabrics});
   }
   else if(req.body.page=='yarnmaster')
   {
     const yarns = await yarnmaster.find({YarnCount:req.body.name});
     res.render('masters/yarnmaster',{yarns});
   }
   else if(req.body.page=='millmaster')
   {
     const mills = await millmaster.find({Mill:{$regex:(req.body.name).toUpperCase()}});
     res.render('masters/millmaster',{mills});
   }
   else if(req.body.page=='colormaster')
   {
     const colors = await colormaster.find({Color:{$regex:(req.body.name).toLowerCase()}});
     const visibility = 1;
     res.render('masters/colormaster',{colors,visibility});
   }
   else if(req.body.page=='machinemaster'){
     const dias = await diamaster.find({});
     const gauges = await gaugemaster.find({});
     const machines = await machinemaster.find({MachineName:{$regex:(req.body.name).toUpperCase()}});
     res.render('masters/machinemaster' ,{dias,gauges,machines});
   }
   else if(req.body.page=='taxmaster'){
     const taxs = await taxmaster.find({TaxName:{$regex:(req.body.name).toUpperCase()}})
     res.render('masters/taxmaster',{taxs});
   }
   else if(req.body.page=='companymaster'){
     const companies = await companymaster.find({Name:{$regex:(req.body.name).toUpperCase()}})
     res.render('masters/companymaster',{companies});
   }
   else if(req.body.page=='suppliermaster'){
     const suppliers = await suppliermaster.find({Name:{$regex:(req.body.name).toUpperCase()}})
     res.render('masters/suppliermaster',{suppliers});
   }
  }
  catch(error){
    res.send('No records found')
  }
}

exports.addDia = async(req,res) => {
  try{
    const newDia = new diamaster({
      Dia:req.body.dia,
      Status:'Active'
    });

    await newDia.save();

    res.redirect('dia');
  }
  catch(error){
    res.send('error occured');
  }
}

exports.addGauge = async(req,res) => {
  try{
    const newGauge = new gaugemaster({
      Gauge:req.body.gauge,
      Status:'Active'
    });

    await newGauge.save();

    res.redirect('gauge');
  }
  catch(error){
    res.send('error occured');
  }
}

exports.addFabric = async(req,res) => {
  try{
    const newFabric = new fabricmaster({
      FabricType:(req.body.fabric).toUpperCase(),
      Status:'Active'
    });

    await newFabric.save();

    res.redirect('fabric');
  }
  catch(error){
    res.send('error occured');
  }
}

exports.addYarn = async(req,res) => {
  try{
    const newYarn = new yarnmaster({
      YarnCount:req.body.yarn,
      Status:'Active'
    });

    await newYarn.save();

    res.redirect('yarn');
  }
  catch(error){
    res.send('error occured');
  }
}

exports.addColor = async(req,res) => {
  try{
    const newColor = new colormaster({
      Color:(req.body.color).toLowerCase(),
      Alternate:(req.body.alternate).toLowerCase(),
      Status:'Active'
    });

    await newColor.save();

    res.redirect('color');
  }
  catch(error){
    res.send('error occured');
  }
}

exports.addMill = async(req,res) => {
  try{
    const newMill = new millmaster({
      Mill:(req.body.mill).toUpperCase(),
      Status:'Active'
    });

    await newMill.save();

    res.redirect('mill');
  }
  catch(error){
    res.send('error occured');
  }
}

exports.addMachine = async(req,res) => {
  try{
    const newMachine = new machinemaster({
      MachineName:(req.body.name).toUpperCase()+"-"+req.body.dia+"Ø-"+req.body.gauge+"G.G",
      Name:(req.body.name).toUpperCase(),
      Dia:req.body.dia,
      Gauge:req.body.gauge,
      Status:'Active'
    })

    await newMachine.save();
    res.redirect('machine');
  }
  catch(error){
    res.send('error occured');
  }
}

exports.addTax = async(req,res) => {
  try{
    const total = Number(req.body.cgst)+Number(req.body.sgst)+Number(req.body.igst);
    const newTax = new taxmaster({
      TaxName:(req.body.tax).toUpperCase(),
      CGST:req.body.cgst,
      SGST:req.body.sgst,
      IGST:req.body.igst,
      Total:total,
      Status:'Active'
    })
    await newTax.save();
    res.redirect('tax');
  }
  catch(error){
    res.send('error occured');
  }
}

exports.addCompany = async(req,res) => {
  try{
    const newCompany = new companymaster({
      Name:(req.body.name).toUpperCase(),
      Address1:(req.body.address1).toUpperCase(),
      Address2:(req.body.address2).toUpperCase(),
      Country:req.body.country,
      State:req.body.state,
      City:req.body.city,
      Pincode:Number(req.body.pin),
      PhoneNo:req.body.phone,
      MobileNo:Number(req.body.mobile),
      Email:req.body.email,
      Website:req.body.website,
      GSTNo:req.body.gst,
      PANNo:req.body.pan
    })
    await newCompany.save();
    res.redirect('company');
  }
  catch(error){
    res.send(error);
  }
}

exports.addSupplier = async(req,res) => {
  try{
    const newSupplier = new suppliermaster({
      Name:(req.body.name).toUpperCase(),
      Address1:(req.body.address1).toUpperCase(),
      Address2:(req.body.address2).toUpperCase(),
      Country:req.body.country,
      State:req.body.state,
      City:req.body.city,
      Pincode:Number(req.body.pin),
      PhoneNo:req.body.phone,
      MobileNo:Number(req.body.mobile),
      Email:req.body.email,
      Website:req.body.website,
      GSTNo:req.body.gst,
      PANNo:req.body.pan
    })
    await newSupplier.save();
    res.redirect('supplier');
  }
  catch(error){
    res.send('error occured');
  }
}

exports.updateCompany = async(req,res) => {
  try{
    const filter = {id:req.body.updatedforid,Name:req.body.updatedforname};
    const update = {
      Name:(req.body.name).toUpperCase(),
      Address1:(req.body.address1).toUpperCase(),
      Address2:(req.body.address2).toUpperCase(),
      Country:req.body.country,
      State:req.body.state,
      City:req.body.city,
      Pincode:Number(req.body.pin),
      PhoneNo:req.body.phone,
      MobileNo:Number(req.body.mobile),
      Email:req.body.email,
      Website:req.body.website,
      GSTNo:req.body.gst,
      PANNo:req.body.pan
    }
    await companymaster.findOneAndUpdate(filter,update,{new:true});
    res.redirect('company');
  }
  catch(error){
    res.send('error occured');
  }
}


exports.updateSupplier = async(req,res) => {
  try{
    const filter = {id:req.body.updatedforid,Name:req.body.updatedforname};
    const update = {
      Name:(req.body.name).toUpperCase(),
      Address1:(req.body.address1).toUpperCase(),
      Address2:(req.body.address2).toUpperCase(),
      Country:req.body.country,
      State:req.body.state,
      City:req.body.city,
      Pincode:Number(req.body.pin),
      PhoneNo:req.body.phone,
      MobileNo:Number(req.body.mobile),
      Email:req.body.email,
      Website:req.body.website,
      GSTNo:req.body.gst,
      PANNo:req.body.pan
    }
    await suppliermaster.findOneAndUpdate(filter,update,{new:true});
    res.redirect('supplier');
  }
  catch(error){
    res.send('error occured');
  }
}


exports.updateColor = async(req,res) => {
  try{
    const filter = {Color:req.body.updatedforcolor};
    const update = {
      Color:(req.body.color).toLowerCase(),
      Alternate:(req.body.alternate).toLowerCase(),
      Status:'Active'
    }
    await colormaster.findOneAndUpdate(filter,update,{new:true});
    res.redirect('color');
  }
  catch(error){
    res.send('error occured');
  }
}
/*async function insertDummy(){
  try{
    await fabricmaster.insertMany([{"FabricType":24,"Status":"Active"}]);
  }
  catch(error){
    console.log(error);
  }
}

insertDummy();*/
