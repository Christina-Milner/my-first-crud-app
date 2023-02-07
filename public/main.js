const addButton = document.querySelector('#addButton')

addButton.addEventListener('click', openAddForm)

async function openAddForm() {
    const res = await fetch('/numOfEntries')
    let id = await res.text()
    id = Number(id)

    document.querySelector('#forID').innerText = `Number: ${id}`
    document.querySelector('#inputForm').classList.toggle('hidden')
    document.querySelector('#secretIdBox').value = id
}