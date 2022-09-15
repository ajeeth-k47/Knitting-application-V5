const {suppliermaster,yarnmaster,colormaster,millmaster,companymaster,diamaster,gaugemaster,taxmaster,fabricmaster} = require('../models/mastermodel');
const {orderlist,yarnlist,programlist,returnyarn,timeline,primarykeyLookup,rollDetails, deliveredProgramlist,billinglist} = require('../models/ordermodel');

exports.orderpage = async(req,res) => {
    try{
      
      const suppliers = await suppliermaster.find({});
      const orders = await orderlist.find({}).sort({orderDate:'desc'});
      let deletionDate = new Date();
      deletionDate.setDate(deletionDate.getDate()-100);
      await timeline.deleteMany({datetime:{$lte:deletionDate}});
      console.log("orderlists",req.cookies.name);
      res.render('orders/order',{suppliers,orders,user:req.cookies.name});
    }
    catch(error){
      res.send('error occured' ,error)
    }
  }

exports.deleteOrder = async(req,res) => {
  try{
    await billinglist.deleteMany({orderNo:req.body.orderNumber})
    await deliveredProgramlist.deleteMany({orderNo:req.body.orderNumber});
    await programlist.deleteMany({orderNo:req.body.orderNumber});
    await orderlist.deleteOne({orderNo:req.body.orderNumber});
    await timeline.deleteMany({orderNo:req.body.orderNumber});
    await rollDetails.deleteMany({orderNo:req.body.orderNumber}); 

    res.redirect('orderlist');
  }
  catch(error){
    res.send('error occured' ,error)
  }
}

exports.knittingProgramPage = async(req,res) => {
  try{
    const suppliers = await suppliermaster.find({});
    const fabrics = await fabricmaster.find({});
    const dias = await diamaster.find({});
    const programs = await programlist.find({}).sort({programDate:'desc'});
    res.render('orders/knittingprogram',{programs,suppliers,fabrics,dias});
  }
  catch(error){
    res.send('error occured' ,error)
  }
}

exports.searchBySupplier = async(req,res) => {
   try{

    
    const suppliers = await suppliermaster.find({})

    if(req.body.page=='orderlist'){
    const orders = await orderlist.find({supplier:{$regex:(req.body.orderlist).toUpperCase()}});
    res.render('orders/order',{suppliers,orders});
    }

    if(req.body.page=='programlist'){
      const fabrics = await fabricmaster.find({});
      const dias = await diamaster.find({});
      const programs = await programlist.find({supplier:{$regex:(req.body.programlist).toUpperCase()}});
      res.render('orders/knittingprogram',{programs,suppliers,fabrics,dias});
    }

    if(req.body.page=='billinglist'){
      const billings = await billinglist.find({supplier:{$regex:(req.body.billinglist).toUpperCase()}});
      res.render('orders/billlist',{billings})
    }


    if(req.body.page=='deliverylist'){
      const deliveries = await deliveredProgramlist.find({supplier:{$regex:(req.body.deliverylist).toUpperCase()}});
      res.render('orders/deliverylist',{deliveries,searchVisibility:1});
    }

   }
   catch(error){
    res.send('error occured' ,error)
  }
}

exports.searchByDate = async(req,res) => {
  try{
    if(req.body.page=='orderlist'){ 
    const suppliers = await suppliermaster.find({})
    const orders = await orderlist.find({
      supplier:{$regex:(req.body.suplier).toUpperCase()}, 
      orderDate: {
          $gte:req.body.fromdate,
          $lte:req.body.todate
      }
      
  });
    res.render('orders/order',{suppliers,orders});}


    if(req.body.page=='deliverylist'){
      const deliveries = await deliveredProgramlist.find({
        deliveryDate:{
          $gte:req.body.fromdate,
          $lte:req.body.todate
        }
      });

      res.render('orders/deliverylist',{deliveries,searchVisibility:1});
    }

    if(req.body.page=='billinglist'){
      const billings = await billinglist.find({
        billDate:{
          $gte:req.body.fromdate,
          $lte:req.body.todate
        }
      });

      res.render('orders/billlist',{billings})
    }

    if(req.body.page=='paymentlist'){
      const billings = await billinglist.find({
        billDate:{
          $gte:req.body.fromdate,
          $lte:req.body.todate
        }
      });
      res.render('orders/paystatuslist',{billings});
    }

  }

  catch(error){
    res.send('error occured' ,error);
  }
}


