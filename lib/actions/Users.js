import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // You should store the secret in .env
const client = new MongoClient(process.env.MONGO_URI);
const dbName = "BidGO";
let emailVar = "";
let userIdVar = "";

// Function to check if user is valid


// Function to check if user is valid
export const isValidUser = async (email, password) => {
  console.log('Validating user:', email);
  try {
    if (typeof window !== 'undefined') {
      throw new Error('Database operations are server-side only');
    }
    await client.connect();
    const db = client.db(dbName);
    const usersCollection = db.collection('RegisteredUsers');

    const user = await usersCollection.findOne({ email });
    if (!user) {
      console.log("User doesn,t Exist");
      return false; // User not found, invalid login
    }

    if (user.password !== password) {
      console.log("Incorrect Password");
      return false; // Invalid password
    }
    console.log("User Data: ", user);
    // If user is valid, generate JWT
    // const payload = { userId: user.userId, username: user.username };
    // const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Set expiration time for token
    const payload = { userId: user.userId, email: user.username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    return { valid: true, token,userId: user.userId }; // Return token along with validity
  } catch (error) {
    console.error('Error validating user:', error);
    throw new Error('Database error');
  } finally {
    await client.close();
  }
};

// Function to create a new user
export const createUser = async ({ email, password, username }) => {
  try {
    if (typeof window !== 'undefined') {
      throw new Error('Database operations are server-side only');
    }
    console.log("Connecting to DB");
    await client.connect();
    console.log("Connected to DB");

    const db = client.db(dbName);
    const usersCollection = db.collection('RegisteredUsers');

    // Check if user with the same email already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      throw new Error('Email address already registered');
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Ensure email ends with .com
    if (!email.endsWith('.com')) {
      throw new Error('Email must end with .com');
    }

    // Validate password
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new Error(
        'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.'
      );
    }

    // Generate a random 10-digit user ID and current timestamp
    const userId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const createdAt = new Date().toISOString();

    const newUser = {
      email,
      password,
      username,
      userId, // Store random ID
      createdAt, // Store the current date and time
    };
    console.log("New User Data: ", newUser);

    const result = await usersCollection.insertOne(newUser);
    console.log('New User Created:', result);

    return await usersCollection.findOne({ _id: result.insertedId });
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Database error');
  } finally {
    await client.close();
  }
};


// Function to get the userIdVar
export const getUserId = () => {
  console.log("Exporting User ID: ", userIdVar);
  return userIdVar;
};

// Function to verify the token
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded; // Return the decoded payload (e.g., userId, email)
  } catch (error) {
    console.error('Error verifying token:', error);
    return null; // Invalid token
  }
};
