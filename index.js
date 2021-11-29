// Use following command to compile typeScript       tsc index.ts #tsc : typescript compiler
//7:16:18
// Select Items
var toDoAlert = document.querySelector('.alert');
var toDoForm = document.querySelector('.to-do-list-form');
var toDoItem = document.getElementById('to-do');
var submitBtn = document.querySelector('.submit-btn');
var container = document.querySelector('.to-do-container');
var list = document.querySelector('.to-do-list');
var clearBtn = document.querySelector('.clear-btn');
// Edit Items
var editElement;
var editFlag = false;
var editId = '';
// Event Listeners
//submit form listener
toDoForm.addEventListener('submit', addItem);
//clearing items
clearBtn.addEventListener('click', clearItems);
//loading items on page load
window.addEventListener('DOMContentLoaded', setupItems);
// Functions
//adding items to the list
function addItem(e) {
    e.preventDefault();
    var value = toDoItem.value;
    var id = new Date().getTime().toString();
    console.log(id);
    console.log(value);
    if (value && !editFlag) {
        console.log(document.querySelector('show-container'));
        if (document.querySelector('show-container') === null) {
            container.classList.add("show-container");
        }
        createListItem(id, value);
        //configure alert from const displayAlert
        displayAlert('item was added', 'success');
        //adding info to local storage
        addToLocalStorage(id, value);
        //setting back to the default input
        setBackToDefault();
    }
    else if (value && editFlag) {
        editElement.innerHTML = value;
        displayAlert('Value Changed', "success");
        //editing local storage
        editLocalStorage(editId, value);
        console.log("edit");
        setBackToDefault();
    }
    else {
        displayAlert("No Value Added", 'danger');
    }
}
//displaying the alert
var displayAlert = function (text, action) {
    toDoAlert.textContent = text;
    toDoAlert.classList.add("alert-".concat(action));
    //removing the alert
    setTimeout(function () {
        toDoAlert.textContent = '';
        toDoAlert.classList.remove("alert-".concat(action));
    }, 1000);
};
//clearing items
function clearItems() {
    var items = document.querySelectorAll('.to-do-item');
    if (items.length > 0) {
        items.forEach(function (item) { return list.removeChild(item); });
    }
    container.classList.remove("show-container");
    displayAlert("List Emptied", "success");
    setBackToDefault();
    localStorage.removeItem('list');
}
//deleting individual items
function deleteItem(e) {
    //configures to remove not the icon, not the button, not the button container, but the over all article
    var element = e.currentTarget.parentElement.parentElement;
    var id = element.dataset.id;
    list.removeChild(element);
    if (list.children.length === 0) {
        container.classList.remove("show-container");
    }
    displayAlert("Item deleted", 'success');
    setBackToDefault();
    //remove from local storage
    //removeFromLocalStorage(id)
}
//editing individual items
function editItem(e) {
    var element = e.currentTarget.parentElement.parentElement;
    //setting the edit items
    editElement = e.currentTarget.parentElement.previousElementSibling;
    toDoItem.value = editElement.innerHTML;
    editFlag = true;
    //configures the editID to the data-id of the item in question
    var editId = element.dataset.id;
    submitBtn.textContent = "edit";
}
//set input back to default
var setBackToDefault = function () {
    toDoItem.value = '';
    editFlag = false;
    editId = "";
    submitBtn.textContent = "submit";
    console.log("default");
};
// local storage
function addToLocalStorage(id, value) {
    //creates an object with the key of the varialble, and the value of the variable
    var toDoList = { id: id, value: value };
    //if the list already exists, then use that list, otherwise use an empty array
    var items = getLocalStorage();
    console.log(items);
    items.push(toDoList);
    localStorage.setItem('list', JSON.stringify(items));
    console.log(toDoList);
}
function removeFromLocalStorage(id) {
    var items = getLocalStorage();
    items = items.filter(function (e) {
        if (e.id !== id) {
            return e;
        }
    });
    localStorage.setItem('list', JSON.stringify(items));
    console.log("local storage");
}
function editLocalStorage(id, value) {
    var items = getLocalStorage();
    items = items.map(function (item) {
        if (item.id === id) {
            item.value = value;
        }
        return item;
    });
    console.log(items);
    localStorage.setItem('list', JSON.stringify(items));
}
function getLocalStorage() {
    return (localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : []);
}
//local stroage API
//setup items
function setupItems() {
    var items = getLocalStorage();
    if (items.length > 0) {
        items.forEach(function (item) {
            createListItem(item.id, item.value);
        });
        container.classList.add('show-container');
    }
}
function createListItem(id, value) {
    //create the article
    var element = document.createElement('article');
    element.classList.add('to-do-item');
    var attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = "<p class=\"title\">".concat(value, "</p>\n<div class=\"btn-container\">\n    <button type=\"button\" class=\"edit-btn\">\n        <i class=\"fas fa-edit\"></i>\n    </button>\n    <button type=\"button\" class=\"delete-btn\">\n        <i class=\"fas fa-trash\"></i>\n    </button>\n</div>");
    //event listener for edit and delete icons
    var deleteBtn = element.querySelector('.delete-btn');
    var editBtn = element.querySelector('.edit-btn');
    deleteBtn.addEventListener('click', deleteItem);
    editBtn.addEventListener('click', editItem);
    //adding the article to the list
    list.appendChild(element);
}
