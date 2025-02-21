const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
    medicalLicenseNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    specialization: { type: String, required: true },
    aadhar: { type: String, required: true, unique: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    qualification: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', DoctorSchema);
