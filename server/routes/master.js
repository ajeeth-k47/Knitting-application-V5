const express = require('express');
const master = express.Router();
const masterController = require('../controllers/masterController');


master.get('/dia', masterController.diapage);
master.get('/gauge', masterController.gaugepage);
master.get('/fabric', masterController.fabricpage);
master.get('/yarn', masterController.yarnpage);
master.get('/color', masterController.colorpage);
master.get('/mill', masterController.millpage);
master.get('/machine', masterController.machinepage);
master.get('/tax', masterController.taxpage);
master.get('/company', masterController.companypage);
master.get('/supplier', masterController.supplierpage);

//master.get('/tax', masterController.taxpage);
//master.get('/user', masterController.userpage);
//master.get('/machine', masterController.machinepage);

master.post('/dia', masterController.addDia);
master.post('/gauge', masterController.addGauge);
master.post('/fabric', masterController.addFabric);
master.post('/yarn', masterController.addYarn);
master.post('/color', masterController.addColor);
master.post('/mill', masterController.addMill);
master.post('/machine', masterController.addMachine);
master.post('/tax', masterController.addTax);
master.post('/company', masterController.addCompany);
master.post('/supplier', masterController.addSupplier);
master.post('/updateCompany', masterController.updateCompany);
master.post('/updateSupplier', masterController.updateSupplier);
master.post('/updateColor', masterController.updateColor);


master.post('/search',masterController.searchMaster);
master.post('/create', masterController.createpage);
master.post('/update',masterController.updatepage);
//master.post('/tax', masterController.addTax);
//master.post('/user', masterController.addUser);
//master.post('/machine', masterController.addMachine);

module.exports = master;
