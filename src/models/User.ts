import bcrypt from "bcrypt";
import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail";
import isURL from "validator/lib/isURL";

const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: [true, "User ID is required"],
    minLength: [3, "User ID must be at least 3 characters long"],
    unique: [true, "User ID already exists"],
    lowercase: true,
  },
  email: {
    type: String,
    unique: [true, "Email already exists"],
    lowercase: true,
    validate: [isEmail, "Invalid email format"],
    sparse: true,
    index: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  profile_photo_url: {
    type: String,
    validate: [isURL, "Invalid URL format"],
  },
  address: {
    type: String,
  },
  date_of_birth: {
    type: Date,
  },
  salutation: {
    type: String,
  },
});

userSchema.post("save", async function (doc, next) {
  const user = this;
  if (user.isNew) {
    console.log("New user created:", user.user_id);
  } else {
    console.log("User updated:", user.user_id);
  }
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  // Hash the password before saving
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const User = mongoose.model("user", userSchema);

export default User;