exports.searchByKnittingfeatures = async(req,res) => {
  try{
    const  searchfield={
      supplier:req.body.supplier,
      dia:req.body.dia,
      fabricType:req.body.fabric,
      programDate:{
        $gte:req.body.fromdate,
        $lte:req.body.todate
      }
    }

    const searchArray = Object.entries(searchfield);
    const filtered = searchArray.filter(([key, value]) => value!='');
    const filteredArray = Object.fromEntries(filtered);
    console.log(filteredArray);
    const suppliers = await suppliermaster.find({});
    const fabrics = await fabricmaster.find({});
    const dias = await diamaster.find({});
    const programs = await programlist.find(filteredArray);
    res.render('orders/knittingprogram',{programs,suppliers,fabrics,dias});

  }
  catch(error){
    res.send('error occured', error);
  }
}


exports.createorderpage = async(req,res) => {
  try{
    const orderslist = await primarykeyLookup.find({modelName:'orderlist'});
    const length = orderslist.length;
    var today = new Date();
    let orderno = "VF/"+today.getFullYear()+"-"+(today.getFullYear()+1);
    if(length==0)
    {
     orderno = orderno+"/1";
    }
    if(length!=0){
      var lastno = Number((orderslist[0].lastPrimaryKey).slice(13))+1;
      orderno = orderno+"/"+lastno;
    }


    

    const supplierslist = await suppliermaster.find({});
    const yarncounts = await yarnmaster.find({});
    const mills = await millmaster.find({});
    const colors = await colormaster.find({});
    const companies = await companymaster.find({});
    res.render('orders/createorder',{orderno,supplierslist,yarncounts,mills,colors,companies});
    

  }
  catch(error){
    res.send('error occured' ,error)
  }
}


exports.addorder = async(req,res) => {
  try{

  //const formatDate = new Date(req.body.orderDate);
   const newyarn = await yarnlist({
    yarn:req.body.yarncount,
    mill:req.body.mill,
    color:req.body.colour,
    weight:req.body.weight
   });
   
   const neworder = await orderlist({
    orderNo:req.body.orderNumber,
    company:req.body.company,
    orderDate: req.body.orderDate,
    supplier:req.body.supplier,
    yarnCount:[
        newyarn
    ],
    yarnWeight:req.body.weight,
    balanceWeight:req.body.weight,
    status:'Order Created'
   });
   await neworder.save();


   //-----------Logic to add primarykey to the lookup table--------------------------------

   const orderskeyLookup = await primarykeyLookup.find({modelName:'orderlist'});

    if(orderskeyLookup.length==0){
      console.log("No Lookup found for order list model");

      const newLookup = await primarykeyLookup({
        modelName:'orderlist',
        lastPrimaryKey:req.body.orderNumber,
        generatedDate:req.body.orderDate
      });

      await newLookup.save();
      
    }


    else{
      await primarykeyLookup.findOneAndUpdate({modelName:'orderlist'},{lastPrimaryKey:req.body.orderNumber,generatedDate:req.body.orderDate},{new:true});
    }

    //---------------------------------------------------------------------------------------

   const newActivity = await timeline({
     orderNo:req.body.orderNumber,
     reference:req.body.orderNumber,
     datetime:req.body.orderDate,
     action:'Order Created',
     description:'Yarn Wgt :'+req.body.weight+'Kgs'
   })
   await newActivity.save();

   res.redirect('orderlist');
  }
  catch(error){
    res.send('error occured' ,error);
  }
}

exports.addorderprogram = async(req,res) => {
  try{
    const fabrics = await fabricmaster.find({});
    const dias = await diamaster.find({});
    const gauges = await gaugemaster.find({});
    const taxs = await taxmaster.find({});
    const choosenOrders = await orderlist.find({orderNo:{$regex:(req.body.orderNumber)}});
    const choosenProgram = await programlist.find({orderNo:{$regex:(req.body.orderNumber)}});
    res.render('orders/addorderprogram',{choosenOrders,choosenProgram,fabrics,dias,gauges,taxs});
  // res.send('Program: ',choosenProgram);
  }
  catch(error){
    res.send('error occured' ,error);
  }
}

