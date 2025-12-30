import mongoose from "mongoose";

<<<<<<< HEAD
const shippingAddressSchema = new mongoose.Schema(
  {
    county: { type: String, required: true },
    subCounty: { type: String, required: true },
    town: { type: String, required: true },
    phoneNumber: {
      type: String,
      required: true,
      match: [/^07\d{8}$/, "Phone number must be a valid Kenyan number"],
    },
    shippingFee: { type: Number, default: 0 },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true, _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // required if NOT Google user
      },
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true, // allows null values
    },

    avatar: {
      type: String,
    },

    shippingAddress: [shippingAddressSchema],
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
=======

const shippingAddressSchema = new mongoose.Schema({
    county: { type: String, required: true },
    subCounty: { type: String, required: true },
    town: { type: String, required: true },
    phoneNumber: { type: String, required: true, match: [/^07\d{8}$/, "Phone number must be a valid Kenyan number"] },
    shippingFee: { type: Number, default: 0 },
    isDefault: { type: Boolean, default: false },
  }, { timestamps: true, _id: true });
  

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    shippingAddress: [shippingAddressSchema],
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
>>>>>>> origin/main
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,

    //  Role Field
    role: {
<<<<<<< HEAD
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
=======
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
}, { timestamps: true })

export const User = mongoose.model('User', userSchema)
>>>>>>> origin/main
