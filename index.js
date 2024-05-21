const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');

// built in middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Password}@cluster0.f3vnw1n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // ======= Database Connections 
    const trendyWearDB = client.db("travelBD");
    const allData = trendyWearDB.collection("allData");
    const allUsers = trendyWearDB.collection("allUsers");

    // get all data from api
    app.get('/api/v1/getalldata', async(req, res) => {
        const getAllData = await allData.find().toArray();
        res.send(getAllData);
    })

    // get all user from database
    app.get('/api/v1/dashboard/getalluser', async(req, res) => {
        const getAllData = await allUsers.find().toArray();
        res.send(getAllData);
    })

    // post a data in the server
    app.post('/api/v1/user/addnew', async(req, res) => {
        const info = req.body;
        const result = await allData.insertOne(info);
        res.send(result);
    })

    // update an item / travel related api from the server
    app.patch('/api/v1/user/update/:id', async(req, res) => {
        const id = req.params.id;
        const item = req.body;
        const filter = {_id: new ObjectId(id)};
        const updatedItem = {
            $set: {

            }
        }
        const result = await allData.updateOne(filter, updatedItem);
        res.send(result);
    })

    // delete an item / travel related api from the server
    app.delete('/api/v1/user/delete/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const deletedData = await allData.deleteOne(query)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Welcome to Travel BD')
})

app.listen(port, () => {
  console.log(`Travel BD app listening on port ${port}`)
})