const express = require('express');
const order = express.Router();
const orderController = require('../controllers/orderController');


order.get('/orderlist',orderController.orderpage);
order.get('/programlist',orderController.knittingProgramPage);
order.get('/deliverylist',orderController.viewDeliverylist);
order.get('/billinglist',orderController.viewBilllist);
order.get('/paystatuslist',orderController.paymentList);
order.get('/reboot',orderController.reboot);

order.post('/createorder',orderController.createorderpage);
order.post('/neworder',orderController.addorder);
order.post('/addorderprogram',orderController.addorderprogram);
order.post('/addyarn',orderController.addyarn);
order.post('/updateYarn',orderController.updateYarn);
order.post('/editdeleteYarn',orderController.editdeleteYarn);
order.post('/editYarn',orderController.editYarn);
order.post('/deleteYarn',orderController.deleteYarn);
order.post('/addProgram',orderController.addProgram);
order.post('/returnYarnPage',orderController.returnYarnPage);
order.post('/returnYarn',orderController.returnyarn);
order.post('/activity',orderController.activitylog);
order.post('/editSelectedYarn',orderController.editSelectedYarn);
order.post('/searchbysupplier',orderController.searchBySupplier);
order.post('/searchbydate',orderController.searchByDate);
order.post('/searchByKnittingfeatures',orderController.searchByKnittingfeatures);
order.post('/add_rolls',orderController.addRolls);
order.post('/updateProgram',orderController.updateProgram);
order.post('/view_rolls',orderController.viewRolls);
order.post('/deliverProgram',orderController.deliverProgram);
order.post('/view_deliveries',orderController.viewDeliveries);
order.post('/billing',orderController.addBilling);
order.post('/viewbilling',orderController.viewBilling);
order.post('/viewDeliveryChalan',orderController.viewDeliveryChalan);
order.post('/deleteOrder',orderController.deleteOrder);
order.post('/editPayStatus',orderController.changePaymentStatus);
order.post('/addAmount',orderController.addAmount);
order.post('/updatePaidBalance',orderController.updatePaidBalance);
order.post('/cleandata',orderController.cleandata);

module.exports = order;