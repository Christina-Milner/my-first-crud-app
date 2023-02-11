/* To do:
- Add CSS to make it look not horrible
- Add default listing of all elements on page
- Add "edit entry" button
    - Clicking an entry should then open the form for editing it and allow doing so
    - In editing view, there also needs to be the option to add prizes (which are not a thing on entry creation)
- Add functionality to filter by prizes
- Change add entry functionality so multiple people can't create an entry with the same id at the same time
*/


const addButton = document.querySelector('#addButton')
const editButton = document.querySelector('#editEntries')

addButton.addEventListener('click', openAddForm)
editButton.addEventListener('click', editEntries)

async function openAddForm() {
    document.querySelectorAll('.entry').removeEventListener('click', showEditButton)
    const res = await fetch('/postEntry', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    })
    let id = await res.text()
    id = Number(id)

    document.querySelector('#forID').innerText = `Number: ${id}`
    document.querySelector('#inputForm').classList.remove('hidden')
    document.querySelector('#secretIdBox').value = id
}

function editEntries() {
    document.querySelectorAll('.entry').forEach(e => e.addEventListener('click', event => {
        let target = event.target.classList.contains('entry') ? event.target : event.target.parentElement.classList.contains('entry') ? event.target.parentElement : event.target.parentElement.parentElement
        let targetButton = target.children[target.children.length - 1]
        targetButton.classList.remove('hidden')
        document.querySelectorAll('.editThis').forEach(e => {
            if (e.parentElement !== target) {
                e.classList.add('hidden')
            }
        })
        targetButton.addEventListener('click', event => editThis(event.target.parentElement))
    }))
}

async function editThis(element) {
    const entryID = element.id
    const data = await fetch(`ID_${entryID}`, {
        method: 'get',
        headers: {'Content-Type': 'application/json'},
    })
    let json = await data.json()
    document.querySelector('#inputForm').classList.remove('hidden')
    document.querySelectorAll('.entry').forEach(e => e.classList.add('hidden'))
    document.querySelector('#prizes').classList.remove('hidden')
    document.querySelector('#forID').innerText = `Number: ${json.id}`
    document.querySelector('#name').value = json.fullName
    document.querySelector('#numOfModels').value = json.numOfModels
    if (json.inCompetition) {
        document.querySelector('#yesInComp').checked = true
        document.querySelector('#notInComp').checked = false
    } else {
        document.querySelector('#yesInComp').checked = false
        document.querySelector('#notInComp').checked = true
    }
    /*Hook up prize fields
    Find out why this broke "Add Entry" and fix */
}