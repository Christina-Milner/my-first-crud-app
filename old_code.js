

app.post('/postEntry', (request, response) => {
    async function getID() {
        let entries = await db.collection('modelShowRegTest').find().toArray()
        return entries.length
    }
    async function getLastID() {
        let entries = await db.collection('modelShowRegTest').find().toArray()
        let length = await entries.length
        let entry = await entries[length - 1]
        return entry.id
    }
    let currentID = getID().then(res => res + 1)
    .then(res => db.collection('modelShowRegTest').insertOne({
        id: currentID,
        fullName: "",
        numOfModels: 0,
        inCompetition: false,
        prizes: {}}))
    .then(result => {
        let lastID = getLastID()})
    .then(result => {
        console.log('Entry Added')
        response.send(String(result))
    })
    .catch(error => console.error(error))
})