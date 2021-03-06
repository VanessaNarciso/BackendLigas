const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

var secret = process.env.SECRET || require('../config.js').secret

const userSchema = new mongoose.Schema({
  nombre:{
    type: String, 
    required: true
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if(!validator.isEmail(value)) {
        throw new Error('Email invalido')
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    trim: true
  },
  numeroTelefono: {
    type: String
  },
  tipo:{
    type: Number,
    enum: [0, 1, 2],
    required: true
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  partOf:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Empresa'
  }
},{
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true 
  }
})

//Relacion con ligas cortas 
userSchema.virtual('ligascortas',{
  ref: 'liga',
  localField: '_id', 
  foreignField: 'createdBy'
})

//Relacion con landings 
userSchema.virtual('landings',{
  ref: 'landing',
  localField: '_id', 
  foreignField: 'createdBy'
})

userSchema.methods.toJSON = function() {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens

  return userObject
}


//Encontrar usuario por credenciales 

userSchema.statics.findByCredentials = function(correo, password) {
  return new Promise( function(resolve, reject) {
    User.findOne({ correo }).then(function(user) {
      if( !user ) {
        return reject('User does not exist')
      }
      bcrypt.compare(password, user.password).then(function(match) {
        if(match) {
          return resolve(user)
        } else {
          return reject('Wrong password!')
        }
      }).catch( function(error) {
        return reject('Wrong password!')
      })
    })
  })
}

//Generar tokens de autorizacion 
userSchema.methods.generateToken = function() {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, secret, { expiresIn: '7 days'})
  user.tokens = user.tokens.concat({ token })
  return new Promise(function( resolve, reject) {
    user.save().then(function(user){
      return resolve(token)
    }).catch(function(error) {
      return reject(error)
    })
  })
}

//Encriptar password 
userSchema.pre('save', function(next) {
  const user = this
  if( user.isModified('password') ) {
    bcrypt.hash(user.password, 8).then(function(hash){
      user.password = hash
      next()
    }).catch(function(error){
      return next(error)
    })
  } else {
    next()  
  }
})

userSchema.statics.getUsersCompany = function(idComp) {
  return new Promise( function(resolve, reject) {
    User.find({partOf:idComp}).then(function(users) {            
      return resolve(users)
    }).catch( function(error) {
      return reject('Error!')
    })
  })
}

const User = mongoose.model('User', userSchema)

module.exports = User