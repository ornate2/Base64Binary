const cds = require('@sap/cds');
const fs = require('fs');
const path = require('path');
const express = require("express");
const multer = require("multer");

module.exports = cds.service.impl(async function() {
    const { Images } = this.entities;

    this.on('READ', Images, onReadImages);
    this.on('UPLOAD', 'Images', onUploadImages);
    cds.on('bootstrap', app => {
        app.use(express.json());

        app.post('/upload', upload.single('uploadFile'), (req, res) => {
            const file = req.file;
            const imagePath = path.join(__dirname, '..', 'images', file.originalname);
            fs.renameSync(file.path, imagePath);

            res.send({ message: 'Upload successful' });
        });
    });

});

async function onReadImages(req) {
    const imageDir = path.join(__dirname, '..', 'images');
    const files = fs.readdirSync(imageDir);

    const images = files.map(file => {
        const filePath = path.join(imageDir, file);
        const binaryData = fs.readFileSync(filePath);
        return {
            ID: cds.utils.uuid(),
            name: file,
            imageUrl: `data:image/jpeg;base64,${binaryData.toString('base64')}`
        };
    });

    return images;
}


async function onUploadImages(req) {
    const { file } = req.data;

    const uploadDir = path.join(__dirname, '..', 'images');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }

    const filePath = path.join(uploadDir, file.name);
    fs.writeFileSync(filePath, file.content, 'binary');

    return { message: 'Upload successful' };
}