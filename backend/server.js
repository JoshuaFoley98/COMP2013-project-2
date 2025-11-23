//initialize server
const express = require("express");
const server = express();
const port = 3000;
require("dotenv").config();

//connecting/setting up database
mongoose = require("mongoose");
const { DB_URI } = process.env;
const Product = require("./models/product");

//browser security thing i don't understand
const cors = require("cors");

//middleware
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());

//databse connections and server listening
mongoose
  .connect(DB_URI)
  .then(() => {
    server.listen(port, () => {
      console.log(`database is connected\nserver is listening on port ${port}`);
    });
  })
  .catch((error) => console.log(error.message));

////////////////////ROUTES////////////////////
//AKA: where we goin?

//root route
//aka: it's alive! it's alive!
server.get("/", (request, response) => {
  response.send("is this thing on?");
});

//get /products route all data from from products
//aka: show me the money
server.get("/products", async (request, response) => {
  try {
    const products = await Product.find();
    response.send(products);
    console.log(products);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

//post a new product
server.post("/products", async (request, response) => {
  const { productName, brand, image, price } = request.body;
  const newProduct = new Product({
    id: crypto.randomUUID().toString(),
    productName,
    brand,
    image,
    price,
  });
  console.log(newProduct.productName);
  try {
    await newProduct.save();
    response.status(200).send({ message: `product added! woohoo!` });
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

//delete a product
//AKA 86 it
server.delete("/products/:id", async (request, response) => {
  const { id } = request.params;
  try {
    response = await Product.findByIdAndDelete(id);
    response.send({
      message: "Product Deleted",
      date: new Date(Date.now()),
    });
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

//let's get a contact by id
server.get("/products/:id", async (request, response) => {
  const { id } = request.params;
  try {
    const productToEdit = await Product.findById(id);
    response.send(productToEdit);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

//patch route
server.patch("/products/:id", async (request, response) => {
  const { id } = request.params;
  const { productName, brand, image, price } = request.body;
  try {
    await Product.findByIdAndUpdate(id, {
      productName,
      brand,
      image,
      price,
    });
    response.send({
      message: "Product has been updated",
      date: new Date(Date.now()),
    });
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});
