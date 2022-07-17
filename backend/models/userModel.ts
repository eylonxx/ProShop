import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { NextFunction } from 'express';

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

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = model<User>('User', userSchema);

export default User;
