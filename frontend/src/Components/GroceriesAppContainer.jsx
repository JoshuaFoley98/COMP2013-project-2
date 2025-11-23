import { useState, useEffect } from "react";
import axios from "axios";
import CartContainer from "./CartContainer";
import ProductsContainer from "./ProductsContainer";
import NavBar from "./NavBar";
import GroceryForm from "./GroceryForm";
export default function GroceriesAppContainer() {
  const [products, setProducts] = useState([]);
  /*
  i should probably call it productsData, but since all of these are looking for products anyways, 
  i feel like it would be easier because i don't have to change a bunch of variables.
 */

  const [productQuantity, setProductQuantity] = useState(
    products.map((product) => ({ id: product.id, quantity: 0 }))
  );
  const [postResponse, setPostResponse] = useState("");
  const [cartList, setCartList] = useState([]);
  const [formData, setFormData] = useState({
    productName: "",
    brand: "",
    image: "",
    price: "",
    //using productName instead of name
    // that's what is in the model, i don't want to confuse myself
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    handleProductsDB();
  }, [postResponse]);

  //let's bring in the products from the database
  const handleProductsDB = async () => {
    try {
      //get the data from the localhost
      /*
      also, there must be a more descriptive name than response.
      if it's standard, that's fine.
      but, i kinda wish it explained what it did better.
      dataGrab? productGet? i'll think of something
      */
      const response = await axios.get("http://localhost:3000/products");
      //checking if it works
      //console.log(response.data);
      //ok, good. make it the products array.
      setProducts(response.data);

      //i was warned that quantity was set based on the empty products array
      //and thus being basically null and breaking the app early on in creation
      //i'm glad fixing that is as obvious as setting it again in the DB handler
      setProductQuantity(
        response.data.map((product) => ({ id: product.id, quantity: 0 }))
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleResetForm = () => {
    setFormData({
      productName: "",
      brand: "",
      image: "",
      price: "",
    });
  };
  //let's submit a new product
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        handleOnUpdate(formData.id);
        handleResetForm();
        setIsEditing(false);
      } else {
        await axios
          .post("http://localhost:3000/products", formData)
          .then((response) => setPostResponse(response.data))
          .then(console.log(postResponse))
          .then(() => handleResetForm());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //we gotta have the textboxes allow text
  const handleOnChange = (e) => {
    setFormData((prevData) => {
      return { ...prevData, [e.target.name]: e.target.value };
    });
  };

  //let's delete a product by id
  const handleOnDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/products/${id}`
      );
      console.log(response);
      setPostResponse({
        message: response.data.message,
        date: response.data.date,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  //okay, delete only happens when i refresh and i'm not sure why. so i'm moving on to edit
  const handleOnEdit = async (id) => {
    try {
      const productToEdit = await axios.get(
        `http://localhost:3000/products/${id}`
      );
      console.log(productToEdit);
      setFormData({
        productName: productToEdit.data.productName,
        brand: productToEdit.data.brand,
        image: productToEdit.data.image,
        price: productToEdit.data.price,
        id: productToEdit.data._id,
      });
      setIsEditing(true);
    } catch (error) {
      console.log(error);
    }
  };

  //handler update
  //i know i could use the date instead of a uuid. but, functionally it's the same
  const handleOnUpdate = async (id) => {
    try {
      const result = await axios.patch(
        `http://localhost:3000/products/${id}`,
        formData
      );
      setPostResponse({
        message: result.data.message,
        date: result.data.date,
      });
    } catch (error) {
      console.log(error);
    }
  };
  /////////////
  ////down here is the old stuff. i'm doing my absolute best not to touch it
  const handleAddQuantity = (productId, mode) => {
    if (mode === "cart") {
      const newCartList = cartList.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
      setCartList(newCartList);
      return;
    } else if (mode === "product") {
      const newProductQuantity = productQuantity.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
      setProductQuantity(newProductQuantity);
      return;
    }
  };

  const handleRemoveQuantity = (productId, mode) => {
    if (mode === "cart") {
      const newCartList = cartList.map((product) => {
        if (product.id === productId && product.quantity > 1) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });
      setCartList(newCartList);
      return;
    } else if (mode === "product") {
      const newProductQuantity = productQuantity.map((product) => {
        if (product.id === productId && product.quantity > 0) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });
      setProductQuantity(newProductQuantity);
      return;
    }
  };

  const handleAddToCart = (productId) => {
    const product = products.find((product) => product.id === productId);
    const pQuantity = productQuantity.find(
      (product) => product.id === productId
    );
    const newCartList = [...cartList];
    const productInCart = newCartList.find(
      (product) => product.id === productId
    );
    if (productInCart) {
      productInCart.quantity += pQuantity.quantity;
    } else if (pQuantity.quantity === 0) {
      alert(`Please select quantity for ${product.productName}`);
    } else {
      newCartList.push({ ...product, quantity: pQuantity.quantity });
    }
    setCartList(newCartList);
  };

  const handleRemoveFromCart = (productId) => {
    const newCartList = cartList.filter((product) => product.id !== productId);
    setCartList(newCartList);
  };

  const handleClearCart = () => {
    setCartList([]);
  };

  return (
    <div>
      <NavBar quantity={cartList.length} />

      <p style={{ color: "wheat" }}>
        {postResponse?.message} {postResponse?.date}
      </p>
      <div className="GroceriesApp-Container">
        <GroceryForm
          productName={formData.productName}
          brand={formData.brand}
          image={formData.image}
          price={formData.price}
          handleOnSubmit={handleOnSubmit}
          handleOnChange={handleOnChange}
          isEditing={isEditing}
        />

        <div className="GroceriesApp-Container">
          <ProductsContainer
            products={products}
            handleAddQuantity={handleAddQuantity}
            handleRemoveQuantity={handleRemoveQuantity}
            handleAddToCart={handleAddToCart}
            handleOnDelete={handleOnDelete}
            handleOnEdit={handleOnEdit}
            productQuantity={productQuantity}
          />
          <CartContainer
            cartList={cartList}
            handleRemoveFromCart={handleRemoveFromCart}
            handleAddQuantity={handleAddQuantity}
            handleRemoveQuantity={handleRemoveQuantity}
            handleClearCart={handleClearCart}
          />
        </div>
      </div>
    </div>
  );
}
