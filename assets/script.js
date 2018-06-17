// Form DOM elements
const form = document.querySelector("#entry-form")
const fieldTitle = document.querySelector("#entry-title")
const fieldAuthor = document.querySelector("#entry-author")
const fieldPages = document.querySelector("#entry-pages")
const fieldFinished = document.querySelector("#entry-finished")

// Form hide/show functions
const mainContainer = document.querySelector("#main")
const modalWrapper = document.querySelector(".modal-background")
const btnModalClose = document.querySelector(".modal-dismiss")
const btnModalOpen = document.querySelector(".new-book-button")
const closeModal = e => { 
  modalWrapper.classList.add("hidden")
  mainContainer.classList.remove("blur")
}
const openModal = e => { 
  modalWrapper.classList.remove("hidden")
  mainContainer.classList.add("blur")
}
btnModalClose.addEventListener('click', closeModal)
btnModalOpen.addEventListener('click', () => { 
  openModal()
  setTimeout(() => fieldTitle.focus(), 400)
})

// Hides form when it detects a click outside
const modal = modalWrapper.querySelector(".modal")
modal.addEventListener('click', e => e.stopPropagation())
modalWrapper.addEventListener('click', closeModal)

// Auto-incrementing id declaration
let index = 1

// Book constructor function
function Book(title, author, pages, finished = false) {
  this.id = index ++
  this.title = title
  this.author = author
  this.pages = pages
  this.finished = finished
}

// Array and table of books
let bookArray = []
const bookTable = document.querySelector(".book-list")

// Form submission handling
form.addEventListener('submit', e => {
  // Blocks default submit functionality
  e.preventDefault()
  // Creates a book object and inserts it into the list
  book = createBook()
  bookArray.push(book)
  createBookElement(book)
  // Clean-up
  form.reset()
  closeModal()
})

// Creates a book entry from form data
const createBook = () => {
  let title = fieldTitle.value
  let author = fieldAuthor.value
  let pages = fieldPages.value
  let finished = fieldFinished.checked
  return (new Book(title, author, pages, finished))
}

// Creates a book element
const createBookElement = book => {  
 let bookElement = document.createElement("tr")
  for (let [key, value] of Object.entries(book)) {
    if (key === "id") {
      bookElement.id = "book-" + value
      continue
    }
    if (key == "finished") continue
    let bookElementColumn = createElementWithText("td", value)
    bookElement.appendChild(bookElementColumn)
  }

  let toggleReadButtonColumn = createToggleReadButtonColumn(book.id, book.finished)
  let deleteButtonColumn = createDeleteButtonColumn(book.id)
  bookElement.appendChild(toggleReadButtonColumn)
  bookElement.appendChild(deleteButtonColumn)
  bookTable.prepend(bookElement)
  saveToStorage()
}

// Generates the 'finished' button toggler
const createToggleReadButtonColumn = (id, finished) => {
  let text = finished ? "fa-check" : "fa-times"
  let toggleReadButton = createElementWithIcon("button", "fas", "fa-2x", text)
  toggleReadButton.classList.add("finished")
  toggleReadButton.dataset.book = id
  let toggleReadButtonColumn = document.createElement("td")
  toggleReadButtonColumn.appendChild(toggleReadButton)
  return toggleReadButtonColumn
}

// Generates the delete button
const createDeleteButtonColumn = id => { 
  let deleteButton = createElementWithIcon("button", "fas", "fa-lg", "fa-trash")  
  deleteButton.classList.add("delete")
  deleteButton.dataset.book = id
  let deleteButtonColumn = document.createElement("td")
  deleteButtonColumn.appendChild(deleteButton)
  return deleteButtonColumn
}

