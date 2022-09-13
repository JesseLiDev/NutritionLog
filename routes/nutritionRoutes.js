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

router.get('/:slug', async (req, res) => {
  const nutritionData = await nutritionLog.findOne({ slug: req.params.slug })
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
    nutritionData.title = req.body.title
    nutritionData.description = req.body.description
    nutritionData.markdown = req.body.markdown
    try {
      nutritionData = await nutritionData.save()
      res.redirect(`/pages/${nutritionData.slug}`)
    } catch (e) { 
      res.render(`pages/${path}`, { nutritionData: nutritionData })
    }
  }
}

module.exports = router