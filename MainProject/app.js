const express = require('express')
const path = require('path')
const session = require('express-session')
const fileupload = require('express-fileupload')

//include dataModule
const dataModule = require('./modules/dbmongoose')
const { toUnicode } = require('punycode')

const app = express()

// public folder url
app.use(express.static(path.join(__dirname,'public')))

//set view engine
app.set('view engine','ejs')
app.set('views','views')
app.use(express.urlencoded({extended: false}))
app.use(express.json())
const sessionOptions = {
    secret: 'vegefoods',
    resave: false,
    saveUninitialized: false, 
}
app.use(session(sessionOptions))

app.use(fileupload({
    limits: { fileSize: 50 * 1024 * 1024}
}))


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
    dataModule.getAllItems().then(blaitems => {
   
        res.render('home', {items: blaitems})
    })
})

// get contact
app.get('/contact',(req, res) => {
    res.render('contact')
})

// get contact
app.get('/admin',(req, res) => {
    if(req.session.user) {
        res.render('admin')

    }else{
        res.redirect('admin-login')
    }
  
})

// get admin login
app.get('/admin-login',(req, res) => {
    res.render('adminlogin')
})

// post admin login
app.post('/admin-login',(req, res) => {

    //TODO remove and uncomment
    req.session.user= {email:req.body.useremail , password:req.body.userpassword }
    res.json(1);

    /*if(req.body.useremail =="rebecca@gmail.com" && req.body.userpassword =="123456"){
        req.session.user= {email:req.body.useremail , password:req.body.userpassword }
        res.json(1);
    }else{

        req.session.user= null;
        res.json(1);
    }*/

})

// post add item
app.post('/add-item',(req, res) => {
   
 /*  if(!req.session.user){
    res.json(3);
   }else  */
    if (req.files &&req.body.itemname && req.body.itemprice){

    const itemname = req.body.itemname
    const itemprice = req.body.itemprice
 

        const imgs = []
        for (const key in req.files){
                imgs.push(req.files[key])
        }
        dataModule.addItem(itemname, itemprice,  imgs).then(() => {
            res.json(1)
        }).catch(error => {
            console.log(error)
                res.json(2)
            
        })
    
}else{
    res.json(4)
}

})


app.post('/delete-item',(req, res) => {

    if (req.body.itemname ){
        dataModule.deleteItem(req.body.itemname).then(() => {
            res.json(1)
        }).catch(error => {
            console.log(error)
                res.json(2)
            
        })
    }else{
        res.json(3)
    }
})

// post edit item
app.post('/edit-item',(req, res) => {
   
    /*  if(!req.session.user){
       res.json(3);
      }else  */
       if (req.files|| req.body.itemname || req.body.itemprice){
   
       const itemname = req.body.itemname
       const itemprice = req.body.itemprice
    
   
           const imgs = []
           for (const key in req.files){
                   imgs.push(req.files[key])
           }
           dataModule.editItem(itemname, itemprice,  imgs).then(() => {
               res.json(1)
           }).catch(error => {
               console.log(error)
                   res.json(2)
               
           })
       
   }else{
       res.json(4)
   }
   
   })


app.listen(4500,() => {
    console.log('App listening on port 4500!')
})