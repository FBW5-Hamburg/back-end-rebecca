const express = require('express')
const path = require('path')


const app = express()

//
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//peblic folder url
app.use(express.static(path.join(__dirname,'public')))

//set view engine
app.set('view engine','ejs')
app.set('views','views')


// get main
app.get('/main', (req, res) => {
    res.render('main')
})
// get about
app.get('/about',(req, res) => {
    res.render('about')
})

app.listen(4500,() => {
    console.log('App listening on port 4500!')
})