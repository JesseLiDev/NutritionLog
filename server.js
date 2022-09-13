const express = require('express')
const mongoose = require('mongoose')
const app = express() 
const methodOverride = require('method-override')
const nutritionLog = require('./models/nutritionLog')
const nutritionRouter = require('./routes/nutritionRoutes')


mongoose.connect('mongodb+srv://jesselicloud:test1234@cluster0.nrywhhn.mongodb.net/test')
    .then(() => {
        console.log('Database Is connected')
    })
    .catch((error) => {
        console.log(error)
    })

//Set view to use Embedded Javascript Templating, an engine used by node.js to make HTML template with minimal code.
//The view engine converts ejs to html code. The views we create are now ending in EJS, and we can call that html file
//Using app.get render => the name of the view
app.set('view engine', 'ejs')

//We are importing the new routes into this server.js file. We can then link up those routers to this page using the
//following app.use function. We set the new url path, then call the nutritionRouter file  
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: false }))
app.use( express.static( "static" ) )

app.get('/', async (req, res) => { 
    const nutritionData = await nutritionLog.find().sort({ createdAt: 'desc' })
    res.render('pages/index', { nutritionData: nutritionData })
})


app.use('/pages', nutritionRouter)
app.listen(5000) 