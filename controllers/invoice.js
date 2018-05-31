'use strict'

const Invoice = require('../models/invoice');
const nodemailer = require('nodemailer');
const pdfcrowd = require("pdfcrowd");

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
	        pass: 'sistema-18233584'
	    }
	});

		// create the API client instance
	var client = new pdfcrowd.HtmlToPdfClient("mlopez2667", "189ffe3b3b5eecb93c039352203b9404");

	// run the conversion and write the result to a file
	var pdfinvoice = client.convertStringToFile(
	    `${invoice}`, //Aqui va el codigo HTML com
	    `invoice_${String(invoice.number_invoice)}.pdf`,
	    function(err, fileName) {
	        if (err) return console.error("Pdfcrowd Error: " + err);
	        console.log("Creado Satisfactoriamente " + fileName);
	        console.log(invoice.number_invoice);
    });

	const mailOptions = {
		from: req.body.from, // sender address
		to: req.body.to, // list of receivers
		cc: req.body.cc, // list of receivers
		bcc: req.body.bcc, // list of receivers
		subject: 'Envio de Factura Node JS en Json', // Subject line
		html: `${invoice}`,// plain text body
		attachments: {   // file on disk as an attachment
            filename: `invoice_${invoice.number_invoice}.pdf`,
            path: `C:/proyectos/invoice_key/invoice_${invoice.number_invoice}.pdf` // stream this file
        }
	};

	transporter.sendMail(mailOptions, function (err, info) {
	   if(err)
	     console.log(err)
	   else
	     console.log(info);
	});


	/*invoice.save((err, invoiceStored)=>{
		if (err) res.status(500).send({Mensaje:`Error al salvar los datos: ${err} `})

		res.status(200).send({invoice: invoiceStored});
	});*/
}

module.exports = {
	saveInvoice,
	getInvoices,
	emailInvoicesSave
}