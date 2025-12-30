import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  brand: {
    type: String,
    default: "Generic",
  },
  isHotDeal: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    required: true,
  },

  // 🔄 Dynamic Fields Here
  attributes: {
    type: Map, // allows flexible key-value pairs
    of: String,
    default: {},
  },

  // 🧰 Common Fields
  stock: { type: Number, default: 0 },
  images: { type: [String], default: [] },

  // 🔖 Categorization
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  isFeatured: { type: Boolean, default: false },
  tags: { type: [String], default: [] },

  // 👤 Creator
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

productSchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model("Product", productSchema);
