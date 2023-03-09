/* To do:
Done or done-ish:
- Add default listing of all elements on page (done)
- Add "edit entry" button (done)
- Change add entry functionality so multiple people can't create an entry with the same id at the same time (done)
- Add CSS for judging page to colour differentiate not in competition / judged/ not judged (done)
- Add functionality to check for entries with empty name so that IDs don't get incremented if someone clicks "add entry" and then goes to do something else (done)
- Only prizes available for not in comp are People's Choice and Sponsor prizes (done)
- Now split up across 3 pages - all entries should always be clickable on judging page, with prizes available (done)
- Fix Not In Competition - judging form currently reverts judged back to false. Ideally don't have a judged flag at all, or at least need a value other than "false". (done)
- Add functionality to filter by prizes (done, with human-readable output)

To do:
- Add CSS to make it look not horrible
- Get rid of "edit this entry" button and make reg entries editable like in judging view if "edit entry" is clicked
- Add values validation (no negative number of models etc.)
- Ensure Junior and Adult categories are either/or and don't both show up in judging and it's clearly visible whether it's a junior
- Add visual indicator what category is currently being looked at on filter results
- Add "no medal" option - presumably not everyone gets a medal
- Add People's Choice to filter page
- BIG ISSUE: Editing entry on the Registration page removes the name and # of models. FIX THIS.
*/
const addButton = document.querySelector('#addButton')
const editButton = document.querySelector('#editEntries')

if (addButton) {addButton.addEventListener('click', openAddForm)}
if (editButton) {editButton.addEventListener('click', editEntries)}


// Function that retrieves the next ID number when "add entry" is clicked and populates the form with it

async function openAddForm() {
    document.querySelectorAll('.entry').forEach(e => e.removeEventListener('click', event => editThis(event.target.parentElement)))
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

// Function for making entries editable in Registration view - FIX ME (skip edit button stage)

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

function allEntriesEditable() {
    document.querySelectorAll('.entry').forEach(e => e.addEventListener('click', event => {
        let target = event.target.classList.contains('entry') ? event.target : event.target.parentElement.classList.contains('entry') ? event.target.parentElement : event.target.parentElement.parentElement
        editThis(target)
    }))
}

// Function for editing an entry on the Registration page - FIX ME (name and # of models currently disappear)

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
    document.querySelector('#secretIdBox').value = json.id
    document.querySelector('#name').value = json.fullName
    document.querySelector('#numOfModels').value = json.numOfModels
    if (json.inCompetition) {
        document.querySelector('#yesInComp').checked = true
        document.querySelector('#notInComp').checked = false
    } else {
        document.querySelector('#yesInComp').checked = false
        document.querySelector('#notInComp').checked = true
    }
}