exports.addyarn = async(req,res) => {
  try{
    const yarncounts = await yarnmaster.find({});
    const mills = await millmaster.find({});
    const colors = await colormaster.find({});
    const orderno = req.body.orderNum;
    res.render('orders/addyarn',{orderno,yarncounts,mills,colors});

  }
  catch(error){
    res.send('error occured' ,error);
  }
}


exports.updateYarn = async(req,res) => {
  try{
    
    const newyarn = new yarnlist({
      yarn:req.body.yarncount,
      mill:req.body.mill,
      color:req.body.colour,
      weight:req.body.weight
    });
    var newWeight;
    var newBalance;
    orderlist.findOne({orderNo:req.body.orderNumber},function(err,foundOrder){
      foundOrder.yarnCount.push(newyarn);
      newWeight = Number(req.body.weight)+foundOrder.yarnWeight;
      newBalance = Number(req.body.weight)+foundOrder.balanceWeight;
      foundOrder.save();
    });
  
    const fabrics = await fabricmaster.find({});
    const dias = await diamaster.find({});
    const gauges = await gaugemaster.find({});
    const taxs = await taxmaster.find({});
    await orderlist.findOneAndUpdate({orderNo:req.body.orderNumber},{yarnWeight:newWeight,balanceWeight:newBalance},{new:true});
    let choosenOrders = await orderlist.find({orderNo:req.body.orderNumber});
    const choosenProgram = await programlist.find({orderNo:{$regex:(req.body.orderNumber)}});
    res.render('orders/addorderprogram',{choosenOrders,choosenProgram,fabrics,dias,gauges,taxs});
  }
  catch(error){
    res.send('error occured' ,error);
  }
}

exports.editdeleteYarn = async(req,res) =>{
  try{
    const order = await orderlist.find({orderNo:req.body.orderNum});
    res.render('orders/EditDeleteYarn',{order})
  }
  catch(error){
    res.send('error occured' ,error);
  }
}

exports.editYarn = async(req,res) =>{
  try{
    const order = await orderlist.find({orderNo:req.body.orderNumber});
    const index = Number(req.body.indexNumber);
    const selectedYarn = order[0].yarnCount[index]; 
    const yarncounts = await yarnmaster.find({});
    const mills = await millmaster.find({});
    const colors = await colormaster.find({});
    res.render('orders/editYarn',{orderno:req.body.orderNumber,index,selectedYarn,yarncounts,mills,colors});
  }
  catch(error){
    res.send('error occured' ,error);
  }
}

exports.editSelectedYarn = async(req,res) =>{
  try{
    const order = await orderlist.find({orderNo:req.body.orderNumber});
    const index = Number(req.body.indexNumber);
    const arry_id = order[0].yarnCount[index]._id;
    const newWeight = order[0].yarnWeight-Number(req.body.oldWeight)+Number(req.body.weight);
    const newBalance = order[0].balanceWeight-Number(req.body.oldWeight)+Number(req.body.weight);
    await orderlist.findOneAndUpdate({orderNo:req.body.orderNumber},{yarnWeight:newWeight,balanceWeight:newBalance},{new:true});
    orderlist.updateOne({orderNo:req.body.orderNumber,"yarnCount._id":arry_id},{'$set':{"yarnCount.$.yarn":req.body.yarn,"yarnCount.$.mill":req.body.mill,"yarnCount.$.color":req.body.color,"yarnCount.$.weight":req.body.weight}},function(err){
      if(err)
      {
          res.send(err);
      }
      
    });
    const fabrics = await fabricmaster.find({});
    const dias = await diamaster.find({});
    const gauges = await gaugemaster.find({});
    const taxs = await taxmaster.find({});
    const choosenOrders = await orderlist.find({orderNo:{$regex:(req.body.orderNumber)}});
    const choosenProgram = await programlist.find({orderNo:{$regex:(req.body.orderNumber)}});
    res.render('orders/addorderprogram',{choosenOrders,choosenProgram,fabrics,dias,gauges,taxs});
   // res.send(order[0].yarnCount[index]+" Id value: "+arry_id);
  }
  catch(error){
    res.send('error occured' ,error);
  }
}


