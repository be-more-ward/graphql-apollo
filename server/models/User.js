import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  jobs: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Job",
    },
  ],
});

UserSchema.method("createJWT", function () {
  const token = jwt.sign(
    { name: this.name, userId: this._id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  return token;
});

export const User = mongoose.model("User", UserSchema);
