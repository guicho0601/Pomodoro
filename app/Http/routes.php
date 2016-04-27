<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    $colores = ['orange', 'red', 'pink', 'purple', 'indigo', 'blue', 'cyan', 'teal', 'green', 'lime', 'yellow', 'amber', 'brown',];
    $color = $colores[rand(0,count($colores)-1)];
    return view('index',compact('color'));
});

Route::post('tareas','UsuarioController@tareas');
Route::post('tarea','UsuarioController@agregar_tarea');
Route::patch('tarea/{id}','UsuarioController@actualizar');
Route::delete('tarea/{id}','UsuarioController@eliminar');
