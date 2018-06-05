'use strict'

/*DEPENDENCIAS*/
const invoiceController = require('../controllers/invoice');
const express = require('express');
const api = express.Router();
const nodemailer = require('nodemailer');

api.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

api.post('/invoice', invoiceController.saveInvoice);
api.get('/invoice', invoiceController.getInvoices);
api.post('/invoiceEmail', invoiceController.emailInvoicesSave);

module.exports = api
