export default function GroceryForm({
  productName,
  brand,
  image,
  price,
  handleOnSubmit,
  handleOnChange,
  isEditing,
}) {
  return (
    <div>
      <form onSubmit={handleOnSubmit}>
        <label htmlFor="productName">Name:</label>
        <input
          type="text"
          name="productName"
          value={productName}
          onChange={handleOnChange}
          placeholder="Enter Name"
          required
        />
        <br />
        <label htmlFor="brand">Brand:</label>
        <input
          type="text"
          name="brand"
          value={brand}
          onChange={handleOnChange}
          placeholder="enter brand name"
          required
        />
        <br />
        <label htmlFor="image">Image URL:</label>
        <input
          type="text"
          name="image"
          value={image}
          onChange={handleOnChange}
          placeholder="enter image URL"
          required
        />
        <br />
        <label htmlFor="price">Price:</label>
        <input
          type="text"
          name="price"
          value={price}
          onChange={handleOnChange}
          placeholder="enter price"
          required
        />
        <br />
        <button>{isEditing ? "edit" : "submit"}</button>
      </form>
    </div>
  );
}
