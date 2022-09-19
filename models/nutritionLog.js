const mongoose = require('mongoose') 

const nutritionSchema = new mongoose.Schema({ 
  notes: {
    type: String
  },
  calories: {
    type: Number,
    required: true
  },
  protein: {
    type: Number,
    required: true
  },
  carbohydrates: {
    type: Number,
    required: true
  },
  fats: {
    type: Number,
    required: true
  },
  date: {
    type: Date, 
    required: true
  } 
}) 

module.exports = mongoose.model('nutritionLog', nutritionSchema)