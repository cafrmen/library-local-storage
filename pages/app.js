const infoButton = document.getElementById('displayInfo');
const displayFormButton = document.getElementById('displayForm');
const displayForm = document.getElementById('form');
const bookTitle = document.getElementById('title');
const bookAuthor = document.getElementById('author');
const bookPages = document.getElementById('pages');
const bookIsRead = document.getElementById('isRead');
const submitButton = document.getElementById('addBook');
const tableBody = document.getElementById('tableBody');

let myLibrary = [];
let myLocalLibrary = [];

// local storage functionality
document.addEventListener('DOMContentLoaded', () => {
    displayLocalStorageLibrary();
})

const displayLocalStorageLibrary = () => {
    myLocalLibrary = JSON.parse(localStorage.getItem('myLibrary'));

    myLocalLibrary.length > 0 ?
        myLocalLibrary.forEach(storedBook => addBookToLibrary(storedBook)) :
        console.log('Add some books to the library, it\'s yours now!');
}

const localStorageLibrary = () => {
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

// library functionality
function Book(title, author, pages, isRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
    this.id = `Original Id: ${title} ${author} ${pages}`;
}

const editLibraryContentWithCellNewData = (rowIndexToEdit, cellIndexToEdit) => {
    cellIndexToEdit === 0 ?
        myLibrary[rowIndexToEdit].title = tableBody.rows[rowIndexToEdit].cells.item(0).innerText :
        cellIndexToEdit === 1 ?
            myLibrary[rowIndexToEdit].author = tableBody.rows[rowIndexToEdit].cells.item(1).innerText :
            myLibrary[rowIndexToEdit].pages = tableBody.rows[rowIndexToEdit].cells.item(2).innerText;

    localStorageLibrary();
}

const editCellContent = (cell) => {
    let rowIndex = cell.parentNode.rowIndex - 1;

    setTimeout(() => {
        editLibraryContentWithCellNewData(rowIndex, cell.cellIndex);
    }, 12)
}

const changeReadStatus = (id) => {
    for (let i = 0; i < myLibrary.length; i++) {
        if (myLibrary[i].id === id && myLibrary[i].isRead === true) {
            myLibrary[i].isRead = false;
        } else if (myLibrary[i].id === id && myLibrary[i].isRead === false) {
            myLibrary[i].isRead = true;
        }
    }
    localStorageLibrary();
}

const readButton = (isRead, id) => {
    let readInput = document.createElement('input');
    readInput.setAttribute('type', 'checkbox');
    readInput.setAttribute('id', id); // inputs must have an id
    readInput.checked = isRead;

    readInput.addEventListener('click', () => {
        changeReadStatus(id);
    })
    return readInput;
}

const deleteBook = (id) => {
    for (let i = 0; i < myLibrary.length; i++) {
        if (myLibrary[i].id === id) {
            myLibrary.splice(i, 1);
            tableBody.deleteRow(i);
            break;
        }
    }
    localStorageLibrary();
}

const deleteButton = (id) => {
    let deleteBookButton = document.createElement('button');
    deleteBookButton.classList.add('delete');
    deleteBookButton.textContent = '🗑️';

    deleteBookButton.addEventListener('click', () => {
        deleteBook(id);
    })
    return deleteBookButton;
}

const addBookToLibrary = (book) => {
    let newRow = tableBody.insertRow();
    let cell0 = newRow.insertCell(0);
    let cell1 = newRow.insertCell(1);
    let cell2 = newRow.insertCell(2);
    let cell3 = newRow.insertCell(3);
    let cell4 = newRow.insertCell(4);

    cell0.textContent = book.title;
    cell1.textContent = book.author;
    cell2.textContent = book.pages;
    cell3.appendChild(readButton(book.isRead, book.id));
    cell4.appendChild(deleteButton(book.id));

    cell0.contentEditable = true;
    cell1.contentEditable = true;
    cell2.contentEditable = true;
    cell0.addEventListener('keyup', (event) => {editCellContent(cell0)});
    cell1.addEventListener('keyup', (event) => {editCellContent(cell1)});
    cell2.addEventListener('keydown', (event) => {
        if(isNaN(event.key) && event.key !== 'Backspace' && event.key !== 'Tab' &&
                                event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
            event.preventDefault();
        }
        editCellContent(cell2);
    })
    myLibrary.push(book);
    localStorageLibrary();
}

// form functionality
const clearValues = () => {
    bookTitle.value = '';
    bookAuthor.value = '';
    bookPages.value = '';
    bookIsRead.checked = false;
}

const checkInputs = () => {
    if (bookTitle.value &&
        bookAuthor.value &&
        bookPages.value > 0) {
            const userBook = new Book(bookTitle.value, bookAuthor.value, bookPages.value, bookIsRead.checked);
            addBookToLibrary(userBook);
            clearValues();
        } else {
            alert('Please fill all the fields with valid values.');
        }
}
submitButton.addEventListener('click', checkInputs);

const showForm = () => {
    displayForm.classList.contains('show') ?
        displayForm.classList.remove('show') :
        displayForm.classList.add('show');
}
displayFormButton.addEventListener('click', showForm);

// about info display
const showInfo = () => {
    alert(`
        Welcome to a library that includes local storage where
        you can access 5 to 10 MiB of memory. Every time you
        open this library on your device, your previously entered
        data will be visible so you can update it if you wish.
        Enjoy it!`)
}
infoButton.addEventListener('click', showInfo);