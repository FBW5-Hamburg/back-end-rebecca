const mongoose = require('mongoose')
const passwordHash = require('password-hash')


//const connectionString = 'mongodb+srv://project:qwer123@cluster0.lh6tv.mongodb.net/nodejs?retryWrites=true&w=majority'


//creating schema for users
const usersSchema = new Schema({
    name: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,
        unique: true

    },
    username: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        required: true
    }

})
const Users = mongoose.model('users', usersSchema)
function connection(){
    return new Promise((resolve, reject) => {
        if (mongoose.connection.readyState === 1){
            resolve()
        }else {
            mongoose.connect(connectionString, {
                useCreateIndex: true,
                useNewUrlParser: true,
                useUnifiedTopology: true
            }).then(() => {
                resolve()
            }).catch(error => {
                reject(error)
            })
        }
    })
}
function registeration(name, email,username, password){
    return new Promise((resolve, reject) => {
        connection().then(() => {
            //new user
            const new_User = new Users({
                name:name,
                email:email,
                username:username,
                password:passwordHash.generate(password),
                verified: false
            })
            //saving user in database
            new_User.save().then(result => {
                console.log(result)
                resolve()
            }).catch(error => {
                console.log(error)
                console.log(error.code)
                if(error.code === 11000){
                    console.log("Exist")
                    reject('exist')
                } else {
                    reject(error)
                }
            })
        }).catch(error => {
            reject(error)
        })
    })
}
module.exports ={
    registeration
}
