const express = require('express')
const app = express()
const morgan = require('morgan')
app.use(morgan('tiny'));
app.use(express.json())
const cors = require('cors')

app.use(cors())

app.use((req, res, next) => {
  if (req.method === 'POST') {
      console.log('POST request data:', JSON.stringify(req.body, null, 2));
  }
  next();
});




let notes = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
app.get('/api/persons', (request, response) => {
    response.json(notes)
})

app.post('/api/persons', (request, response) => {
    const note = request.body
    if (!note.name || !note.number) {
        return response.status(400).json({
          error: 'name or number is missing'
        });
      }
    
      // Check if name already exists
    if (notes.find(n => n.name === note.name)) {
    return response.status(400).json({
        error: 'name must be unique'
    });
    }

    const maxid = notes.length > 0 ? Math.floor(Math.random()*1000) : 0;

    const newperson = {
        id : (maxid).toString(),
        name: note.name,
        number : note.number
    }
  

    notes = notes.concat(newperson)
    response.json(newperson)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const user = notes.find(person => person.id === id)

    if (user){
        response.json(user)
    }
        
    else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter(person => person.id !== id)

    response.status(204).end()
})

app.get('/info',(request, response) =>{
    const now = new Date()

    response.send(`<p>Phonebook has info for ${notes.length} people </p> <br/> ${now.toDateString()} ${now.toTimeString()} `)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})