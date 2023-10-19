const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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

async function run() {
  try {
   // Connect the client to the server	(optional starting in v4.7)
   await client.connect();

   const productCollection = client.db('productDB').collection('product')
   const categoryCollection = client.db('productDB').collection('category')
   const reviewCollection = client.db('productDB').collection('review')
   const sliderCollection = client.db('productDB').collection('slider')
   const cartCollection = client.db('productDB').collection('cart')

   app.get('/products', async(req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray()
      res.send(result)
   })

   app.get('/products/:id', async(req, res) => {
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const result = await productCollection.findOne(filter)
      res.send(result)
   })

   app.put('/products/:id', async(req, res) => {
      const id = req.params.id
      const updateProduct = req.body;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const product = {
         $set: {
            name: updateProduct.name,
            brandName: updateProduct.brandName,
            type: updateProduct.type,
            image: updateProduct.image,
            price: updateProduct.price,
            rating: updateProduct.rating,
            details: updateProduct.details
         }
      }
      const result = await productCollection.updateOne(filter, product, options)
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

   app.get('/category/:id', async(req, res) => {
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const result = await categoryCollection.findOne(filter)
      res.send(result)
   })

   app.post('/category', async(req, res) => {
      const query = req.body;
      const result = await categoryCollection.insertOne(query)
      res.send(result)
   })

   app.get('/review', async(req, res) => {
      const cursor = reviewCollection.find();
      const result = await cursor.toArray()
      res.send(result)
   })

   app.post('/review', async(req, res) => {
      const query = req.body;
      const result = await reviewCollection.insertOne(query)
      res.send(result)
   })

   app.get('/slider', async(req, res) => {
      const cursor = sliderCollection.find();
      const result = await cursor.toArray()
      res.send(result)
   })

   app.post('/slider', async(req, res) => {
      const query = req.body;
      const result = await sliderCollection.insertOne(query)
      res.send(result)
   })

   app.get('/cart', async(req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray()
      res.send(result)
   })

   app.post('/cart', async(req, res) => {
      const query = req.body;
      const result = await cartCollection.insertOne(query)
      res.send(result)
   })

   app.delete('/cart/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const result = await cartCollection.deleteOne(filter)
      res.send(result)
   })


    
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