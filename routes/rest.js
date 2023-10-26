const express = require('express');
const mongoose = require('mongoose');
const CosmosClient = require('@azure/cosmos').CosmosClient;

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://portaltechnologics-server:frHFtTzsDnXiePXeRp6lNL4f3omNUpUpuk0zKom08myfeLiRJQIxxJEuad0eRagX9nThg0sB1tIxACDbME0weA==@portaltechnologics-server.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@portaltechnologics-server@', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Order = mongoose.model('Order', {
  name: String,
  type: String,
  size: String,
  price: Number,
  quantity: Number,
  amount: Number,
  time: Date,
});

// Azure Cosmos DB connection
const cosmosClient = new CosmosClient({
  endpoint: 'https://portaltechnologics-server.documents.azure.com:443/',
  key: 'frHFtTzsDnXiePXeRp6lNL4f3omNUpUpuk0zKom08myfeLiRJQIxxJEuad0eRagX9nThg0sB1tIxACDbME0weA==',
});

const databaseId = 'portaltechnologics-server';
const containerId = '';
const container = cosmosClient.database(databaseId).container(containerId);

// MongoDB routes
app.get('/mongo/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching MongoDB orders' });
  }
});

app.post('/mongo/orders', async (req, res) => {
  const newOrder = new Order(req.body);
  newOrder.time = new Date();
  try {
    await newOrder.save();
    res.json({ success: true, message: 'MongoDB order created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error creating MongoDB order' });
  }
});

// Cosmos DB routes
app.get('/cosmos/orders', async (req, res) => {
  try {
    const { resources: cosmosOrders } = await container.items.readAll().fetchAll();
    res.json(cosmosOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching Cosmos DB orders' });
  }
});

app.post('/cosmos/orders', async (req, res) => {
  const newItem = req.body;
  try {
    const { resource: cosmosOrder } = await container.items.create(newItem);
    res.json({ success: true, data: cosmosOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error creating Cosmos DB order' });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
