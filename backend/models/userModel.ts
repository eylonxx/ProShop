import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

interface User {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  let isValid = await bcrypt.compare(enteredPassword, this.password);
  return isValid;
};

const User = model<User>('User', userSchema);

export default User;