exports.deleteYarn = async(req,res) =>{
  try{
    const order = await orderlist.find({orderNo:req.body.orderNumber});
    const index = Number(req.body.indexNumber);
    const arry_id = order[0].yarnCount[index]._id;
    var newWeight = order[0].yarnWeight-order[0].yarnCount[index].weight;
    var newBalance = order[0].balanceWeight-order[0].yarnCount[index].weight;
    await orderlist.findOneAndUpdate({orderNo:req.body.orderNumber},{yarnWeight:newWeight,balanceWeight:newBalance},{new:true});
   orderlist.updateOne({orderNo:req.body.orderNumber},{"$pull":{"yarnCount":{"_id":arry_id}}},{safe:true,multi:true},function(err){
      if(err)
      {
          res.send(err);
      }
      
    });
    const fabrics = await fabricmaster.find({});
    const dias = await diamaster.find({});
    const gauges = await gaugemaster.find({});
    const taxs = await taxmaster.find({});
    const choosenOrders = await orderlist.find({orderNo:{$regex:(req.body.orderNumber)}});
    const choosenProgram = await programlist.find({orderNo:{$regex:(req.body.orderNumber)}});
    res.render('orders/addorderprogram',{choosenOrders,choosenProgram,fabrics,dias,gauges,taxs});
   // res.send(order[0].yarnCount[index]+" Id value: "+arry_id);
  }
  catch(error){
    res.send('error occured' ,error);
  }
}

exports.addProgram = async(req,res) =>{
  try{
    const order = await orderlist.find({orderNo:req.body.programOrderNum});
    const programs = await primarykeyLookup.find({modelName:'programlist'});
    const length = programs.length;
    var today = new Date();
    //-------------------------------Generating ProgramNo-------------------------
    let programno = "KP/"+today.getFullYear()+"-"+(today.getFullYear()+1);
    if(length==0)
    {
     programno = programno+"/1";
    }
    if(length!=0){
      var lastno = Number((programs[0].lastPrimaryKey).slice(13))+1;
      programno = programno+"/"+lastno;
    }

    

   //----------------------------Checking the feasibility of order creation-----------
    if(req.body.weight<=order[0].balanceWeight)
    {
    
    var newWeight = order[0].balanceWeight-req.body.weight;
    await orderlist.findOneAndUpdate({orderNo:req.body.programOrderNum},{status:'Program Created',balanceWeight:newWeight},{new:true});
    const programDate = new Date();
    const targetDate = new Date(req.body.targetdate);
    const newtargetDate = targetDate.getDate()+"-"+(targetDate.getMonth()+1)+"-"+targetDate.getFullYear();
    const newProgram = new programlist({
      orderNo:req.body.programOrderNum,
      programNo:programno,
      programDate:programDate,
      supplier:req.body.supplier,
      fabricType:req.body.fabricType,
      dia:Number(req.body.dia),
      gauge:Number(req.body.gauge),
      loopLength:req.body.looplength,
      designNo:req.body.dc,
      gsm:req.body.gsm,
      Weight:req.body.weight,
      targetDate:newtargetDate,
      price:req.body.price,
      tax:req.body.tax,
      rolls:0,
      balance:req.body.weight,
      production:0,
      deliveredWgt:0,
      deliveredrolls:0,
      deliveryStatus:'N'
    });
    await newProgram.save();

    //-----------Logic to add primarykey to the lookup table--------------------------------

   const programskeyLookup = await primarykeyLookup.find({modelName:'programlist'});

   if(programskeyLookup.length==0){
     console.log("No Lookup found for program list model");

     const newLookup = await primarykeyLookup({
       modelName:'programlist',
       lastPrimaryKey:programno,
       generatedDate:programDate
     });

     await newLookup.save();
     }

  else{
     await primarykeyLookup.findOneAndUpdate({modelName:'programlist'},{lastPrimaryKey:programno,generatedDate:programDate},{new:true});
   }

   //----------------------------------------------------------------------------------------------------
   
   //const newprogramDate = today.getDate()+"-"+(today.getMonth()+1)+"-"+today.getFullYear();

   const newActivity = await timeline({
    orderNo:req.body.programOrderNum,
    reference:programno,
    datetime:today,
    action:'Program Created',
    description:'Yarn Wgt :'+req.body.weight+'Kgs'
   })
   await newActivity.save();

    }
    const fabrics = await fabricmaster.find({});
    const dias = await diamaster.find({});
    const gauges = await gaugemaster.find({});
    const taxs = await taxmaster.find({});
    const choosenOrders = await orderlist.find({orderNo:{$regex:(req.body.programOrderNum)}});
    const choosenProgram = await programlist.find({orderNo:{$regex:(req.body.programOrderNum)}});
    res.render('orders/addorderprogram',{choosenOrders,choosenProgram,fabrics,dias,gauges,taxs});
  }
  catch(error)
  {
    res.send('error occured' ,error);
  }
}


