const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = process.env.DB_PATH;
let client = new MongoClient(uri ,{useNewUrlParser:true})

app.get('/products' , (req,res) => {
    client = new MongoClient(uri,{useNewUrlParser:true})
    client.connect((err) => {
        const collection = client.db('onlineStore').collection('products');
        collection.find().toArray((err, documents) => {
            if(err){
                console.log(err);
            }else{
                res.send(documents);
            }
        })
    })
})
app.get('/' , (req,res) => {
    res.send("Welcome to Ema-Jon Backend Server!")
})
app.get('/product/:id', (req,res) => {
    client = new MongoClient(uri,{useNewUrlParser:true})
    client.connect(err => {
        const collection = client.db('onlineStore').collection('products');
        collection.find({key:req.params.id}).toArray((err, documents) => {
            if(err){
                console.log(err);
            }else{
                res.send(documents[0]);
            }
        })
    })
})
// Post Method
app.post('/getProductsByKey', (req,res) => {
    client = new MongoClient(uri,{useNewUrlParser:true})
    const productKeys = req.body;
    console.log(productKeys);
    client.connect(err => {
        const collection = client.db('onlineStore').collection('products');
        collection.find({key:{$in:productKeys}}).toArray((err, documents) => {
            if(err){
                console.log(err);
            }else{
                res.send(documents);
            }
        })
    })
})
app.post('/addproduct', (req,res) => {
    client = new MongoClient(uri,{useNewUrlParser:true})
    client.connect(err => {
        const collection = client.db('onlineStore').collection('products');
        collection.insertOne(req.body , (err, result) => {
            if(err){
                console.log(err);
                res.status(500).send(err)

            }else{
                res.send(result);
                console.log(result);
            }
            client.close();
        });
    })

})


const port = 8000;
app.listen(port , (err) => {
    console.log("Listing to Port " , port);
})