const express = require('express')
const nutritionLog = require('../models/nutritionLog')
const router = express.Router()
 
router.get('/macroCalc',  (req, res) => {
  res.render('pages/macroCalc')
})

router.get('/new', (req, res) => {
  res.render('pages/new', { nutritionData: new nutritionLog() })
})

router.get('/edit/:id', async (req, res) => {
  const nutritionData = await nutritionLog.findById(req.params.id) 
  res.render('pages/edit', { nutritionData: nutritionData })
})

router.get('/:id', async (req, res) => {
  const nutritionData = await nutritionLog.findById(req.params.id) 
  if (nutritionData == null) res.redirect('/')
  res.render('pages/show', { nutritionData: nutritionData })
})

router.post('/', async (req, res, next) => {
  req.nutritionData = new nutritionLog()
  next()
}, saveNutritionDataAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
  req.nutritionData = await nutritionLog.findById(req.params.id)
  next()
}, saveNutritionDataAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
  await nutritionLog.findByIdAndDelete(req.params.id)
  res.redirect('/')
})

function saveNutritionDataAndRedirect(path) {
  return async (req, res) => {
    let nutritionData = req.nutritionData  
    nutritionData.calories = req.body.calories
    nutritionData.protein = req.body.protein
    nutritionData.carbohydrates = req.body.carbohydrates
    nutritionData.fats = req.body.fats
    nutritionData.date = req.body.date
    nutritionData.notes = req.body.notes
    console.log('body'  , req.body)
    try {
      nutritionData = await nutritionData.save()
      res.render('pages/show', { nutritionData: nutritionData })
    } catch (e) { 
      res.render(`pages/${path}`, { nutritionData: nutritionData })
      console.log('Data was NOT Saved')
    }
  }
}

module.exports = router