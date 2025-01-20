        // Array untuk menyimpan data buku
        let books = [];
        let editIndex = null;

        function displayBooks() {
            let searchQuery = $('#search').val().toLowerCase();
            let selectedGenre = $('#genre-filter').val();
            let selectedStatus = $('#status-filter').val();
            $('#book-list').empty();
        
            for (let i = 0; i < books.length; i++) {
                // Filter berdasarkan pencarian dan genre
                if (
                    (books[i].title.toLowerCase().includes(searchQuery) ||
                    books[i].author.toLowerCase().includes(searchQuery)) &&
                    (selectedGenre === '' || books[i].genre === selectedGenre)
                ) {
                    // Filter tambahan berdasarkan status
                    let matchesStatus = true;
                    if (selectedStatus === 'borrowed') {
                        matchesStatus = books[i].isBorrowed;
                    } else if (selectedStatus === 'available') {
                        matchesStatus = !books[i].isBorrowed;
                    } else if (selectedStatus === 'favorite') {
                        matchesStatus = books[i].isFavorite;
                    }
        
                    if (!matchesStatus) continue;
        
                    const borrowerInfo = books[i].isBorrowed
    ? `<small>Dipinjam oleh: <a href="javascript:void(0);" onclick="showBorrowDetails(${i})" class="text-info" style="text-decoration: underline;">${books[i].borrower}</a> (Tanggal: ${books[i].borrowDate})</small>`
    : `<small>Tersedia</small>`;



        
                    $('#book-list').append(`
    <li class="list-group-item d-flex justify-content-between align-items-center">
        ${books[i].title} - ${books[i].author} (${books[i].genre})
        <div>
            ${borrowerInfo}
            <button onclick="viewDetail(${i})" class="btn btn-info btn-sm" data-bs-toggle="modal" data-bs-target="#detailModal">
                <i class="bi bi-eye"></i> Detail
            </button>
            <button onclick="editBook(${i})" class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#bookModal">
                <i class="bi bi-pencil"></i> Edit
            </button>
            <button onclick="deleteBook(${i})" class="btn btn-danger btn-sm">
                <i class="bi bi-trash"></i> Hapus
            </button>
            <button onclick="toggleBorrow(${i})" class="btn ${books[i].isBorrowed ? 'btn-secondary' : 'btn-primary'} btn-sm">
                <i class="bi ${books[i].isBorrowed ? 'bi-arrow-return-left' : 'bi-arrow-right-circle'}"></i>
                ${books[i].isBorrowed ? 'Kembalikan' : 'Pinjam'}
            </button>
            <button onclick="toggleFavorite(${i})" class="btn ${books[i].isFavorite ? 'btn-warning' : 'btn-outline-warning'} btn-sm">
                <i class="bi ${books[i].isFavorite ? 'bi-star-fill' : 'bi-star'}"></i>
                ${books[i].isFavorite ? 'Favorit' : 'Tambahkan ke Favorit'}
            </button>
        </div>
    </li>
`);

                }
            }
        }
        
        

        // Fungsi tambah buku baru
        $('#add-book-btn').click(function() {
            editIndex = null;
            $('#bookModalLabel').text('Tambah Buku Baru');
            $('#book-title').val('');
            $('#book-author').val('');
            $('#book-genre').val('Fiksi');
            $('#book-year').val('');
            $('#book-publisher').val('');
            $('#book-pages').val('');
        });

        // Fungsi untuk simpan atau update buku
        $('#save-book-btn').click(function() {
            const title = $('#book-title').val().trim();
            const author = $('#book-author').val().trim();
            const genre = $('#book-genre').val();
            const year = $('#book-year').val().trim();
            const publisher = $('#book-publisher').val().trim();
            const pages = $('#book-pages').val().trim();

            if (title && author && year && publisher && pages) {
                if (editIndex !== null) {
                    books[editIndex] = { ...books[editIndex], title, author, genre, year, publisher, pages };
                } else {
                    books.push({ title, author, genre, year, publisher, pages, isBorrowed: false, isFavorite: false });
                }
                displayBooks();
                $('#bookModal').modal('hide');
            } else {
                alert('Semua bidang harus diisi!');
            }
        });

        function viewDetail(index) {
    // Ambil data buku berdasarkan index
    const book = books[index];
    
    // Isi data buku ke dalam modal
    $('#detailModal .modal-body').html(`
        <p><strong>Judul:</strong> ${book.title}</p>
        <p><strong>Pengarang:</strong> ${book.author}</p>
        <p><strong>Genre:</strong> ${book.genre}</p>
        <p><strong>Tahun Terbit:</strong> ${book.year}</p>
        <p><strong>Penerbit:</strong> ${book.publisher}</p>
        <p><strong>Jumlah Halaman:</strong> ${book.pages}</p>
    `);

    // Menampilkan modal
    $('#detailModal').modal('show');
}


        // Fungsi untuk edit buku
        window.editBook = function(index) {
            editIndex = index;
            const book = books[index];
            $('#bookModalLabel').text('Edit Buku');
            $('#book-title').val(book.title);
            $('#book-author').val(book.author);
            $('#book-genre').val(book.genre);
            $('#book-year').val(book.year);
            $('#book-publisher').val(book.publisher);
            $('#book-pages').val(book.pages);
        };

        // Fungsi untuk menghapus buku dengan konfirmasi
        window.deleteBook = function(index) {
            const book = books[index];
            const confirmDelete = confirm(`Apakah Anda yakin ingin menghapus buku "${book.title}" oleh ${book.author}?`);
            if (confirmDelete) {
                books.splice(index, 1);
                displayBooks();
            }
        };

        // Fungsi untuk meminjam atau mengembalikan buku
