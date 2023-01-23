import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
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

UserSchema.pre("save", async function () {
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

UserSchema.method("createJWT", function () {
  const token = jwt.sign(
    { name: this.name, userId: this._id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  return token;
});

UserSchema.method("comparePasswords", async function (candidatePassword) {
  const isMatch = await bcryptjs.compare(candidatePassword, this.password);
  return isMatch;
});

export const User = mongoose.model("User", UserSchema);
