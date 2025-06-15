import Product from "../models/product.model.js";


export const createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      price,
      discount,
      description,
      sizes,
      colors,
      stock,
      images, // Array of Cloudinary URLs
      category,
      isFeatured,
      tags,
      createdBy,
    } = req.body;

    const product = new Product({
      name,
      brand,
      price,
      discount,
      description,
      sizes,
      colors,
      stock,
      images,
      category,
      isFeatured,
      tags,
      createdBy,
    });

    await product.save();

    res.status(201).json({
      message: "Product saved to database",
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getProducts = async (req, res) => {
    try {
      const products = await Product.find(); // fetch all products
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const getProductBySlug = async (req, res) => {
    try {
      const { slug } = req.params;
      const product = await Product.findOne({ slug });
  
      if (!product) return res.status(404).json({ message: "Product not found" });
  
      res.status(200).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving product" });
    }
  };
  