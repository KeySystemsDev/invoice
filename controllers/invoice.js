'use strict'

const Invoice = require('../models/invoice');
const nodemailer = require('nodemailer');
const pdf = require('html-pdf');
const fs = require('fs')
const conversion = require("phantom-html-to-pdf")();

function saveInvoice(req,res){

	let invoice = new Invoice();
	invoice.logo = req.body.logo;
	invoice.from_client = req.body.from_client;
	invoice.to_client = req.body.to_client;
	invoice.date = Date.now();
	invoice.number_invoice = req.body.number_invoice;
	invoice.payment = req.body.payment;
	invoice.expiration = Date.now();
	invoice.items = req.body.items;
	invoice.subtotal = req.body.subtotal;
	invoice.discount = req.body.discount;
	invoice.shipping = req.body.shipping;
	invoice.tax = req.body.tax;
	invoice.total = req.body.total;
	invoice.note = req.body.note;
	invoice.terms = req.body.terms;

	invoice.save((err, invoiceStored)=>{
		if (err) res.status(500).send({Mensaje:`Error al salvar los datos: ${err} `})

		res.status(200).send({invoice: invoiceStored});
	});
}


function getInvoices(req,res) {

	Invoice.find({}, (err, invoices)=>{
		if(err) return res.status(500).send({mensaje: `Error al realizar la consulta: ${err}`});
		if(!invoices) return res.status(404).send({mensaje: "No Existen Facturas"});

		res.send(200,{invoices});
	})
}

function emailInvoicesSave(req,res) {

	let invoice = new Invoice();
	invoice.logo = req.body.logo;
	invoice.from_client = req.body.from_client;
	invoice.to_client = req.body.to_client;
	invoice.date = Date.now();
	invoice.number_invoice = req.body.number_invoice;
	invoice.payment = req.body.payment;
	invoice.expiration = Date.now();
	invoice.items = req.body.items;
	invoice.subtotal = req.body.subtotal;
	invoice.discount = req.body.discount;
	invoice.shipping = req.body.shipping;
	invoice.tax = req.body.tax;
	invoice.total = req.body.total;
	invoice.note = req.body.note;
	invoice.terms = req.body.terms;
	invoice.email = req.body.email;
	invoice.from = req.body.from;
	invoice.to =req.body.to;
	invoice.cc =req.body.cc;
	invoice.bcc = req.body.bcc;
	invoice.subject = req.body.subject;

	var transporter = nodemailer.createTransport({
	 service: 'gmail',
	 auth: {
	        user: 'propiaweb2667@gmail.com',
	        pass: 'sistema-18233584.$'
	    }
	});

		conversion({ html: `${invoice}` }, function(err, pdf) {
		  var output = fs.createWriteStream(`pdf/invoice_${invoice.number_invoice}.pdf`);
		  console.log(pdf.logs);
		  console.log(pdf.numberOfPages);
		    // since pdf.stream is a node.js stream you can use it
		    // to save the pdf to a file (like in this example) or to
		    // respond an http request.
		  pdf.stream.pipe(output);
		});

	const mailOptions = {
		from: req.body.from, // sender address
		to: req.body.to, // list of receivers
		cc: req.body.cc, // list of receivers
		bcc: req.body.bcc, // list of receivers
		subject: req.body.subject, // Subject line
		html: `${invoice}`,// plain text body
		attachments: {   // file on disk as an attachment
            filename: `invoice_${invoice.number_invoice}.pdf`,
            path: `pdf/invoice_${invoice.number_invoice}.pdf` // stream this file
        }
	};

	transporter.sendMail(mailOptions, function (err, info) {
	   if(err)
	     console.log(err)
	   else
	     console.log(info);
	});

	invoice.save((err, invoiceStored)=>{
		if (err) res.status(500).send({Mensaje:`Error al salvar los datos: ${err} `})

		res.status(200).send({invoice: invoiceStored});
	});

}

module.exports = {
	saveInvoice,
	getInvoices,
	emailInvoicesSave
}