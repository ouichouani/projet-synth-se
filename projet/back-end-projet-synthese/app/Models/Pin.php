<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory ;
class Pin extends Model
{
    use HasFactory ;

    protected $fillable = [
        'title' ,
        'description' ,
        'image_url' ,
        'is_public' ,
        'user_id' ,
    ] ;

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

}
