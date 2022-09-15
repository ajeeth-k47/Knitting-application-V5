const express = require('express');
const operator = express.Router();
const operatorController = require('../controllers/operatorController');


operator.get('/operatorlist', operatorController.operatorlistpage);
operator.get('/operatormapping', operatorController.operatormappingpage);
operator.post('/operatorlist', operatorController.addOperator);
operator.post('/operatormapping', operatorController.addMapping);

operator.post('/search',operatorController.search);
operator.post('/searchbydate',operatorController.searchbydate);
operator.post('/create',operatorController.createpage);
operator.post('/createmapping',operatorController.createmapping);
operator.post('/update',operatorController.updatepage);
operator.post('/updateOperator',operatorController.updateOperator);



module.exports=operator;
