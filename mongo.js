const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const name = process.argv[3]
const number = process.argv[4]


const url = process.env.MONGODB_URL

mongoose.set('strictQuery',false)

mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

const contact = new Contact({
    name: name ,
    number: number,
  })

if (process.argv.length === 3){

    Contact.find({}).then(result =>{
        result.forEach(person =>{
            console.log(person)

        })
        mongoose.connection.close()
    })
    
}

else if(process.argv.length > 3){
  contact.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}


