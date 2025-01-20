<?php

use App\Http\Controllers\BooksController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::resource('/books', BooksController::class);

Route::post('/pinjam', [BooksController::class, 'pinjam']);
Route::post('/books/return/{book}', [BooksController::class, 'returnBook'])->name('books.return');

