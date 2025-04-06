const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Stock = require('./Stock'); 


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  maxStockPrice: {
    type: Number,
    default: 0
  },
  interests: {
    type: [String],
    default: []
  },
  favorites: {
    type: [String],
    default: []
  },
  recommendations: [{
    name: String,
    symbol: String,
    price: Number,
    recommendationScore: Number,
    industry: String,
    sector: String,
    matchedInterests: [String],
    image: String
}],
  riskTolerance: {
    type: Number,
    default: 0.5,
    min: 0,
    max: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema); 