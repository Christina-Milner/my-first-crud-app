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

addButton.addEventListener('click', openAddForm)

async function openAddForm() {
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
    document.querySelector('#inputForm').classList.toggle('hidden')
    document.querySelector('#secretIdBox').value = id
}