//initialize
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//make the product schema
const productSchema = new Schema({
  id: { type: String, required: true },
  productName: { type: String, required: true },
  brand: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: String, required: true },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;

/*
    you know, i may go back to this app after the project is over
    I have 2 ideas for extra functionality to this app

    first thought, the checkout button could take me to another page
    somewhere i can just cross off items as having been bought.

    second thought, i could add the name of the store i'd buy that item from.
    that way, i can filter the checkout page when out shopping
    and not have to remember "does this store have this item?"
*/
