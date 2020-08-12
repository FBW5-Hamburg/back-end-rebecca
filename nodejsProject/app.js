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

//get register
app.get('/register',(req,res) => {
    res.render('register')
})

app.post('/register', (req, res) => {
    const name = req.body.name.trim()
    const email = req.body.email.trim()
    const username = req.body.username.trim()
    const password = req.body.password
    if (name && email && username && password){
        datamongoose.registeration(name, email,username, password).then(() => {
            res.json(1)
        }).catch(error => {
            if(error === "exist") {
                res.json(3)
            } else{
                res.json(4)
            }
        })
    } else {
        res.json(2)
    }
    
    
    
})

app.listen(4000,() => {
    console.log('App listeing on port 4000!');

})