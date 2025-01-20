/*indexeddb functions*/
// Open (or create) the database
let db;
const request = indexedDB.open("Perpustakaan", 1);

request.onupgradeneeded = function (event) {
  db = event.target.result;
  const resourcesStore = db.createObjectStore("resources", {
    keyPath: "id",
    autoIncrement: true,
  }); // Existing store
  const booksStore = db.createObjectStore("books", { keyPath: "id" }); // New store for mk
};

request.onsuccess = function (event) {
  db = event.target.result;
};

request.onerror = function (event) {
  console.error("Database error:", event.target.errorCode);
};

// Function to add a new resource to IndexedDB
function idb_addResource(resource) {
  const transaction = db.transaction(["resources"], "readwrite");
  const objectStore = transaction.objectStore("resources");
  const request = objectStore.add(resource);

  request.onsuccess = function () {
    console.log("Resource added to IndexedDB:", resource);
  };

  request.onerror = function (event) {
    console.error("Error adding resource:", event.target.error);
  };
}

// Function to retrieve all resources from IndexedDB and display them
function idb_getAllResources() {
  const transaction = db.transaction(["resources"], "readonly");
  const objectStore = transaction.objectStore("resources");
  const request = objectStore.getAll();

  request.onsuccess = function (event) {
    const data = event.target.result;
    console.log("All resources:", data);

    // Clear previous results
    const resultTable = document.getElementById("idbSelectResult");
    resultTable.innerHTML = "";

    // Populate the table with the retrieved data
    data.forEach((item) => {
      const row = `<tr>
      <td>${item.judul}</td>
      <td>${item.pengarang}</td>
      <td>${item.genre}</td>
      <td>${item.tahun_terbit}</td>
      <td>${item.penerbit}</td>
      <td>${item.jumlah_halaman}</td>
                                </tr>`;
      resultTable.innerHTML += row;
    });
  };

  request.onerror = function (event) {
    console.error("Error retrieving resources:", event.target.error);
  };
}

// Function to find a resource by kode in IndexedDB and display the result
function idb_findResourceById(id) {
  const transaction = db.transaction(["resources"], "readonly");
  const objectStore = transaction.objectStore("resources");
  const request = objectStore.get(id);

  request.onsuccess = function (event) {
    const resource = event.target.result;
    const resultTable = document.getElementById("idbFindResult"); // Get the result table
    resultTable.innerHTML = ""; // Clear previous results

    if (resource) {
      console.log("Resource found:", resource);
      // Populate the table with the found resource
      const row = `<tr>
      <td>${resource.judul}</td>
      <td>${resource.pengarang}</td>
      <td>${resource.genre}</td>
      <td>${resource.tahun_terbit}</td>
      <td>${resource.penerbit}</td>
      <td>${resource.jumlah_halaman}</td>
                                </tr>`;
      resultTable.innerHTML = row; // Display the found resource
    } else {
      console.log("No resource found with id:", id);
      resultTable.innerHTML = '<tr><td colspan="3">No resource found</td></tr>'; // Display no resource found message
    }
  };

  request.onerror = function (event) {
    console.error("Error finding resource:", event.target.error);
  };
}

// Function to update a resource in IndexedDB
function idb_updateResource(resource) {
  const transaction = db.transaction(["resources"], "readwrite");
  const objectStore = transaction.objectStore("resources");
  const request = objectStore.put(resource); // Use 'kode' as the key

  request.onsuccess = function () {
    console.log("Resource updated in IndexedDB:", resource);
  };

  request.onerror = function (event) {
    console.error("Error updating resource:", event.target.error);
  };
}

// Function to delete a resource by kode from IndexedDB
function idb_deleteResourceById(id) {
  const transaction = db.transaction(["resources"], "readwrite");
  const objectStore = transaction.objectStore("resources");
  const request = objectStore.delete(id);

  request.onsuccess = function () {
    console.log("Resource deleted from IndexedDB with id:", id);
  };

  request.onerror = function (event) {
    console.error("Error deleting resource:", event.target.error);
  };
}

/*retrieve data from input and pass then to indexeddb functions*/
// Function to insert a new resource from input fields
function idb_insert() {
  const judul = document.getElementById("idbInsertJudul").value; // Updated ID
  const pengarang = document.getElementById("idbInsertPengarang").value; // Updated ID
  const genre = document.getElementById("idbInsertGenre").value; // Updated ID
  const tahun_terbit = document.getElementById("idbInsertTahunTerbit").value; // Updated ID
  const penerbit = document.getElementById("idbInsertPenerbit").value; // Updated ID
  const jumlah_halaman = document.getElementById(
    "idbInsertJumlahHalaman"
  ).value; // Updated ID

  // Create a resource object
  const resource = {
    judul: judul, // Use 'kode' as the primary key ```html
    pengarang: pengarang,
    genre: genre,
    tahun_terbit: tahun_terbit,
    penerbit: penerbit,
    jumlah_halaman: jumlah_halaman
  };

  // Call the idb_addResource function with the resource object
  idb_addResource(resource);
}

// Function to retrieve all resources and display them
function idb_displayAllResources() {
  idb_getAllResources(); // Call the function to get all resources
}

// Function to find a resource by kode from input field
function idb_find() {
  const id = Number(document.getElementById("idbFindId").value); // Updated ID
  idb_findResourceById(id); // Call the function to find the resource
}

// Function to update a resource from input fields
function idb_update() {
  const id = Number(document.getElementById("idbUpdateId").value); // Updated ID
  const judul = document.getElementById("idbUpdateJudul").value; // Updated ID
  const pengarang = document.getElementById("idbUpdatePengarang").value; // Updated ID
  const genre = document.getElementById("idbUpdateGenre").value; // Updated ID
  const tahun_terbit = document.getElementById("idbUpdateTahunTerbit").value; // Updated ID
  const penerbit = document.getElementById("idbUpdatePenerbit").value; // Updated ID
  const jumlah_halaman = document.getElementById(
    "idbUpdateJumlahHalaman"
  ).value; // Updated ID

  // Create a resource object
  const resource = {
    id: id,
    judul: judul, // Use 'kode' as the primary key ```html
    pengarang: pengarang,
    genre: genre,
    tahun_terbit: tahun_terbit,
    penerbit: penerbit,
    jumlah_halaman: jumlah_halaman,
  };

  // Call the idb_updateResource function with the resource object
  idb_updateResource(resource);
}

// Function to delete a resource by kode from input field
function idb_delete() {
  const id = Number(document.getElementById("idbDeleteId").value); // Updated ID
  idb_deleteResourceById(id); // Call the function to delete the resource
}
