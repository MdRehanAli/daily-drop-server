const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

const port = process.env.PORT

// Middleware 
app.use(express.json());
app.use(cors())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mrcc0jp.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.get('/', (req, res) => {
    res.send("Daily Drop Server is running....")
})

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const db = client.db("dailyDropDB");
        const parcelsCollection = db.collection('parcels');


        // All Api's are Here 
        app.get('/parcels', async (req, res) => {
            const query = {};
            const { email } = req.query;

            // /parcels?email="" & 
            if (email) {
                query.senderEmail = email;
            }

            const options = { sort: { createdAt: -1 } }

            const cursor = parcelsCollection.find(query, options)
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/parcels', async (req, res) => {
            const parcel = req.body;

            // Parcel Created Time 
            parcel.createdAt = new Date();

            const result = await parcelsCollection.insertOne(parcel);
            res.send(result);
        })

        app.delete('/parcels/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }

            const result = await parcelsCollection.deleteOne(query);
            res.send(result);
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

app.listen(port, () => {
    console.log(`Server is Running on port : ${port}`);
})