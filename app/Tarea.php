<?php
/**
 * Created by PhpStorm.
 * User: Luis
 * Date: 26/04/16
 * Time: 9:04 PM
 */

namespace App;


use Illuminate\Database\Eloquent\Model;

class Tarea extends Model
{
    protected $table = 'tarea';
    public $timestamps = false;
    protected $fillable = ['nombre','id_usuario','hora','minuto','repetir'];

    public function usuario(){
        return $this->belongsTo('App\User','id_usuario');
    }
}