// Toggles the 'finished' state of a book
document.addEventListener('click', e => {
  if (e.target && e.target.className === "finished") {
    let id = e.target.dataset.book    
    // Finds the book from the array, flips the 'finished' state
    let book = bookArray.find(b => b.id == id)
    book.finished = !book.finished
    if (book.finished) {
      e.target.querySelector("i").classList.add("fa-check")
      e.target.querySelector("i").classList.remove("fa-times")
    }
    else {
      e.target.querySelector("i").classList.add("fa-times")
      e.target.querySelector("i").classList.remove("fa-circle")
    }
    saveToStorage()
  }
})

// Deletes a book
document.addEventListener('click', e => {
  if (e.target && e.target.className === "delete") {
    let id = e.target.dataset.book
    if (confirm("Are you sure you want to delete this book?")) {
      // Removes the book from the array
      let book = bookArray.find(b => b.id == id)      
      bookIndex = bookArray.indexOf(book)
      bookArray.splice(bookIndex, 1)
      // Removes the book element from the table
      bookElement = document.getElementById("book-" + id)
      bookTable.removeChild(bookElement)      
    }
    saveToStorage()
  }
})

// Creates an element with text
const createElementWithText = (_elementType, _text) => {
  let tag = document.createElement(_elementType)
  let text = document.createTextNode(_text)
  tag.appendChild(text)
  return tag
}

// Creates an element with font-awesome icon
const createElementWithIcon = (_elementType, ..._iconClasses) => {
  let tag = document.createElement(_elementType)
  let icon = document.createElement("i")
  _iconClasses.forEach(iconClass => icon.classList.add(iconClass))
  tag.appendChild(icon)
  return tag
}

// Checks if local storage is available, code retrieved from 
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
function storageAvailable(type) {
  try {
    let storage = window[type],
        x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  }
  catch(e) {
    return e instanceof DOMException && (
      // everything except Firefox
      e.code === 22 ||
      // Firefox
      e.code === 1014 ||
      // test name field too, because code might not be present
      // everything except Firefox
      e.name === 'QuotaExceededError' ||
      // Firefox
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage.length !== 0;
  }
}

// Saves to the localStorage
const saveToStorage = () => {
  if (storageAvailable('localStorage')) {
    dataString = JSON.stringify(bookArray)
    localStorage.setItem("mylibrary.books", dataString)
    localStorage.setItem("mylibrary.index", index)
  }  
}

// Removes stored data from the localStorage
const removeFromStorage = () => {
  if (storageAvailable('localStorage')) {
    localStorage.removeItem("mylibrary.books")
    localStorage.removeItem("mylibrary.index")
  }  
}

// Populates the array
const populateArray = () => {
  bookArray.push(new Book("A Game of Thrones", "George R.R. Martin", 694))
  bookArray.push(new Book("A Clash of Kings", "George R.R. Martin", 768))
  bookArray.push(new Book("A Storm of Swords", "George R.R. Martin", 973))
  bookArray.push(new Book("A Feast for Crows", "George R.R. Martin", 753))
  bookArray.push(new Book("Treasure Island", "Robert Louis Stevenson", ""))
  bookArray.push(new Book("Nineteen Eighty-Four", "George Orwell", 328))
  bookArray.push(new Book("To Kill a Mockingbird", "Harper Lee", 281))
  bookArray.push(new Book("Hamlet", "William Shakespeare", 500))
  bookArray.push(new Book("20,000 Leagues Under the Sea", "Jules Verne", 426))
  bookArray.push(new Book("Journey to the Center of the Earth", "Jules Verne", 183))
  bookArray.push(new Book("Adventures of Hucklebery Finn", "Mark Twain", 366))
}

// Reloads data from the localStorage
const reloadFromStorage = () => {
  if (storageAvailable('localStorage')) {
    dataArray = localStorage.getItem("mylibrary.books")
    storedIndex = localStorage.getItem("mylibrary.index")
    if (dataArray) {
      bookArray = JSON.parse(dataArray)
      index = parseInt(storedIndex)
    }
    else populateArray()
  }
}

// Render function
const render = () => {
  bookArray.forEach(function(b) { createBookElement(b) })
}

// Function calls
reloadFromStorage()
render()