//------------------return yarn-----------------

exports.returnYarnPage = async(req,res) =>{
  try{
   const choosenOrders = await orderlist.find({orderNo:{$regex:(req.body.orderNumber)}});
   const returns = await returnyarn.find({orderNo:{$regex:(req.body.orderNumber)}});
    res.render('orders/returnYarn',{choosenOrders,returns});
  }
  catch(error)
  {
    res.send('error occured' ,error);
  }
}


exports.returnyarn = async(req,res) => {
  try{
    const order = await orderlist.find({orderNo:req.body.orderNum});

    if(req.body.weight<=order[0].balanceWeight){
      let today = new Date();
      today = today.getDate()+"-"+(today.getMonth()+1)+"-"+today.getFullYear();
      let newWeight = order[0].yarnWeight-req.body.weight;
      let newBalance = order[0].balanceWeight-req.body.weight;
      await orderlist.findOneAndUpdate({orderNo:req.body.orderNum},{yarnWeight:newWeight,balanceWeight:newBalance},{new:true});
      const newReturn = await returnyarn({
        orderNo:req.body.orderNum,
        returnWeight:req.body.weight,
        returnDate:today,
        reason:req.body.reason
      });
      await newReturn.save();
      const returns = await returnyarn.find({orderNo:{$regex:(req.body.orderNum)}});
      res.render('orders/returnYarn',{choosenOrders:order,returns});
    }

    else{
      res.redirect('orderlist');
    }
  }
  catch(error){
    res.send('error occured' ,error);
  }
}

exports.activitylog = async(req,res) => {
  try{
     const activities = await timeline.find({orderNo:{$regex:(req.body.orderNumber)}});
     const choosenOrders = await orderlist.find({orderNo:{$regex:(req.body.orderNumber)}});
     res.render('orders/timeline',{choosenOrders,activities});
  }
  catch(error){
    res.send('error occured' ,error);
  }
}



//---------------------------Program controllers ---------------------------------------//


exports.addRolls = async(req,res) =>{
  try{
     res.render('orders/addrolls',{Programno:req.body.programNumber,Designno:req.body.designNumber,Orderno:req.body.orderNumber,Balance:req.body.balanceWgt});
  }
  catch(error){
    res.send('error occured', error);
  }
}

exports.viewRolls = async(req,res) =>{
  try{
     const prdRolls = await rollDetails.find({programNo:req.body.programNumber});
     console.log("my rolls",prdRolls);
     res.render('orders/viewrolls',{currentPrgId:req.body.programNumber,rolls:prdRolls});
  }
  catch(error){
    res.send('error occured', error);
  }
}


