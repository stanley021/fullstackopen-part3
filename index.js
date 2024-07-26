const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const Contact = require('./models/contact') // Import the Contact model

const app = express()

app.use(morgan('tiny'))
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

app.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log('POST request data:', JSON.stringify(req.body, null, 2))
  }
  next()
})

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  Contact.find({})
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      console.error('Error fetching contacts:', err)
      res.status(500).json({ error: 'failed to fetch contacts' })
    })
})

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body

  if (req.body === undefined) {
    return res.status(400).json({ error: 'content missing' })
  }
  if (!name || !number) {
    return res.status(400).json({ error: 'name or number is missing' })
  }

  const newContact = new Contact({ name, number })
  newContact.save()
    .then(savedContact => res.json(savedContact))
    .catch(err => {
      console.error('Error saving contact:', err)
      res.status(500).json({ error: 'failed to save contact' })
    })

})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body


  if (!name || !number) {
    return res.status(400).json({ error: 'name or number is missing' })
  }

  Contact.findByIdAndUpdate(req.params.id, { name, number }, { new: true })
    .then(updatedContact => {
      if (updatedContact) {
        res.json(updatedContact)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
})


app.get('/api/persons/:id', (req, res, next) => {
  Contact.findById(req.params.id)
    .then(contact => {
      if (contact) {
        res.json(contact)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Contact.findByIdAndDelete(req.params.id)
    .then(result => {
      if (result) {
        res.status(204).end()
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
})

app.get('/info', (req, res) => {
  Contact.countDocuments({})
    .then(count => {
      const now = new Date()
      res.send(`<p>Phonebook has info for ${count} people</p><br/>${now.toDateString()} ${now.toTimeString()}`)
    })
    .catch(err => {
      console.error('Error fetching info:', err)
      res.status(500).json({ error: 'failed to fetch info' })
    })
})

const PORT = process.env.PORT || 3001
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB(index)')
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch(err => {
    console.error('error connecting to MongoDB:', err.message)
  })

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

