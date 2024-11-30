const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.get('/',(req,res)=>{
    res.send('The server is running')
})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3oeok.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
   
    await client.connect();
    
    const allCoffeeCollection = client.db('CoffeeBox').collection('Coffee');
    const userCollection = client.db('CoffeeBox').collection('Users');
    app.get('/coffee',async(req,res)=>{
        const cursor = allCoffeeCollection.find()
        const result = await cursor.toArray();
        res.send(result)
    })
    app.get('/coffee/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await allCoffeeCollection.findOne(query);
      res.send(result)
    })
    app.post('/coffee', async(req,res)=>{
        const newCoffee = req.body;
        const result = await allCoffeeCollection.insertOne(newCoffee)
         res.send(result)
        
    })
    app.put('/coffee/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)};
      const options = { upsert: true };
      const coffee = req.body;
      const updateCoffee = {
        $set : {
           name : coffee.name,
          chef : coffee.chef,
          supplier : coffee.supplier,
          taste : coffee.taste,
          category : coffee.category,
          details : coffee.details,
          photo : coffee.photo,
        }
      }
      const result = await allCoffeeCollection.updateOne(filter,updateCoffee,options);
      res.send(result)
    })
     app.delete('/coffee/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await allCoffeeCollection.deleteOne(query);
      res.send(result)
     })


    //   User data......................
    app.get('/users',async(req,res)=>{
        const cursor = userCollection.find()
        const result = await cursor.toArray();
        res.send(result)

    })
    app.post('/users',async(req,res)=>{
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result)

    })
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.listen(port,()=>{
    console.log(`My port is : ${port}`)
})