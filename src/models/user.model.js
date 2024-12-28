import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: [3,'enter valid username'],
        trim : true,
        maxlength: [50, 'Username should be less than 50 characters']
    },
    email: {
        type: String,
        required: function () {
          return !this.phoneNumber; // Email is required only if phoneNumber is not present
        },
        unique: true, // Ensures that email is unique
        match: [
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
          'Please enter a valid email address',
        ], // Email validation regex
      },
      phoneNumber: {
        type: String,
        required: function () {
          return !this.email; // Phone number is required only if email is not present
        },
        unique: true, // Ensures phone number is unique
        match: [
          /^\+?[1-9]\d{1,4}(\s?\(?\d{1,3}\)?[\s.-]?)?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,4}$/,
          'Please enter a valid phone number with country code (e.g., +1 234 567 8901)',
        ], // Phone number validation (including country code)
      },
      password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password should be at least 6 characters long'], // Password length validation
      },
      
},
{timestamps : true,}
);

// Pre-save hook to hash the password before saving it
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      return next(); // Skip if password is not modified
    }
  
    try {
      // Hash the password
      const salt = await bcrypt.genSalt(10); // Generate salt
      this.password = await bcrypt.hash(this.password, salt); // Hash password with salt
      next();
    } catch (error) {
      next(error); // Pass any error to the next middleware
    }
  });
  
  // Method to compare passwords (for login validation)
  userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password); // Compare hashed passwords
  };
  
  // Create and export the User model
  const User = mongoose.model('User', userSchema);
  
  export default User;
  