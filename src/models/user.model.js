import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: [3, "Username should be at least 3 characters"],
      maxlength: [50, "Username should be less than 50 characters"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // Allows email to be optional (null is allowed)
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address",
      ],
    },
    phoneNumber: {
      type: String,
      unique: true,
      sparse: true, // Allows phone number to be optional (null is allowed)
      match: [
        /^\+?[1-9]\d{1,4}(\s?\(?\d{1,3}\)?[\s.-]?)?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,4}$/,
        "Please enter a valid phone number",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password should be at least 6 characters long"],
    },
    type: {
      type: String,
      enum: ["user", "artist"],
      required: true,
      default: "user",
    },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
