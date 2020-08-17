const mongoose = require('mongoose')
const passwordHash = require('password-hash')


const connectionString = 'mongodb+srv://project:qwer123@cluster0.lh6tv.mongodb.net/nodejs?retryWrites=true&w=majority'

// get schema object
const Schema = mongoose.Schema
//const {Schema} = mongoose

const itemsSchema = new Schema({
    itemname: {
        type: String,
        unique: true,
        required: true
    },
    itemprice: {
        type: Number,
        required: true
    }
    ,
    itemimage: {
        type: Number,
        required: true
    }
})

const Items = mongoose.model('items', itemsSchema)
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



function addItem(itemname, itemprice, itemimage){
    return new Promise((resolve, reject) =>{
        connect().then(() => {
            Items.findOne({itemname: itemname}).then(findItem => {
                
                if(findItem){
                 
                 reject(3)
                    
                } else {

                    //create images array to be saved in database
                    const imgsArr = []
                    itemimage.forEach((img, idx)=> {
                        // get file extension
                        let ext = img.name.substr(img.name.lastIndexOf('.'))
                        //set the new image name
                        let newName = bookTitle.trim().replace(/ /g,'_')+ '_' + userid + '_' + idx + ext
                        img.mv('./public/uploadedfiles/' + newName)
                        imgsArr.push('/uploadedfiles/' + newName)
                    })

                    const newItem = new Items({
                        itemname: itemname,
                        itemprice: itemprice,
                        itemimage: imgsArr
                    })
                    newItem.save().then(() => {
                        resolve()
                    }).catch(error => {
                        reject(error)
                    })
                }
            }).catch(error => {
                reject(error)
            })
        }).catch(error => {
            reject(error)
        })
        
    })
    
       
}

module.exports = {
    addItem
}