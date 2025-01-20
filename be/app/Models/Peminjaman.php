<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Peminjaman extends Model
{   
    protected $guarded = [];

    public $table = 'peminjamans';

    public function book()
    {
        return $this->belongsTo(Books::class, 'book_id');
    }
}
