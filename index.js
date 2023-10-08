const request = indexedDB.open('myDatabase', 1);

var db;

request.onupgradeneeded = function (event) {
  db = event.target.result;

  const objectStore = db.createObjectStore('contacts', { keyPath: 'id' });
};

request.onsuccess = function (event) {
  db = event.target.result;
  displayData();
};

request.onerror = function (event) {
  console.error('error:', event.target.error);
};

function addContact(e) {
  var request = db
    .transaction(['contacts'], 'readwrite')
    .objectStore('contacts')
    .add({
      id: document.getElementById('idInput').value,
      name: document.getElementById('nameInput').value,
    });

  request.onsuccess = function () {
    alert('Contact added successfully.');

    displayData();
  };
  request.onerror = function () {
    alert('Error adding contact.');
  };
}

// Function to display data in the table
function displayData() {
  const objectStore = db.transaction('contacts').objectStore('contacts');
  const tableBody = document.querySelector('#dataTable tbody');
  tableBody.innerHTML = '';

  objectStore.openCursor().onsuccess = function (event) {
    const cursor = event.target.result;

    if (cursor) {
      const contact = cursor.value;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${contact.id}</td>
        <td>${contact.name}</td>
        <td>
        <button onclick="editContact(${contact.id})" class="btn btn-info btn-sm">Edit</button>
          <button onclick="deleteContact(${contact.id})" class="btn btn-danger btn-sm">Delete</button>
        </td>
      `;

      tableBody.appendChild(row);

      cursor.continue();
    }
  };
}

// Function to delete a contact
function deleteContact(id) {
  const request = db
    .transaction(['contacts'], 'readwrite')
    .objectStore('contacts')
    .delete(String(id));

  request.onsuccess = function () {
    console.log('Contact deleted successfully.');
    displayData();
  };

  request.onerror = function () {
    console.error('Error deleting contact.');
  };
}

function editContact(id) {
  var request = db
    .transaction(['contacts'], 'readwrite')
    .objectStore('contacts')
    .put({
      id: String(id),
      name: document.getElementById('nameInput').value,
    });

  request.onsuccess = function () {
    alert('Contact updating successfully.');

    displayData();
  };
  request.onerror = function () {
    alert('Error updating contact.');
  };
}
