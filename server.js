const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/Sapphire', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Create a schema
const orderSchema = new mongoose.Schema({
    orderId: String,
    producttype: String,
    productId: String,
    quantity: Number
}, { collection: 'accessories' });  // Specify the collection name here

// Create a model
const Accessory = mongoose.model('Accessory', orderSchema);

// Handle form submission
app.post('/api/orders', async (req, res) => {
    const { orderId, producttype, productId, quantity } = req.body;

    const newAccessory = new Accessory({
        orderId,
        producttype,
        productId,
        quantity
    });

    try {
        await newAccessory.save();
        res.status(201).send('Order saved to database');
    } catch (error) {
        res.status(500).send('Error saving order to database');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
