const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yu2o5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection error', err);
    const serviceCollection = client.db("companion").collection("services");
    const reviewCollection = client.db("companion").collection("reviews");
    const adminCollection = client.db("companion").collection("admins");
    const ordersCollection = client.db("companion").collection("orders");
    // perform actions on the collection object
    console.log('Database Connected Successfully');

    app.post('/addService', (req, res) => {
        const newService = req.body;
        console.log('new Service', newService);
        serviceCollection.insertOne(newService)
            .then(result => {
                console.log('insertedCount', result);
                res.send(result)
            })
    })

    app.get('/services', (req, res) => {
        serviceCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    })
    app.post('/addReview', (req, res) => {
        const newReview = req.body;
        console.log('new Service', newReview);
        reviewCollection.insertOne(newReview)
            .then(result => {
                console.log('insertedCount', result);
                res.send(result)
            })
    })

    app.get('/reviews', (req, res) => {
        reviewCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    })

    app.post('/addAdmin', (req, res) => {
        const newAdmin = req.body;
        console.log('new Service', newAdmin);
        adminCollection.insertOne(newAdmin)
            .then(result => {
                console.log('insertedCount', result);
                res.send(result)
            })
    })

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        console.log('new Service', email);
        adminCollection.find({email:email})
        .toArray((err,items)=>{
            res.send(items.length>0)
          })
    })

    app.post('/addOrders',(req,res) => {
        const orderedBook=req.body;
        console.log(orderedBook);
        ordersCollection.insertOne(orderedBook)
        .then(result => {
          res.send(result.insertedCount>0)
        })
    })

    app.get('/service/:id',(req,res) => {
        console.log('id',req.params.id);
        serviceCollection.find({_id: ObjectId(req.params.id)})
        .toArray((err,items)=>{
            res.send(items[0])
        })
    })

    app.get('/orders',(req,res) => {
        ordersCollection.find({email: req.query.email})
        .toArray((err,items)=>{
            res.send(items)
        })
    })
    
    app.get('/allOrders',(req,res) => {
        ordersCollection.find({})
        .toArray((err,items)=>{
            res.send(items)
        })
    })

    app.delete('/delete/:id',(req,res) => {
        const id=ObjectId(req.params.id);
        serviceCollection.findOneAndDelete({_id: id})
        .then(result => {
          console.log(result);
          res.send(result.deletedCount>0)
        })
    })
    //   client.close();
});



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})