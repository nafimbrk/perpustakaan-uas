<?php

namespace Database\Seeders;

use App\Models\Books;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Books::insert([
            'judul' => 'Pulang',
            'pengarang' => 'Tere Liye',
            'genre' => 'Fiksi',
            'tahun_terbit' => 2014,
            'penerbit' => 'Gramedia',
            'jumlah_halaman' => 1000,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);
    }
}
