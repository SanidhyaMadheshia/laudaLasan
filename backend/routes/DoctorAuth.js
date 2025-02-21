const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor'); // Import Doctor model
const router = express.Router();
require('dotenv').config();

// ✅ Doctor Signup Route
router.post('/signup', async (req, res) => {
    const { medicalLicenseNumber, name, age, specialization, aadhar, gender, qualification, password } = req.body;

    try {
        // Check if doctor already exists
        let doctor = await Doctor.findOne({ medicalLicenseNumber });
        if (doctor) return res.status(400).json({ message: "Doctor already exists" });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new doctor
        doctor = new Doctor({ medicalLicenseNumber, name, age, specialization, aadhar, gender, qualification, password: hashedPassword });
        await doctor.save();

        // Generate JWT Token
        const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, doctor: { id: doctor._id, name, medicalLicenseNumber, age, specialization, gender, qualification } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// ✅ Doctor Login Route
router.post('/login', async (req, res) => {
    const { medicalLicenseNumber, password } = req.body;

    try {
        // Check if doctor exists
        const doctor = await Doctor.findOne({ medicalLicenseNumber });
        if (!doctor) return res.status(400).json({ message: "Doctor not found" });

        // Compare passwords
        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT Token
        const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, doctor: { id: doctor._id, name: doctor.name, medicalLicenseNumber: doctor.medicalLicenseNumber, age: doctor.age, specialization: doctor.specialization, gender: doctor.gender, qualification: doctor.qualification } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;



