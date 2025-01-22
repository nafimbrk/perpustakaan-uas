<?php

namespace App\Http\Controllers;

use App\Models\Books;
use App\Models\Peminjaman;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BooksController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $books = Books::all();

        return response()->json([
            'status' => true,
            'message' => 'data berhasil didapatkan',
            'data' => $books
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'judul' => 'required',
            'pengarang' => 'required',
            'genre' => 'required',
            'tahun_terbit' => 'required',
            'penerbit' => 'required',
            'jumlah_halaman' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $books = Books::create($request->all());
        
        return response()->json([
            'status' => true,
            'message' => 'data berhasil dimasukkan',
            'data' => $books
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $book = Books::findOrFail($id);

        return response()->json([
            'status' => true,
            'message' => 'data berhasil didapatkan',
            'data' => $book
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Books $books)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'judul' => 'required',
            'pengarang' => 'required',
            'genre' => 'required',
            'tahun_terbit' => 'required',
            'penerbit' => 'required',
            'jumlah_halaman' => 'required'
        ]);

        $book = Books::findOrFail($id);

        $book->judul = $request->input('judul');
        $book->pengarang = $request->input('pengarang');
        $book->genre = $request->input('genre');
        $book->tahun_terbit = $request->input('tahun_terbit');
        $book->penerbit = $request->input('penerbit');
        $book->jumlah_halaman = $request->input('jumlah_halaman');
        $book->save();

        return response()->json([
            'status' => true,
            'message' => 'data berhasil diubah',
            'data' => $book
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $book = Books::findOrFail($id);
        
        $book->delete();

        return response()->json([
            'status' => true,
            'message' => 'data berhasil dihapus'
        ], 200);
    }

    public function pinjam(Request $request)
{

    $validated = $request->validate([
        'book_id' => 'required|exists:books,id',
        'peminjam' => 'required|string',
        'tanggal_pinjam' => 'required|date',
        'tanggal_kembali' => 'required|date',
        'kontak' => 'required|string',
        'catatan' => 'nullable|string',
    ]);

    $book = Books::find($request->book_id);
    if ($book->pinjam) {
        return response()->json(['success' => false, 'message' => 'Buku sudah dipinjam.'], 400);
    }

    $book->update(['pinjam' => true]);

    Peminjaman::create([
        'book_id' => $request->input('book_id'),
        'peminjam' => $request->input('peminjam'),
        'tanggal_pinjam' => $request->input('tanggal_pinjam'),
        'tanggal_kembali' => $request->input('tanggal_kembali'),
        'kontak' => $request->input('kontak'),
        'catatan' => $request->input('catatan')
    ]);

    return response()->json(['success' => true]);
}

public function details($bookId)
{
    $peminjaman = Peminjaman::where('book_id', $bookId)->firstOrFail();
    $book = Books::findOrFail($bookId);

    return response()->json([
        'book' => $book,
        'peminjam' => $peminjaman->peminjam,
        'kontak' => $peminjaman->kontak,
        'tanggal_pinjam' => $peminjaman->tanggal_pinjam,
        'tanggal_kembali' => $peminjaman->tanggal_kembali,
    ]);
}



public function returnBook($bookId)
{
    try {
        // Cari buku berdasarkan ID
        $book = Books::find($bookId);  // Gunakan find() untuk pengecekan lebih fleksibel
        if (!$book) {
            return response()->json(['message' => 'Buku tidak ditemukan'], 404);
        }

        // Hapus data peminjaman berdasarkan book_id
        Peminjaman::where('book_id', $bookId)->delete();

        // Ubah status pinjam menjadi false
        $book->update(['pinjam' => false]);

        return response()->json(['message' => 'Buku berhasil dikembalikan!'], 200);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Terjadi kesalahan: ' . $e->getMessage()], 500);
    }
}


public function updateFavorit($bookId, Request $request)
{
    try {
        // Cari buku berdasarkan ID
        $book = Books::findOrFail($bookId);

        // Ambil status favorit dari request (ini harus boolean)
        $favoriteStatus = !$book->favorit; // Jika status favorit saat ini false, ganti jadi true, sebaliknya

        // Update status favorit buku
        $book->favorit = $favoriteStatus;

        // Simpan perubahan ke database
        $book->save();

        // Mengembalikan response dengan pesan dan status favorit yang baru
        return response()->json([
            'message' => $favoriteStatus ? 'Buku berhasil ditambahkan ke favorit' : 'Buku berhasil dihapus dari favorit',
            'favorit' => $favoriteStatus
        ], 200);
    } catch (\Exception $e) {
        // Menangani error jika terjadi masalah
        return response()->json(['message' => 'Terjadi kesalahan: ' . $e->getMessage()], 500);
    }
}

}
