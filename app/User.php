<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $table = 'usuario';
    public $timestamps = false;
    protected $fillable = ['id','nombre','imagen'];

    public function tareas(){
        return $this->hasMany('App\Tarea','id_usuario');
    }
}
