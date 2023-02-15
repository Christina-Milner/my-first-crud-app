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

app.get('/registration',(request, response)=>{
    db.collection('modelShowRegTest').find().toArray()
    .then(data => {
        response.render('registration.ejs', { info: data })
    })
    .catch(error => console.error(error))
})

app.get('/judging',(request, response)=>{
    db.collection('modelShowRegTest').find().toArray()
    .then(data => {
        response.render('judging.ejs', { info: data })
    })
    .catch(error => console.error(error))
}) 

app.get('/filters',(request, response)=>{
    db.collection('modelShowRegTest').find().toArray()
    .then(data => {
        response.render('filters.ejs', { info: data })
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

app.get('/ID_:id', (req, res) => {
    db.collection('modelShowRegTest').findOne({id: Number(req.params.id)})
    .then(data => res.json(data))
})


app.post('/addEntryReg', (request, response) => {
    console.log(request.body)
    db.collection('modelShowRegTest').updateOne({
        id: Number(request.body.entryId)},{
            $set:{
                fullName: request.body.name,
                numOfModels: Number(request.body.numOfModels),
                inCompetition: request.body.inComp == "yesInComp",
                junior: request.body.junior == "yesJunior",
                judged: request.body.inComp == "yesInComp" ? request.body.judged == "yesJudged" : "N/A"
                }
            })
    .then(result => {
        console.log('Entry Added')
        response.redirect('/registration')
    })
    .catch(error => console.error(error))
})

app.post('/addEntryJudge', (request, response) => {
    console.log(request.body)
    db.collection('modelShowRegTest').updateOne({
        id: Number(request.body.entryId)},{
            $set:{
                judged: request.body.judged == "N/A" || request.body.judged == "yesJudged",
                prizes: {
                    medal: request.body.medals,
                    bestofShow: request.body.bestOfShow == "on",
                    junBestOfShow: request.body.junBestOfShow == "on",
                    corrr: request.body.corrr == "on",
                    peoplesChoice: request.body.peoplesChoice == "on",
                    sponsors: request.body.sponsors.split(',')
                }
                }
            })
    .then(result => {
        console.log('Entry added')
        response.redirect('/judging')
    })
    .catch(error => console.error(error))
})

 
app.post('/postEntry', async (request, response) => {
    async function getID() {
        let entries = await db.collection('modelShowRegTest').find().toArray()
        return entries.length
    }
    async function getLastID() {
        let entries = await db.collection('modelShowRegTest').find().toArray()
        let length = entries.length
        let entry = entries[length - 1]

        return entry.id
    }
    let currentID = await getID().then(res => res + 1)
    .then(async res => {
        await db.collection('modelShowRegTest').insertOne({
            id: res,
            fullName: "",
            numOfModels: 0,
            inCompetition: false,
            prizes: {}})
        return res
    })
    .then(async result => {
        let lastID = await getLastID()
        return lastID
    })
    .then(result => {
        console.log('Entry Added')
        response.send(String(result))
    })
    .catch(error => console.error(error))
})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})