exports.updateProgram = async(req,res) =>{
  try{
     const newRoll = await rollDetails({
      programNo:req.body.programid,
      orderNo:req.body.orderNumber,
      designNo:req.body.dcno,
      rollWeight:req.body.rollwgt,
      rollcount:req.body.totalRolls,
      rollDate:req.body.rolldate
     })

     newRoll.save();

     const program = await programlist.find({programNo:req.body.programid});
     const rollcount = (program[0].rolls!=null)?((program[0].rolls)+Number(req.body.totalRolls)):Number(req.body.totalRolls);
     const productionwgt = (program[0].production!=null)?(Number((program[0].production))+Number(req.body.rollwgt)):req.body.rollwgt;
     const balancewgt = (program[0].balance)-req.body.rollwgt;
     await programlist.findOneAndUpdate({programNo:req.body.programid},{rolls:rollcount,production:productionwgt,balance:balancewgt},{new:true});
  
  //---------------------------Save program completed status once the balance weight becomes 0---------------------------------------
     if(balancewgt==0){
      const today = new Date();
      //const completionDate = today.getDate()+"-"+(today.getMonth()+1)+"-"+today.getFullYear();
      const newActivity = await timeline({
        orderNo:req.body.orderNumber,
        reference:req.body.programid,
        datetime:today,
        action:'Program Completed',
        description:'Production Wgt :'+productionwgt+'Kgs'
       })
       await newActivity.save();

     }

     res.redirect('programlist');
  
    }
  catch(error){
    res.send('error occured', error);
  }
}

exports.deliverProgram = async(req,res) =>{
  try{

    const program = await programlist.find({programNo:req.body.programNumber});

    //---------------Check the delivery validation-----------------------------
    
      
      const deliveredWeight = program[0].production - program[0].deliveredWgt;
      const deliveredRolls = program[0].rolls - program[0].deliveredrolls;

      console.log("the delivered weight is ",deliveredWeight);

      if( deliveredWeight!=0){

      const today = new Date();
      //const deliveredDate = today.getDate()+"-"+(today.getMonth()+1)+"-"+today.getFullYear();
      const TotalPrice = (deliveredWeight) * program[0].price; 

      const deliveries = await primarykeyLookup.find({modelName:'deliverylist'});
      const length = deliveries.length;

      //-------------------------------Generating DeliveryNo-------------------------
      let deliveryno = "VF/OUT/"+today.getFullYear()+"-"+(today.getFullYear()+1);
      if(length==0)
      {
       deliveryno = deliveryno+"/1";
      }
      if(length!=0){
        var lastno = Number((deliveries[0].lastPrimaryKey).slice(17))+1;
        deliveryno = deliveryno+"/"+lastno;
      }
     
     console.log("The deliveryno is",deliveryno);

    //--------------Creation the record in deliverylist for this program
      const newDelivery = await deliveredProgramlist({
        orderNo:program[0].orderNo,
        programNo:program[0].programNo,
        deliveryNo:deliveryno,
        designNo:program[0].designNo,
        supplier:program[0].supplier,
        deliveryDate:today,
        weight:deliveredWeight,
        rollcount:deliveredRolls,
        totalPrice:TotalPrice
      });
       
      await newDelivery.save();

      //-----------Logic to add primarykey to the lookup table--------------------------------


   if(length==0){
     console.log("No Lookup found for program list model");

     const newLookup = await primarykeyLookup({
       modelName:'deliverylist',
       lastPrimaryKey:deliveryno,
       generatedDate:today
     });

     await newLookup.save();
     }

  else{
     await primarykeyLookup.findOneAndUpdate({modelName:'deliverylist'},{lastPrimaryKey:deliveryno,generatedDate:today},{new:true});
   }


   //-----------------------updating delivery weight in program----------------------------------------
     
   await programlist.findOneAndUpdate({programNo:req.body.programNumber},{deliveredWgt:(program[0].deliveredWgt+deliveredWeight),deliveredrolls:(program[0].deliveredrolls+deliveredRolls)},{new:true});

   //-----------------------updating order status -----------------------------------------------------
   
   await orderlist.findOneAndUpdate({orderNo:program[0].orderNo},{status:'Output Started'});

   //--------------------------------------------------------------------------------------------------
   
   if(program[0].balance==0){

      //------------Updating the delivery status for the same program
      await programlist.findOneAndUpdate({programNo:req.body.programNumber},{deliveryStatus:'Y'},{new:true});

      //-----------Creating timeline for delivering the program
  

      const newActivity = await timeline({
        orderNo:req.body.orderNumber,
        reference:req.body.programNumber,
        datetime:today,
        action:'Delivery Completed',
        description:'Delivered Wgt :'+program[0].production+'Kgs'
       })
       await newActivity.save();

    }
       const deliveredlist = await deliveredProgramlist.find({programNo:req.body.programNumber});

       res.render('orders/deliverylist',{deliveries:deliveredlist,searchVisibility:0});
    
  }


  //-----------------------if delivery is 0-----------------------
  else{
    res.render('orders/deliveryError');
  }


  }
  catch(error){
     res.send('error occured', error);
  }
}



