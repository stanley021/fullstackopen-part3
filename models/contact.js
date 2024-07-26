const mongoose = require('mongoose')
require('dotenv').config()

// if (process.argv.length<3) {
//   console.log('give password as argument')
//   process.exit(1)
// }
const url = process.env.MONGODB_URL

// const password = process.argv[2]

// const name = process.argv[3]
// const number = process.argv[4]


mongoose.set('strictQuery',false)
mongoose.connect(url)
  .then(
    console.log('Connected to database(Contact)')
  )
  .catch(error => {
    console.log('Issue with connecting to database', error.message)
  })

const phoneNumberValidator = (value) => {
  // Regular expression to match phone number format
  const phoneNumberPattern = /^[0-9]{2,3}-[0-9]+$/

  return phoneNumberPattern.test(value) && value.length >= 8
}

const contactSchema = new mongoose.Schema({
  name:{
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: phoneNumberValidator,
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'Phone number required']
  },

})

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// const Contact = mongoose.model('Contact', contactSchema)

// const contact = new Contact({
//     name: name ,
//     number: number,
//   })

// if (process.argv.length === 3){
//     Contact.find({}).then(result =>{
//         result.forEach(person =>{
//             console.log(person)

//         })
//         mongoose.connection.close()
//     })

// }

// else if(process.argv.length > 3){
//   contact.save().then(result => {
//     console.log(`added ${name} number ${number} to phonebook`)
//     mongoose.connection.close()
//   })
// }



module.exports = mongoose.model('Contact', contactSchema)