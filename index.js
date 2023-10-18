const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.klq4o7m.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const categoryItems = [
   {
      "name": "sedan",
      "image": ""
   }
]

async function run() {
  try {

   const productCollection = client.db('productDB').collection('product')
   const categoryCollection = client.db('productDB').collection('category')

   app.get('/products', async(req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray()
      res.send(result)
   })

   app.post('/products', async(req, res) => {
      const query = req.body;
      const result = await productCollection.insertOne(query)
      res.send(result)
   })

   app.get('/category', async(req, res) => {
      const cursor = categoryCollection.find();
      const result = await cursor.toArray()
      res.send(result)
   })

   app.post('/category', async(req, res) => {
      const query = req.body;
      const result = await categoryCollection.insertOne(query)
      res.send(result)
   })


    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   //  await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
   res.send('hello world')
})

app.listen(port, () => {
   console.log(`server running on ${port}`)
})