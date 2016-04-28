<?php
/**
 * Created by PhpStorm.
 * User: Luis
 * Date: 26/04/16
 * Time: 9:04 PM
 */

namespace App;


use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Tarea extends Model
{
    protected $table = 'tarea';
    public $timestamps = false;
    protected $fillable = ['nombre','id_usuario','hora','minuto','repetir'];
    protected $appends = ['actualizado'];

    public function usuario(){
        return $this->belongsTo('App\User','id_usuario');
    }

    public function getActualizadoAttribute(){
        $ahora = Carbon::now();
        $tarea = Carbon::createFromFormat('H:i',$this->hora.':'.$this->minuto);
        $actualizado = false;
        if($ahora>$tarea) {
            if($this->repetir>0){
                $this->attributes['minuto'] = $ahora->minute+1;
                $this->attributes['hora'] = $ahora->hour+1;
                $actualizado = true;
                $this->save();
            }else{
                $this->delete();
            }
        }
        return $actualizado;
    }
}