const express = require('express');
const router = express.Router();
const getUsers = require('../contrller/users');
const fs = require('fs'); // Import the file system module
const route = require('color-convert/route');
const { v4: uuidv4 } = require('uuid');
const mongoose = require("mongoose");
const { MongoClient } = require('mongodb');


MONGODB_URL="mongodb://localhost:27017/"
const DB_NAME = 'skypride'; // Replace 'skypride' with your actual database name

mongoose
  .connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
  const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };



router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Validate input fields
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Generate a unique ID for the user
    const userId = uuidv4();

    // Create user object with ID
    const user = { id: userId, name, email, password };

    // Connect to MongoDB
    const client = new MongoClient('mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db('skypride'); // Replace 'yourDatabaseName' with your actual database name
        const collection = db.collection('user'); // Assuming your collection name is 'user'

        // Check if user with same email already exists
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Insert new user into MongoDB
        await collection.insertOne(user);

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
});

router.post('/addUser', async (req, res) => {
    const { firstName, lastName, age, gender } = req.body;

    // Validate input fields
    if (!firstName || !lastName || !age || !gender) {
        return res.status(400).json({ error: 'First name and last name are required' });
    }

    // Generate a unique ID for the user
    const userId = uuidv4();

    // Create user object with ID, first name, and last name
    const user = { id: userId, firstName, lastName, age, gender };

    // Connect to MongoDB
    const client = new MongoClient('mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db('skypride'); // Replace 'yourDatabaseName' with your actual database name
        const collection = db.collection('addUser'); // Assuming your collection name is 'user'

        // Insert new user into MongoDB
        await collection.insertOne(user);

        res.status(201).json({ message: 'User added successfully', user });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
});



router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Connect to MongoDB
    const client = new MongoClient('mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db('skypride'); // Replace 'yourDatabaseName' with your actual database name
        const collection = db.collection('user'); // Assuming your collection name is 'user'

        // Find user with matching email and password
        const user = await collection.findOne({ email, password });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
});



router.get('/mobile-list', async (req, res) => {
    const client = new MongoClient(MONGODB_URL, mongoOptions);

    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection('mobile_list');

        // Get the value of 'name', 'type', and 'id' query parameters
        const { name, type, id } = req.query;

        // Create an empty filter object
        const filter = {};

        // If 'name' parameter is provided, add a case-insensitive filter
        if (name) {
            filter.name = { $regex: new RegExp(name, 'i') };
        }

        // If 'type' parameter is provided, add a case-insensitive filter
        if (type) {
            filter.type = { $regex: new RegExp(type, 'i') };
        }

        // If 'id' parameter is provided, add an exact match filter
        if (id) {
            filter.id = parseInt(id);
        }

        // Fetch documents based on the filter
        const mobileList = await collection.find(filter).toArray();

        if (mobileList.length > 0) {
            res.status(200).json({ mobileList });
        } else {
            res.status(404).json({ error: 'Mobile list not found' });
        }
    } catch (error) {
        console.error('Error fetching mobile list:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
});





router.delete('/delete-user/:userId', async (req, res) => {
    const userId = req.params.userId;

    // Connect to MongoDB
    const client = new MongoClient('mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db('skypride'); // Replace 'yourDatabaseName' with your actual database name
        const collection = db.collection('addUser'); // Assuming your collection name is 'user'

        // Check if user with given ID exists
        const existingUser = await collection.findOne({ id: userId });
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Delete user from MongoDB
        await collection.deleteOne({ id: userId });

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
});

router.put('/editUser/:userId', async (req, res) => {
    const userId = req.params.userId;
    const { firstName, lastName, age, gender } = req.body;

    // Validate input fields
    if (!firstName || !lastName || !age || !gender) {
        return res.status(400).json({ error: 'First name and last name are required' });
    }

    // Connect to MongoDB
    const client = new MongoClient('mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db('skypride'); // Replace 'yourDatabaseName' with your actual database name
        const collection = db.collection('addUser'); // Assuming your collection name is 'user'

        // Check if user with given ID exists
        const existingUser = await collection.findOne({ id: userId });
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user details in MongoDB
        await collection.updateOne({ id: userId }, { $set: { firstName, lastName, age, gender } });

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
});


router.get('/user-details/:userId', async (req, res) => {
    const userId = req.params.userId;

    // Connect to MongoDB
    const client = new MongoClient('mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db('skypride'); // Replace 'yourDatabaseName' with your actual database name
        const collection = db.collection('addUser'); // Assuming your collection name is 'user'

        // Fetch user details from MongoDB
        const user = await collection.findOne({ id: userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
});


router.get('/users', async (req, res) => {
    const { firstName, page, pageSize = 10 } = req.query; // Get the search query and pagination parameters

    // Convert page and pageSize to numbers
    const pageNumber = page ? parseInt(page) : null;
    const limit = parseInt(pageSize);

    const client = new MongoClient('mongodb+srv://vhemdip:AMv69NI2cCSwaI9Y@cluster0.hivu7de.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db('vhemdip');
        const collection = db.collection('user_management');

        let query = {};
        if (firstName) {
            const regex = new RegExp(firstName, 'i'); 
            query.firstName = regex;
        }

        if (pageNumber !== null) {
            const skip = (pageNumber - 1) * limit;

            const totalCount = await collection.countDocuments(query);

            const users = await collection.find(query).skip(skip).limit(limit).toArray();

            res.status(200).json({ totalCount, users });
        } else {
            const users = await collection.find(query).toArray();

            res.status(200).json({ totalCount: users.length, users });
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
});

module.exports = router;
