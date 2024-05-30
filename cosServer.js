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
    orderId: { type: String, required: true },
    producttype: { type: String, required: true },
    productId: { type: String, required: true },
    quantity: { type: Number, required: true }
}, { collection: 'cosmetics' });

// Create a model
const Cosmetic = mongoose.model('cosmetics', orderSchema);

// Handle form submission
app.post('/api/orders', async (req, res) => {
    const { orderId, producttype, productId, quantity } = req.body;

    const newCosmetic = new Cosmetic({
        orderId,
        producttype,
        productId,
        quantity
    });

    try {
        await newCosmetic.save();
        res.status(201).send('Order saved successfully');
    } catch (error) {
        console.error('Error saving order to database:', error);
        res.status(500).send('Error saving order to database');
    }
});

// Fetch all orders
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Cosmetic.find();
        res.json(orders);
    } catch (error) {
        res.status(500).send('Error fetching orders from database');
    }
});

// Update an order
app.put('/api/orders/:id', async (req, res) => {
    const { id } = req.params; // Use 'id' here
    const { producttype, productId, quantity } = req.body;

    try {
        const order = await Cosmetic.findOne({ orderId: id });

        if (!order) {
            return res.status(404).send('Order not found');
        }

        order.producttype = producttype;
        order.productId = productId;
        order.quantity = quantity;

        await order.save();
        res.status(200).send('Order updated');
    } catch (error) {
        res.status(500).send('Error updating order');
    }
});

// Delete an order
app.delete('/api/orders/:id', async (req, res) => {
    const { id } = req.params; // Use 'id' here

    try {
        const result = await Cosmetic.deleteOne({ orderId: id });

        if (result.deletedCount === 0) {
            return res.status(404).send('Order not found');
        }

        res.status(200).send('Order deleted');
    } catch (error) {
        res.status(500).send('Error deleting order');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
