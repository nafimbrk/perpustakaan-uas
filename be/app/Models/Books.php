<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Books extends Model
{
    protected $guarded = [];

    public function peminjamans()
    {
        return $this->hasMany(Peminjaman::class, 'book_id');
    }
}
