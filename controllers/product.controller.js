import Product from "../models/product.model.js";
import Category from "../models/category.model.js"
import slugify from "slugify";


export const createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      price,
      discount,
      description,
      stock,
      images,
      category, // should be a category _id
      isFeatured,
      isHotDeal,
      tags,
      createdBy,
    } = req.body;

    // ✅ Validate category existence
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ error: "Invalid category" });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const product = new Product({
      name,
      brand,
      price,
      discount,
      description,
      stock,
      images,
      category,
      isFeatured,
      tags,
      createdBy,
      isHotDeal,
      slug
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
    const { category, sort, hot } = req.query;
    let query = {};

    if (hot === "true") {
      query.isHotDeal = true;
    }

    // 🟦 Handle category filtering
    if (category) {
      const foundCategory = await Category.findOne({ name: category });
      if (!foundCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
      query.category = foundCategory._id;
    }

    // 🟩 Handle sorting
    let sortOption = {};
    if (sort === "latest") {
      sortOption = { createdAt: -1 }; // Sort by newest
    } else if (sort === "oldest") {
      sortOption = { createdAt: 1 }; // Sort by oldest
    }

    const products = await Product.find(query)
      .populate("category")
      .sort(sortOption);

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};




export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug }).populate("category", "name slug");

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    console.error("Error retrieving product:", error.message);
    res.status(500).json({ message: "Error retrieving product" });
  }
};

// controllers/product.controller.js
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("Error in getProductById:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update fields
    const fields = [
      "name", "brand", "price", "discount", "description",
      "sizes", "colors", "stock", "images", "category",
      "isFeatured", "isHotDeal", "tags"
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    await product.save();

    res.status(200).json({ message: "Product updated", product });
  } catch (error) {
    console.error("Update product error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


  