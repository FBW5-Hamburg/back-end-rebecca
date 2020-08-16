const mongoose = require('mongoose')
const passwordHash = require('password-hash')


const connectionString = 'mongodb+srv://project:qwer123@cluster0.lh6tv.mongodb.net/nodejs?retryWrites=true&w=majority'
const usersSchema = new usersSchema({})

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
module.exports = {
    registration
}