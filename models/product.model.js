import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: { type: String, unique: true },
  brand: {
    type: String,
    default: "Generic",
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number, // e.g., 0.10 for 10% off
    default: 0,
  },
  description: {
    type: String,
    required: true,
  },
  sizes: {
    type: [String], // e.g., ["7", "8", "9", "10", "11"]
    default: [],
  },
  colors: {
    type: [String], // e.g., ["black", "white", "red"]
    default: [],
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  images: {
    type: [String], // image URLs or filenames if using local storage
    default: [],
  },
  category: {
    type: String, // e.g., "Men", "Women", "Kids"
    required: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  tags: {
    type: [String], // e.g., ["running", "sports", "outdoor"]
    default: [],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // To track which admin created the product
  },
}, { timestamps: true });

// ✅ Add this pre-save hook to auto-generate slug from name
productSchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model("Product", productSchema);