window.toggleBorrow = function(index) {
    const book = books[index];
    if (!book.isBorrowed) {
        // Jika buku belum dipinjam, buka modal untuk memasukkan data peminjam
        $('#borrow-book-index').val(index); // Simpan indeks buku di modal
        $('#borrower-name').val(''); // Kosongkan input sebelumnya
        $('#borrow-date').val(new Date().toISOString().split('T')[0]); // Default tanggal peminjaman hari ini
        $('#return-date').val(''); // Kosongkan tanggal pengembalian
        $('#borrower-contact').val(''); // Kosongkan kontak peminjam
        $('#borrow-notes').val(''); // Kosongkan catatan
        $('#borrowModal').modal('show'); // Tampilkan modal
    } else {
        // Jika buku sudah dipinjam, langsung kembalikan
        const confirmReturn = confirm(`Apakah Anda yakin ingin mengembalikan buku "${book.title}"?`);
        if (confirmReturn) {
            book.isBorrowed = false;
            book.borrower = null;
            book.borrowDate = null;
            book.returnDate = null;
            book.borrowerContact = null;
            book.notes = null;
            displayBooks(); // Perbarui tampilan setelah pengembalian buku
        }
    }
};


        

// Event saat tombol "Pinjam" di modal diklik
$('#confirm-borrow-btn').click(function() {
    const index = $('#borrow-book-index').val(); // Ambil indeks buku yang dipinjam
    const borrowerName = $('#borrower-name').val().trim(); // Ambil nama peminjam
    const borrowDate = $('#borrow-date').val(); // Ambil tanggal peminjaman
    const returnDate = $('#return-date').val(); // Ambil tanggal pengembalian
    const borrowerContact = $('#borrower-contact').val().trim(); // Ambil kontak peminjam
    const borrowNotes = $('#borrow-notes').val().trim(); // Ambil catatan

    if (borrowerName && borrowDate) {
        const book = books[index]; // Ambil buku berdasarkan indeks
        book.isBorrowed = true; // Tandai buku sebagai dipinjam
        book.borrower = borrowerName; // Simpan nama peminjam
        book.borrowDate = borrowDate; // Simpan tanggal peminjaman
        book.returnDate = returnDate || null; // Simpan tanggal pengembalian jika ada
        book.borrowerContact = borrowerContact || null; // Simpan kontak peminjam jika ada
        book.notes = borrowNotes || null; // Simpan catatan jika ada

        $('#borrowModal').modal('hide'); // Tutup modal setelah peminjaman
        displayBooks(); // Perbarui tampilan daftar buku
    } else {
        alert('Nama peminjam dan tanggal peminjaman tidak boleh kosong.');
    }
});




        // Fungsi untuk menambahkan atau menghapus buku dari favorit
        window.toggleFavorite = function(index) {
            books[index].isFavorite = !books[index].isFavorite;
            displayBooks();
        };

        // Filter buku berdasarkan pencarian dan genre
        $('#search, #genre-filter').on('input', displayBooks);


        

        // Panggil fungsi untuk menampilkan buku saat halaman dimuat
        $(document).ready(function() {
            displayBooks();

            $('#search, #genre-filter, #status-filter').on('input', displayBooks);
        });


        
        function calculateStats() {
            $('#total-books').text(books.length);
    
            let genreCount = {};
            let favoriteCount = 0;
            let borrowedCount = 0;
    
            books.forEach(book => {
                if (book.isFavorite) favoriteCount++;
                if (book.isBorrowed) borrowedCount++;
                genreCount[book.genre] = (genreCount[book.genre] || 0) + 1;
            });
    
            $('#total-favorites').text(favoriteCount);
            $('#total-borrowed').text(borrowedCount);
    
            $('#genre-stats').empty();
            for (const genre in genreCount) {
                $('#genre-stats').append(`<li>${genre}: ${genreCount[genre]} buku</li>`);
            }
        }
    
        // Event saat tombol "Lihat Statistik" diklik
        $('#view-stats-btn').click(function() {
            $('#book-page').hide();
            $('#view-stats-btn').hide(); // Sembunyikan tombol "Lihat Statistik"
            $('#stats-page').show();
            calculateStats();
        });
    
        // Event saat tombol "Kembali ke Daftar Buku" diklik
        $('#back-btn').click(function() {
            $('#stats-page').hide();
            $('#book-page').show();
            $('#view-stats-btn').show(); // Tampilkan kembali tombol "Lihat Statistik"
        });

        window.showBorrowDetails = function(index) {
            const book = books[index];
        
            if (book.isBorrowed) {
                $('#borrowDetailModal .modal-body').html(`
                    <p><strong>Nama Peminjam:</strong> ${book.borrower}</p>
                    <p><strong>Tanggal Peminjaman:</strong> ${book.borrowDate}</p>
                    <p><strong>Tanggal Pengembalian:</strong> ${book.returnDate || 'Belum dikembalikan'}</p>
                    <p><strong>Kontak Peminjam:</strong> ${book.borrowerContact || 'Tidak ada'}</p>
                    <p><strong>Catatan:</strong> ${book.notes || 'Tidak ada'}</p>
                `);
                $('#borrowDetailModal').modal('show'); // Tampilkan modal
            } else {
                alert('Buku ini tersedia dan tidak dipinjam.');
            }
        };
        