const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
})
//control login of the user
userSchema.statics.login = async function(username, password){
    const user = await this.findOne({username}) // search for user

    if(user){
        const auth = await bcrypt.compare(password, user.password)
        //The bcrypt.compare() method takes two arguments: the first argument is the plain text password entered by the user, and the second argument is the hashed password stored in the user object.
        // The method returns a Promise that resolves to true if the plain text password matches the hashed password, and false if they don't match.
        if(auth){
            return user
        }else {
            throw Error('parola hatali')
        }
    }else {
        throw Error('kullanici yok')
    }
}

//hashing passw
userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

const User = new mongoose.model('user', userSchema)
//In Mongoose, a model is a class that represents a collection of documents in the underlying MongoDB database. You can use the model to create, read, update, and delete (CRUD) documents in the collection.
//  The model also provides an interface for defining the structure of the documents in the collection, using a Mongoose schema.


module.exports = User