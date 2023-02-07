const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 8000
require('dotenv').config()

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'modelShowRegTest'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/',(request, response)=>{
    db.collection('modelShowRegTest').find().toArray()
    .then(data => {
        response.render('index.ejs', { info: data })
    })
    .catch(error => console.error(error))
})

app.get('/numOfEntries',(request, response)=>{
    db.collection('modelShowRegTest').find().toArray()
    .then(data => {
        response.send(String(data.length + 1))
    })
    .catch(error => console.error(error))
})


app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})

app.post('/addEntry', (request, response) => {
    db.collection('modelShowRegTest').insertOne({
        id: Number(request.body.entryId),
        fullName: request.body.name,
        numOfModels: Number(request.body.numOfModels),
        inCompetition: request.body.inComp == "yesInComp",
        prizes: {}})
    .then(result => {
        console.log('Entry Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})