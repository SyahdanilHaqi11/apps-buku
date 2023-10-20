document.addEventListener("DOMContentLoaded", function () {
  const inputBookForm = document.getElementById("inputBookForm");
  const titleInput = document.getElementById("title");
  const authorInput = document.getElementById("author");
  const yearInput = document.getElementById("year");
  const isCompleteInput = document.getElementById("isComplete");

  const unfinishedBookshelf = document.getElementById("unfinishedBookshelf");
  const finishedBookshelf = document.getElementById("finishedBookshelf");

  // Load saved books from localStorage
  const savedBooks = JSON.parse(localStorage.getItem("books")) || { unfinished: [], finished: [] };
  const unfinishedBooks = savedBooks.unfinished;
  const finishedBooks = savedBooks.finished;

  function saveBooksToLocalStorage() {
    localStorage.setItem("books", JSON.stringify({ unfinished: unfinishedBooks, finished: finishedBooks }));
  }

  function createBookElement(book, isComplete) {
    const bookElement = document.createElement("li");
    bookElement.classList.add("book-item");
    const bookInfo = `
            <h3>${book.title}</h3>
            <p>Penulis: ${book.author}</p>
            <p>Tahun: ${book.year}</p>
        `;
    bookElement.innerHTML = bookInfo;

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action");

    const toggleButton = document.createElement("button");
    toggleButton.textContent = isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
    toggleButton.classList.add(isComplete ? "green" : "red");
    toggleButton.addEventListener("click", function () {
      toggleBookStatus(book, isComplete);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Hapus buku";
    deleteButton.classList.add("red");
    deleteButton.addEventListener("click", function () {
      deleteBook(book, isComplete);
    });

    actionContainer.appendChild(toggleButton);
    actionContainer.appendChild(deleteButton);
    bookElement.appendChild(actionContainer);

    return bookElement;
  }

  function refreshBookshelves() {
    unfinishedBookshelf.innerHTML = "";
    finishedBookshelf.innerHTML = "";

    unfinishedBooks.forEach((book) => {
      const bookElement = createBookElement(book, false);
      unfinishedBookshelf.appendChild(bookElement);
    });

    finishedBooks.forEach((book) => {
      const bookElement = createBookElement(book, true);
      finishedBookshelf.appendChild(bookElement);
    });
  }

  function addBook(title, author, year, isComplete) {
    const newBook = {
      id: +new Date(),
      title,
      author,
      year,
    };

    if (isComplete) {
      finishedBooks.push(newBook);
    } else {
      unfinishedBooks.push(newBook);
    }

    saveBooksToLocalStorage();
    refreshBookshelves();
  }

  function deleteBook(book, isComplete) {
    const bookList = isComplete ? finishedBooks : unfinishedBooks;
    const index = bookList.findIndex((b) => b.id === book.id);

    if (index !== -1) {
      bookList.splice(index, 1);
    }

    saveBooksToLocalStorage();
    refreshBookshelves();
  }

  function toggleBookStatus(book, isComplete) {
    const sourceList = isComplete ? finishedBooks : unfinishedBooks;
    const targetList = isComplete ? unfinishedBooks : finishedBooks;

    const index = sourceList.findIndex((b) => b.id === book.id);

    if (index !== -1) {
      const movedBook = sourceList.splice(index, 1)[0];
      targetList.push(movedBook);
    }

    saveBooksToLocalStorage();
    refreshBookshelves();
  }

  inputBookForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const title = titleInput.value;
    const author = authorInput.value;
    const year = yearInput.value;
    const isComplete = isCompleteInput.checked;

    addBook(title, author, year, isComplete);

    titleInput.value = "";
    authorInput.value = "";
    yearInput.value = "";
    isCompleteInput.checked = false;
  });

  refreshBookshelves();
});

document.addEventListener("DOMContentLoaded", function () {
  const searchBookTitleInput = document.getElementById("searchBookTitle");
  const searchButton = document.querySelector('#searchBook button[type="cari"]');

  searchButton.addEventListener("click", function (e) {
    e.preventDefault();

    const searchText = searchBookTitleInput.value.trim().toLowerCase();

    // Logika pencarian buku berdasarkan judul
    const bookList = document.querySelectorAll(".book_item"); // Ganti dengan selektor yang sesuai
    bookList.forEach(function (book) {
      const bookTitle = book.querySelector("h3").textContent.toLowerCase();
      if (bookTitle.includes(searchText)) {
        book.style.display = "block"; // Tampilkan buku jika ditemukan
      } else {
        book.style.display = "none"; // Sembunyikan buku jika tidak ditemukan
      }
    });
  });
});
