'use strict'

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_task')) ?? []

const setLocalStorage = (dbTask) => localStorage.setItem('db_task', JSON.stringify(dbTask))


//CRUD - Create Read Update Delete

//create
const createTask = (task) => {
    const dbTask = getLocalStorage()
    dbTask.push(task)
    setLocalStorage(dbTask)
}

//read
const readTask = () => getLocalStorage()

//update
const updateTask = (index, task) => {
    const dbTask = readTask()
    dbTask[index] = task
    setLocalStorage(dbTask)
}

//delete
const deleteTask = (index) => {
    const dbTask = readTask()
    dbTask.splice(index, 1)
    setLocalStorage(dbTask)
}


//Layout Interaction
const saveTask = () => {
    if (ValidField()) {
        const task = {
            task: document.getElementById('textDesc').value
        }
        const index = document.getElementById('textDesc').dataset.index
        if (index == 'new') {
            createTask(task)
            updatePage()
            document.getElementById('textDesc').value = ''
        } else {
            updateTask(index, task)
            updatePage()
            document.getElementById('textDesc').value = ''
        }
    } 
}

const fillField = (task) => {
    document.getElementById('textDesc').value = task.task
    document.getElementById('textDesc').dataset.index = task.index
}

const editTask = (index) => {
    const task = readTask()[index]
    task.index = index
    fillField(task)
}

const editDelete = (event) => {
    if (event.target.type == 'button') {
        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editTask(index)
        } else {
            const task = readTask()[index]
            const response = confirm (`Deseja excluir a task: ${task.task}?`)
            if (response) {
                deleteTask(index)
                updatePage()
            }
        }
    }
}


//LayoutOff Interaction
const ValidField = () => {
    return document.getElementById('textDesc').reportValidity()
}

const createRow = (t, index) => {
    const newRow = document.createElement('li')
    newRow.innerHTML = `
        <h3>${t.task}</h3>
        <div>
            <button type="button" class="btnList" data-action="edit" id="edit-${index}">Editar</button>

            <button type="button" class="btnList" data-action="delete" id="delete-${index}">Deletar</button>
        <div>
    `
    document.querySelector('#result>ul').appendChild(newRow)
}

const clearList = () => {
    const rows = document.querySelectorAll('#result>ul li')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updatePage = () => {
    const dbTask = readTask()
    clearList()
    dbTask.forEach(createRow)
}

updatePage()

//Events
document.getElementById('btnAdd').addEventListener('click', saveTask)
document.querySelector('#result>ul').addEventListener('click', editDelete)
