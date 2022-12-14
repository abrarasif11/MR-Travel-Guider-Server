const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


const app = express();
const port = process.env.PORT || 5000;

// Middle Wares //
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Tourist Site Server is Running')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vhdpi0m.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {

    // await client.connect()
    const serviceCollection = client.db('tourGuider').collection('services');
    const reviewCollection = client.db('tourGuider').collection('review')
    try {
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        app.post('/myreviews', async (req, res) =>{
            const review = req.body;
           const result = await reviewCollection.insertOne(review);
            res.send(result);
        });
        app.get("/myreviews", async (req, res) => {
            const query = {};
            const cursor = await reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
          });
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cursor = await serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
          });
        app.get("/servicesforhome", async (req, res) => {
            const query = {};
            const cursor = await serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
          });
    }
    finally {

    }
}
run().catch(err => console.error(err));

app.listen(port, () => {
    console.log(`Tourist Server Running on ${port}`);
})