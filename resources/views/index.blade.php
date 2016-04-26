<!doctype html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Pomodoro</title>
    <link type="text/css" rel="stylesheet" href="<?=asset('css/app.css')?>"  media="screen,projection"/>
    <link rel="icon" href="<?=asset('imagenes/pomodoro.png')?>">
</head>
<body class="<?=$color?> darken-3 white-text">
    <div id="todo"></div>
    <script src="<?=asset('js/all.js')?>"></script>
    <script>
        var color = '<?=$color?>';
    </script>
    <script src="<?=asset('js/main.js')?>"></script>
</body>
</html>