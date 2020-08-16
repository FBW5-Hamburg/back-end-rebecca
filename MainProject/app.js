const express = require('express')
const path = require('path')
const session = require('express-session')

const app = express()

//
app.use(express.urlencoded({extended: false}))
app.use(express.json())
const sessionOptions = {
    secret: 'bookstore',
    resave: false,
    saveUninitialized: false,
    cookie: {} 
}
app.use(session(sessionOptions))

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

// get home
app.get('/home',(req, res) => {
    res.render('home')
})

// get contact
app.get('/contact',(req, res) => {
    res.render('contact')
})

// get contact
app.get('/admin',(req, res) => {
    res.render('admin')
})

// get admin login
app.get('/admin-login',(req, res) => {
    res.render('adminlogin')
})

// post admin login
app.post('/admin-login',(req, res) => {
    console.log(req.body)

    if(req.body.useremail =="rebecca@gmail.com" && req.body.userpassword =="123456"){
       
        req.session.user= {email:req.body.useremail , password:req.body.userpassword }
        res.json(1);
    }else{
        req.session.user= null;
        res.json(2);
    }

})


app.listen(4500,() => {
    console.log('App listening on port 4500!')
})