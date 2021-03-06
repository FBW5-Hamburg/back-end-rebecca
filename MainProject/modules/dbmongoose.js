const mongoose = require('mongoose')
const passwordHash = require('password-hash')
const fs = require('fs')


const connectionString = 'mongodb+srv://projects:test1234@cluster0.lh6tv.mongodb.net/nodejs?retryWrites=true&w=majority'
//const connectionString = 'mongodb+srv://reb:123456ab@cluster0.lh6tv.mongodb.net/test1?retryWrites=true&w=majority'

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
        type: String,
        required: true
    }
})

const Items = mongoose.model('items', itemsSchema)
function connect(){
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


//adding item
function addItem(itemname, itemprice, itemimage){
    return new Promise((resolve, reject) =>{
        connect().then(() => {
            Items.findOne({itemname: itemname}).then(findItem => {
                
                if(findItem){
                 
                 reject(3)
                    
                } else {

                    //create images array to be saved in database
                    let serverImageName = '';
                    const imgsArr = []
                    itemimage.forEach((img, idx)=> {
                        // get file extension
                        let ext = img.name.substr(img.name.lastIndexOf('.'))
                        //setting the new image name
                        let newName = itemname + ext
                        serverImageName=newName
                 
                        img.mv('./public/uploadedfiles/' + newName)
                        imgsArr.push('/uploadedfiles/' + newName)
                    })

                    const newItem = new Items({
                        itemname: itemname,
                        itemprice: itemprice,
                        itemimage: serverImageName
                    })
                    newItem.save().then(() => {
                        resolve()
                    }).catch(error => {
                        console.log(error)
                        reject(error)
                    })
                }
            }).catch(error => {
                console.log(error)
                reject(error)
            })
        }).catch(error => {
            console.log(error)
            reject(error)
        })
        
    })
    
       
}
// getting all item
function getAllItems(){
    return new Promise((resolve, reject) => {
        connect().then(() => {
            
            Items.find().then(items => {
                resolve(items)
            }).catch(error => {
                reject(error)
            })
        }).catch(error => {
            reject(error)
        })
    })

}
// deleting item
function deleteItem(itemname){
    return new Promise ((resolve, reject) => {

        connect().then(()=> {
            
            Items.findOne({itemname:itemname}).then(item => {
                
                
                if(item){
                  
                    if(fs.existsSync('./public/uploadedfiles/'+ item.itemimage)){
 
                        fs.unlinkSync('./public/uploadedfiles/' + item.itemimage)
                    }
        
        
        
                          
                               
                                Items.deleteOne({itemname:item.itemname}).then(() => {
                                    
                                    resolve()
        
                                }).catch(error => {
                                    
                                    reject(error)
                                })
                          
        
                }else{
                    reject(new Error('can not find item' ))
                }
            }).catch(error => {
                reject(error)
            })
        }).catch(error => {
            reject(error)
        })



    })
}
// editing item
function editItem(itemname, itemprice, itemimage){
    return new Promise ((resolve, reject) => {

    


        try{


            (async() => {
        
    
                connect().then(()=> {
            
                    Items.findOne({itemname:itemname}).then(item => {
                        
                        (async() => {
                        if(item){
                          
                            let imagenewname = null;
                
                            if(!!itemimage[0]&&fs.existsSync('./public/uploadedfiles/'+ item.itemimage)){
         
                                fs.unlinkSync('./public/uploadedfiles/' + item.itemimage)
        
                                let ext = itemimage[0].name.substr(itemimage[0].name.lastIndexOf('.'))
                                //setting the new image name
                                imagenewname= itemname + ext
                                itemimage[0].mv('./public/uploadedfiles/' + imagenewname)
                            }
                          
                        await Items.updateOne({itemname: itemname}, {
                        
                            itemprice: !!itemprice?itemprice:item.itemprice,
                            itemimage: !!imagenewname?imagenewname:item.itemimage,
                            $inc: {__v: 1}
                    })
                    
                resolve()
                                  
                
                        }else{
                            reject(new Error('can not find item' ))
                        }
                    })()
                    }).catch(error => {
                        reject(error)
                    })
                }).catch(error => {
                    reject(error)
                })
                
               
    
            })()
        }catch(error) {
            reject(error)
        }


    })
}
//getting all item by name
function getItem(itemname){
    return new Promise((resolve, reject) => {
        connect().then(()=> {
            
            Items.findOne({itemname:itemname}).then(item => {
                
                if(item){
                  
                    resolve(item)
                }else{
                    reject(new Error('can not find item' ))
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
    addItem,
    getAllItems,
    deleteItem,
    getItem,
    editItem
}