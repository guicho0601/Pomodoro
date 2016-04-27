<?php

namespace App\Http\Controllers;

use App\Tarea;
use App\User;
use Illuminate\Http\Request;

use App\Http\Requests;

class UsuarioController extends Controller
{
    public function tareas(Request $request){
        $usuario = User::find($request->id);
        if($usuario==null){
            User::create($request->all());
            $usuario = User::find($request->id);
        }
        return response($usuario->tareas);
    }

    public function agregar_tarea(Request $request){
        Tarea::create($request->all());
        $usuario = User::find($request->id_usuario);
        return response($usuario->tareas);
    }

    public function actualizar($id,Request $request){
        $tarea = Tarea::find($id);
        $tarea->fill($request->all());
        $tarea->save();
        return response(User::find($tarea->id_usuario)->tareas);
    }

    public function eliminar($id){
        $tarea = Tarea::find($id);
        $tarea->delete();
        return response(User::find($tarea->id_usuario)->tareas);
    }
}
