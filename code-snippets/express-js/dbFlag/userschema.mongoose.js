import mongoose, {Schema} from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'Email address is required',
    match: [/^[A-Za-z0-9.+-]+@[A-Za-z0-9]+\\.[A-Za-z]{2,3}$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true
  }
});
  
export default mongoose.model("User", UserSchema);