import User from '../models/userModel';
import bcrypt from 'bcryptjs';

const users: User[] = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'Oded',
    email: 'Oded@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Yuval',
    email: 'Yuval@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
];

export default users;