exports.viewDeliveries = async(req,res) =>{
  try{
    const deliveredlist = await deliveredProgramlist.find({programNo:req.body.programId});
    res.render('orders/deliverylist',{deliveries:deliveredlist,searchVisibility:0});
  }
  catch(error){
    res.send('error occured', error);
  }
}

exports.addBilling = async(req,res) => {
  try{

    const firstBilling = await billinglist.find({programNo:req.body.programId});

    if(firstBilling==''){
    const bills = await primarykeyLookup.find({modelName:'billinglist'});
    const length = bills.length;
    const today = new Date();
    //-------------------------------Generating BillingNo-------------------------
    let billno = "VF/BN/"+today.getFullYear()+"-"+(today.getFullYear()+1);
    if(length==0)
    {
     billno = billno+"/1";
    }
    if(length!=0){
      var lastno = Number((bills[0].lastPrimaryKey).slice(16))+1;
      billno = billno+"/"+lastno;
    }

    const prgWeight= Number(req.body.prgWeight);
    const pricePerkg= Number(req.body.pricePerkg);
    let price = pricePerkg * prgWeight ;
    let ServiceTax = (price * Number((req.body.prgtax).split('%GST')[0])/100).toFixed(2);
    let TotalPrice = price + (ServiceTax*2);
    const newBill = await billinglist({
      
      billNo:billno,
      billDate:today,
      orderNo:req.body.ordernumber,
      programNo:req.body.programId,
      supplier:req.body.suppliername,
      weight:prgWeight,
      price:pricePerkg,
      tax:req.body.prgtax,
      totalPrice:TotalPrice,
      totalBalance:TotalPrice,
      paymentStatus:'N'

    });

    await newBill.save();

    if(length==0){
      console.log("No Lookup found for program list model");
 
      const newLookup = await primarykeyLookup({
        modelName:'billinglist',
        lastPrimaryKey:billno,
        generatedDate:today
      });
 
      await newLookup.save();
      }

      else{
        await primarykeyLookup.findOneAndUpdate({modelName:'billinglist'},{lastPrimaryKey:billno,generatedDate:today},{new:true});
      }

// --------------------------------timeline Entries for billing----------------------------------------//

//const formatedbilldate = today.getDate()+"-"+(today.getMonth()+1)+"-"+today.getFullYear();
     const newActivity = await timeline({
                  orderNo:req.body.ordernumber,
                  reference:req.body.programId,
                  datetime:today,
                  action:'Billing Completed',
                  description:'Billed Wgt :'+req.body.prgWeight+'Kgs'
         })
        
         await newActivity.save();


//---------------------------------Checking and updating order Status----------------------------------//

        let Totalorderweight=0;
        const billedPrograms = await billinglist.find({orderNo:req.body.ordernumber});


        for(let index=0;index<billedPrograms.length;index++){

             let prgWeight = await programlist.find({programNo:billedPrograms[index].programNo}); 

             console.log("prgWeight",prgWeight[0].Weight);
             Totalorderweight+=prgWeight[0].Weight;
      
          }

       const orderWeight = await orderlist.find({orderNo:req.body.ordernumber});

       console.log("TotalWeight",Totalorderweight);
       console.log("OrderWeight",orderWeight[0].yarnWeight);

      if(Totalorderweight == orderWeight[0].yarnWeight){

           await orderlist.findOneAndUpdate({orderNo:req.body.ordernumber},{status:'Output Completed'});

           //----------------------timeline entries for order completion----------------------
           const newTimeline = await timeline({
            orderNo:req.body.ordernumber,
            reference:req.body.programId,
            datetime:today,
            action:'Order Completed',
            description:'Completed Wgt :'+Totalorderweight+'Kgs'
           })
  
                await newTimeline.save();
          //-----------------------------------------------------------------------------------

           }


//-----------------------------------------------------------------------------------------------------//

    console.log("The billno is",billno);
    }

    const billings = await billinglist.find({programNo:req.body.programId});
    res.render('orders/billlist',{billings})
   

  }
  catch(error){
    res.send('error occured', error);
  } 
}


