/*for toast*/
function showToast(message) {
  const toastContainer = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  toastContainer.appendChild(toast);

  // Remove the toast after the animation is complete
  setTimeout(() => {
    toastContainer.removeChild(toast);
  }, 3000); // Adjust the time as needed (3000ms = 3 seconds)
}

const apiUrl = "http://127.0.0.1:8000/api/books"; // Replace with your actual API URL

// Function to create a new resource
async function insert() {
  const judul = document.getElementById("apiInsertJudul").value; // Updated ID
  const pengarang = document.getElementById("apiInsertPengarang").value; // Updated ID
  const genre = document.getElementById("apiInsertGenre").value; // Updated ID
  const tahun_terbit = document.getElementById("apiInsertTahunTerbit").value; // Updated ID
  const penerbit = document.getElementById("apiInsertPenerbit").value; // Updated ID
  const jumlah_halaman = document.getElementById(
    "apiInsertJumlahHalaman"
  ).value; // Updated ID

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        judul,
        pengarang,
        genre,
        tahun_terbit,
        penerbit,
        jumlah_halaman,
      }),
    });

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

// Function to retrieve all resources
async function select() {
  const resultTable = document.getElementById("apiSelectResult"); // Updated ID

  try {
    const response = await fetch(apiUrl, { method: "GET" });
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();

    console.log(data); // Log the data to see its structure

    // Clear previous results
    resultTable.innerHTML = "";

    // Check if data.data is an array
    if (Array.isArray(data.data)) {
      data.data.forEach((item) => {
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
    } else {
      console.error("Expected an array but got:", data);
      resultTable.innerHTML = '<tr><td colspan="4">No data available</td></tr>';
    }
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

// Function to find a resource by ID
async function find() {
  const id = document.getElementById("apiFindId").value; // Updated ID
  const resultTable = document.getElementById("apiFindResult"); // Updated ID

  try {
    const response = await fetch(`${apiUrl}/${id}`, { method: "GET" });
    if (!response.ok) throw new Error("Network response was not ok");
    const result = await response.json(); // Store the entire response

    // Clear previous results
    resultTable.innerHTML = "";

    // Check if the response has a successful status and contains data
    if (result.status && result.data) {
      const data = result.data; // Access the data property
      const row = `<tr>
                            <td>${id}</td>
                            <td>${data.judul}</td>
                            <td>${data.pengarang}</td>
                            <td>${data.genre}</td>
                            <td>${data.tahun_terbit}</td>
                            <td>${data.penerbit}</td>
                            <td>${data.jumlah_halaman}</td>
                        </tr>`;
      resultTable.innerHTML = row;
    } else {
      console.error("Expected an object but got:", result);
      resultTable.innerHTML = '<tr><td colspan="4">No data found</td></tr>';
    }
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

// Function to update a resource by ID
async function update() {
  const judul = document.getElementById("apiUpdateJudul").value; // Updated ID
  const pengarang = document.getElementById("apiUpdatePengarang").value; // Updated ID
  const genre = document.getElementById("apiUpdateGenre").value; // Updated ID
  const tahun_terbit = document.getElementById("apiUpdateTahunTerbit").value; // Updated ID
  const penerbit = document.getElementById("apiUpdatePenerbit").value; // Updated ID
  const jumlah_halaman = document.getElementById(
    "apiUpdateJumlahHalaman"
  ).value; // Updated ID

  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        judul,
        pengarang,
        genre,
        tahun_terbit,
        penerbit,
        jumlah_halaman,
      }),
    });

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

// Function to delete a resource by ID
async function deleteResource() {
  const id = document.getElementById("apiDeleteId").value; // Updated ID

  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data.message);
  } catch (error) {
    console.error("Error deleting resource:", error);
  }
}