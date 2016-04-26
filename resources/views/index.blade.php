<!doctype html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Pomodoro</title>
    <link type="text/css" rel="stylesheet" href="<?=asset('css/app.css')?>"  media="screen,projection"/>
</head>
<body class="<?=$color?> darken-3 white-text">
    <div id="todo"></div>
    <script src="<?=asset('js/all.js')?>"></script>
    <script>
        var color = '<?=$color?>';
        window.fbAsyncInit = function() {
            FB.init({
                appId      : '986819111395620',
                xfbml      : true,
                version    : 'v2.6'
            });
        };

        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/es_LA/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    </script>
    <script src="<?=asset('js/main.js')?>"></script>
</body>
</html>