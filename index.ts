// Use following command to compile typeScript       tsc index.ts #tsc : typescript compiler

//7:16:18

// Select Items
const toDoAlert = <HTMLInputElement>document.querySelector('.alert');
const toDoForm = <HTMLInputElement>document.querySelector('.to-do-list-form');
const toDoItem = <HTMLInputElement>document.getElementById('to-do');
const submitBtn = <HTMLInputElement>document.querySelector('.submit-btn')
const container = <HTMLInputElement>document.querySelector('.to-do-container')
const list = <HTMLInputElement>document.querySelector('.to-do-list')
const clearBtn = <HTMLInputElement>document.querySelector('.clear-btn')

// Edit Items
let editElement;
let editFlag = false;
let editId = '';

// Event Listeners
//submit form listener
toDoForm.addEventListener('submit', addItem)
//clearing items
clearBtn.addEventListener('click', clearItems)
//loading items on page load
window.addEventListener('DOMContentLoaded', setupItems)

// Functions

//adding items to the list
function addItem(e) {
    e.preventDefault();
    let value: string = toDoItem.value
    let id = new Date().getTime().toString();
    console.log(id);
    console.log(value);
    
    if (value && !editFlag) {
        console.log(document.querySelector('show-container'))
        if(document.querySelector('show-container') === null ){
            container.classList.add("show-container");
        }
        createListItem(id,value);
        //configure alert from const displayAlert
        displayAlert('item was added', 'success');
        //adding info to local storage
        addToLocalStorage(id, value);
        //setting back to the default input
        setBackToDefault();
    }
    else if (value && editFlag) {
        editElement.innerHTML = value;
        displayAlert('Value Changed', "success")
        //editing local storage
        editLocalStorage(editId, value);
        console.log("edit")
        setBackToDefault();
    }
    else {
        displayAlert("No Value Added", 'danger')
    }
}

//displaying the alert
const displayAlert = (text:string, action:string) =>{
    toDoAlert.textContent = text;
    toDoAlert.classList.add(`alert-${action}`)
    //removing the alert
    setTimeout(function(){
    toDoAlert.textContent = '';
    toDoAlert.classList.remove(`alert-${action}`)
    }, 1000)
}

//clearing items
function clearItems() {
    const items = document.querySelectorAll('.to-do-item');
    if(items.length > 0){
        items.forEach((item) => list.removeChild(item))
    }
    container.classList.remove("show-container");
    displayAlert("List Emptied", "success");
    setBackToDefault();
    localStorage.removeItem('list')
}

//deleting individual items
function deleteItem(e){
    //configures to remove not the icon, not the button, not the button container, but the over all article
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if(list.children.length === 0){
        container.classList.remove("show-container")
    }
    displayAlert("Item deleted", 'success');
    setBackToDefault();
    //remove from local storage
    //removeFromLocalStorage(id)
}
//editing individual items
function editItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    //setting the edit items
    editElement = e.currentTarget.parentElement.previousElementSibling;
    toDoItem.value = editElement.innerHTML;
    editFlag = true;
//configures the editID to the data-id of the item in question
let editId = element.dataset.id;
    submitBtn.textContent = "edit";
}

//set input back to default
const setBackToDefault = () =>{
    toDoItem.value = '';
    editFlag = false;
    editId = "";
    submitBtn.textContent = "submit";
    console.log("default")
}


// local storage
function addToLocalStorage(id, value){
    //creates an object with the key of the varialble, and the value of the variable
    const toDoList = {id, value};
    //if the list already exists, then use that list, otherwise use an empty array
    let items = getLocalStorage();
    console.log(items);
    items.push(toDoList);
    localStorage.setItem('list', JSON.stringify(items));
    console.log(toDoList);
}

function removeFromLocalStorage(id){
    let items = getLocalStorage();
    items = items.filter((e) => {
        if(e.id !== id){
            return e;
        }
    })
    localStorage.setItem('list', JSON.stringify(items));
    console.log("local storage")
}

function editLocalStorage(id, value){
    let items = getLocalStorage();
    items = items.map(function (item) {
        if(item.id === id){
            item.value = value;
        }
        return item;
    })
    console.log(items)
    localStorage.setItem('list', JSON.stringify(items));

}

function getLocalStorage(){
    return (localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')): []);
}
//local stroage API


//setup items

function setupItems(){
    let items = getLocalStorage();
    if(items.length > 0){
        items.forEach(function(item){
            createListItem(item.id,item.value)
        })
        container.classList.add('show-container')
    }
}

function createListItem(id,value){
//create the article
        
const element = document.createElement('article');
element.classList.add('to-do-item');
const attr = document.createAttribute('data-id');
attr.value = id;
element.setAttributeNode(attr);
element.innerHTML = `<p class="title">${value}</p>
<div class="btn-container">
    <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
    </button>
    <button type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
    </button>
</div>`
//event listener for edit and delete icons
const deleteBtn =element.querySelector('.delete-btn');
const editBtn = element.querySelector('.edit-btn');
deleteBtn.addEventListener('click', deleteItem);
editBtn.addEventListener('click', editItem);
//adding the article to the list
list.appendChild(element);
}