exports.viewBilling = async(req,res) =>{
  try{
    const deliveryFrom = await companymaster.find({Name:'VINAYAKA FABRICS'});
    const deliveryTo = await suppliermaster.find({Name:req.body.suppliername});
    const billings = await billinglist.find({programNo:req.body.programId});
    const program = await programlist.find({programNo:req.body.programId})
    const deliveredlist = await deliveredProgramlist.find({programNo:req.body.programId});
    let price = program[0].price * program[0].Weight ;
    let ServiceTax = (price * Number((program[0].tax).split('%GST')[0])/100).toFixed(2);
    let TotalPrice = price + (ServiceTax*2);

    //---------------------------Rupees in words implementation----------------------------------
    let num=TotalPrice.toFixed();
    let a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
    let b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];
    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
   //----------------------------------------------------------------------------------------------


    res.render('orders/viewbilling',{deliveryFrom,deliveryTo,program,price,ServiceTax,TotalPrice,str,deliveries:deliveredlist,billings});
  }
  catch(error){
    res.send('error occured', error);
  }
}


exports.viewDeliverylist = async(req,res) => {
  try{

    const deliveredlist = await deliveredProgramlist.find({});
    res.render('orders/deliverylist',{deliveries:deliveredlist,searchVisibility:1});
    
  }
  catch(error){
    res.send('error occured', error);
  }
}



exports.viewBilllist = async(req,res) => {
  try{

    const billings = await billinglist.find({});
    res.render('orders/billlist',{billings})
    
  }
  catch(error){
    res.send('error occured', error);
  }
}



exports.viewDeliveryChalan = async(req,res) => {
  try{

    const deliveries = await deliveredProgramlist.find({deliveryNo:req.body.deliveryNumber});
    const program = await programlist.find({programNo:req.body.programNumber});
    const From = await companymaster.find({Name:'VINAYAKA FABRICS'});
    const To = await suppliermaster.find({Name:program[0].supplier});

    res.render('orders/deliveryChalan',{deliveries,program,From,To});
    
  }
  catch(error){
    res.send('error occured', error);
  }
}



exports.paymentList = async(req,res) => {
  if(req.cookies.name==='Dinesh'){
  const billings = await billinglist.find({});
  //console.log(JSON.stringify(result[0].programData));
  res.render('orders/paystatuslist',{billings});
  }
  else{
    res.render('orders/payStatusPrivilegeError');
  }

}

exports.changePaymentStatus = async(req,res) => {

  if(req.body.billbalance==0){
  await billinglist.findOneAndUpdate({billNo:req.body.billnumber},{paymentStatus:'Y'},{new:true});
  }

  res.redirect('paystatuslist');
    
}

exports.addAmount = async(req,res) => {
  res.render('orders/addPaidAmount',{billNo:req.body.billnumber,maxamount:req.body.billbalance});
}


exports.updatePaidBalance = async(req,res) => {
  const bill = await billinglist.find({billNo:req.body.billnumber});
  const balance = bill[0].totalBalance-req.body.amountpaid;
  await billinglist.findOneAndUpdate({billNo:req.body.billnumber},{totalBalance:balance},{new:true});
  res.redirect('paystatuslist');

}

exports.reboot = async(req,res) => {
  res.render('orders/cleandata');
}

exports.cleandata = async(req,res) => {

  try{

    let deletionDate = new Date();
    deletionDate.setDate(deletionDate.getDate()-366);
    const orders = await orderlist.find({orderDate:{$lte:deletionDate}});
     orders.map(async(order)=>{
    await billinglist.deleteMany({orderNo:order.orderNo})
    await deliveredProgramlist.deleteMany({orderNo:order.orderNo});
    await programlist.deleteMany({orderNo:order.orderNo});
    await orderlist.deleteOne({orderNo:order.orderNo});
    await timeline.deleteMany({orderNo:order.orderNo});
    await rollDetails.deleteMany({orderNo:order.orderNo}); 
  })
    res.redirect('orderlist');
  }
  catch(error){
    res.send('error occured' ,error)
  }

}