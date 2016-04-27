var React = require('react');
var ReactDOM = require('react-dom');
var moment = require('moment');
require('moment/locale/es');

moment.locale('es');
const responseFacebook = (response) => {
    console.log(response);
};

var opciones_repetir = [
    {valor:0,nombre:'No repetir',minutos:0},
    {valor:1,nombre:'Cada 5 minutos',minutos:5},
    {valor:2,nombre:'Cada 15 minutos',minutos:15},
    {valor:3,nombre:'Cada 30 minutos',minutos:30},
    {valor:4,nombre:'Cada 45 minutos',minutos:45},
    {valor:5,nombre:'Cada hora',minutos:60},
    {valor:6,nombre:'Cada 2 horas',minutos:120},
    {valor:7,nombre:'Cada 3 horas',minutos:180},
    {valor:8,nombre:'Cada 4 horas',minutos:240},
    {valor:9,nombre:'Cada 5 horas',minutos:300},
    {valor:10,nombre:'Cada 8 hora',minutos:480}
];

var NuevaTarea = require('./NuevaTarea.jsx');

var Canvas = React.createClass({
    componentDidMount(){
        var context = ReactDOM.findDOMNode(this).getContext('2d');
        this.dibujar(context);
    },
    componentDidUpdate: function() {
        var context = ReactDOM.findDOMNode(this).getContext('2d');
        context.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
        this.dibujar(context);
    },
    dibujar(ctx){
        var circ = Math.PI * 2;
        var quart = Math.PI / 2;
        var x = this.refs.canvas.width / 2;
        var y = this.refs.canvas.height / 2;
        ctx.beginPath();
        ctx.strokeStyle = '#fff';
        ctx.lineCap = 'square';
        ctx.closePath();
        ctx.fill();
        ctx.lineWidth = 15.0;
        ctx.beginPath();
        ctx.arc(this.refs.canvas.width/2, this.refs.canvas.height /2, parseInt((this.props.tamanio/2)*0.8), -(quart), ((circ) * this.props.porcentaje) - quart, false);
        ctx.stroke();
        ctx.font = '60pt Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.fillText(this.props.texto, x, y);
    },
    render(){
        return (
            <canvas id="circle" width={this.props.tamanio} height={this.props.tamanio} ref="canvas"></canvas>
        );
    }
});

var Reloj = React.createClass({
    getMinutosSegundos(numero){
        var minutos = parseInt(numero/60000);
        var segundos = ((numero%60000)/1000);
        return (minutos<10?'0'+minutos:minutos)+':'+(segundos<10?'0'+segundos:segundos);
    },
    getInitialState(){
        return {
            tiempo:this.props.trabajo*60000,
            descanso:this.props.descanso*60000,
            transcurrido:0,
            porcentaje:1,
            texto:this.getMinutosSegundos(this.props.trabajo*60000),
            es_descanso:false,
            intervalo:null,
            trabajando:false
        };
    },
    conteo(){
        var tiempo = !this.state.es_descanso ? this.state.tiempo : this.state.descanso;
        var transcurrido = this.state.transcurrido+1000;
        var diferencia = tiempo-transcurrido;
        if(diferencia==0){
            var es_descanso = this.state.es_descanso;
            var t = this.getMinutosSegundos((es_descanso?this.props.trabajo:this.props.descanso)*60000);
            clearInterval(this.state.intervalo);
            this.setState({intervalo:null,trabajando:false,transcurrido:0,texto:t,porcentaje:1,es_descanso:!es_descanso});
            PNotify.desktop.permission();
            if(!es_descanso){
                (new PNotify({
                    title: 'Tiempo de descansar',
                    text: 'Descansa un poco. Click para empezar el desanso.',
                    type: 'success',
                    desktop: {
                        desktop: true
                    }
                })).get().click(this.empezar);
            }else{
                (new PNotify({
                    title: 'Tiempo de trabajar',
                    text: 'Empieza de nuevo tu trabajo. Click para empezar el trabajo.',
                    type: 'info',
                    desktop: {
                        desktop: true
                    }
                })).get().click(this.empezar);
            }
        }else{
            var porcentaje = diferencia/tiempo;
            var texto = this.getMinutosSegundos(diferencia);
            this.setState({transcurrido:transcurrido,porcentaje:porcentaje,texto:texto});
        }
    },
    empezar(){
        PNotify.removeAll();
        if(!this.state.trabajando){
            var intervalo = setInterval(this.conteo,1000);
            this.setState({intervalo:intervalo,trabajando:true});
        }
    },
    parar(){
        clearInterval(this.state.intervalo);
        this.setState({intervalo:null,trabajando:false,transcurrido:0,texto:this.getMinutosSegundos(this.props.trabajo*60000),porcentaje:1,es_descanso:false});
    },
    render(){
        return(
            <div>
                <Canvas porcentaje={this.state.porcentaje} texto={this.state.texto} tamanio={700}/><br/>
                {!this.state.trabajando ?
                    <button className="btn waves-effect waves-light white black-text" onClick={this.empezar}>Empezar a {!this.state.es_descanso ? 'trabajar' : 'descansar'} <i className="fa fa-play"></i></button> :
                    <button className="btn waves-effect waves-light white black-text" onClick={this.parar}>Parar <i className="fa fa-stop"></i></button>
                }
            </div>
        );
    }
});

var ItemTarea = React.createClass({
    fecha(){
        var tarea = this.props.tarea;
        return moment().hour(tarea.hora).minute(tarea.minuto).format('HH:mm');
    },
    quitar(e){
        e.preventDefault();
        this.props.quitarTarea(this.props.tarea.id);
    },
    render(){
        var tarea = this.props.tarea;
        return(
            <li className={"collection-item darken-3 "+color}>
                <div>
                    {tarea.nombre+' - '+this.fecha()+(tarea.repetir>0 ? ' ('+opciones_repetir[tarea.repetir].nombre+')' : '')}
                    <a className="secondary-content white-text" href="#" onClick={this.quitar}><i className="fa fa-times" aria-hidden="true"></i></a>
                </div>
            </li>
        );
    }
});

var ListaTareas = React.createClass({
    render(){
        var lista = this.props.tareas.map(function(tarea){
            if(tarea==null)
                return;
            return(<ItemTarea key={tarea.id} tarea={tarea} quitarTarea={this.props.quitarTarea}/>);
        }.bind(this));
        var estilos_boton = {bottom:'45px',right:'24px'};
        return (
            <div>
                <ul className="collection with-header">
                    <li className={"collection-header darken-3 "+color}><h4>Tareas por hacer</h4></li>
                    {lista}
                </ul>
                <div className="fixed-action-btn horizontal click-to-toggle" style={estilos_boton}>
                    <a className="btn-floating btn-large red modal-trigger" href="#nueva_tarea">
                        <i className="fa fa-plus" aria-hidden="true"></i>
                    </a>
                </div>
                <NuevaTarea agregarTarea={this.props.agregarTarea}/>
            </div>
        );
    }
});

var Perfil = React.createClass({
    componentDidMount: function() {
        window.fbAsyncInit = function() {
            FB.init({
                appId      : '986819111395620',
                cookie     : true,
                xfbml      : true,
                version    : 'v2.1'
            });
            FB.getLoginStatus(function(response) {
                this.statusChangeCallback(response);
            }.bind(this));
        }.bind(this);

        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/es_LA/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    },
    testAPI: function() {
        console.log('Bienvenido!  Obteniendo tu información.... ');
        FB.api('/me', function(response) {
            console.log(response);
            console.log('Login satisfactorio: ' + response.name);
            this.setState({login:true,response:response});
        }.bind(this));
        FB.api("/me/picture", function (response) {
            if (response && !response.error) {
                this.setState({imagen:response.data.url});
                this.props.obtenerTareas({id:this.state.response.id,nombre:this.state.response.name,imagen:response.data.url});
            }
        }.bind(this));
    },
    statusChangeCallback: function(response) {
        console.log('statusChangeCallback');
        console.log(response);
        if (response.status === 'connected') {
            this.testAPI();
        } else if (response.status === 'not_authorized') {
            this.setState({login:false,response:null});
        } else {
            this.setState({login:false,response:null});
        }
    },
    checkLoginState: function() {
        FB.getLoginStatus(function(response) {
            this.statusChangeCallback(response);
        }.bind(this));
    },
    handleClick: function(e) {
        FB.login(this.checkLoginState());
        e.target.disabled = true;
    },
    getInitialState(){
        return {login:false,response:null,imagen:null};
    },
    logout(){
        FB.logout(function(response){
            if (response && !response.error) {
                this.setState({login: false, response: null, imagen: null});
            }
        }.bind(this));
    },
    render(){
        return(
            <ul className="collection">
                {!this.state.login ? <li className={"collection-item darken-3 "+color}><button type="button" className="waves-effect waves-light btn blue" onClick={this.handleClick}><i className="fa fa-facebook-official"></i> Iniciar sesión</button></li> :
                <li className={"collection-item avatar darken-3 "+color}>
                    <img src={this.state.imagen} alt="Contact Person" className="circle"/>
                    <span className="title">{this.state.response.name}</span>
                    <p><a href="#!" className="waves-effect waves-light btn" onClick={this.logout}>Cerrar sesión</a></p>
                </li>}
            </ul>
        );
    }
});

var Paneles = React.createClass({
    obtenerTareas(data){
        if(data==null)
            data = {id:this.state.id_usuario};
        else
            this.setState({id_usuario:data.id});
        data._token = csrf_token;
        $.ajax({
            url: url_global + '/tareas',
            type: 'POST',
            cache: false,
            dataType: 'json',
            data:data,
            success: function (data) {
                this.setState({tareas:data});
            }.bind(this)
        });
    },
    actualizarTarea(tarea){
        tarea._token = csrf_token;
        tarea._method = 'PATCH';
        $.ajax({
            url: url_global + '/tarea/'+tarea.id,
            type: 'POST',
            cache: false,
            dataType: 'json',
            data:tarea,
            success: function (data) {
                this.setState({tareas:data});
            }.bind(this)
        });
    },
    comprobarNotificaciones(){
        var tareas = this.state.tareas;
        var ahora = moment();
        tareas.map(function(tarea,index){
            if(tarea!=null){
                if(ahora.hour() == tarea.hora && ahora.minute() == tarea.minuto){
                    PNotify.desktop.permission();
                    (new PNotify({
                        title: 'Recordatorio',
                        text: tarea.nombre,
                        desktop: {
                            desktop: true
                        }
                    }));
                    if(tarea.repetir>0){
                        var proximo = moment().add(opciones_repetir[tarea.repetir].minutos,'minutes');
                        tarea.hora = proximo.hour();
                        tarea.minuto = proximo.minute();
                        if(this.state.id_usuario>0)
                            this.actualizarTarea(tarea);
                    }else
                        tareas.splice(index,1);
                }
            }
        }.bind(this));
        this.setState({tareas:tareas});
    },
    componentDidMount(){
        $('select').material_select();
        $('.modal-trigger').leanModal({dismissible: false});
        this.comprobarNotificaciones();
        setInterval(this.comprobarNotificaciones, 30000);
    },
    getInitialState(){
        return {
            tareas:[],id_usuario:0
        };
    },
    agregarTarea(tarea){
        if(this.state.id_usuario==0) {
            tarea.id = Math.floor((Math.random() * 10000) + 1);
            var tareas = this.state.tareas;
            tareas.push(tarea);
            this.setState({tareas: tareas});
        }else{
            tarea._token = csrf_token;
            tarea.id_usuario = this.state.id_usuario;
            $.ajax({
                url:url_global+'/tarea',
                type: 'POST',
                cache: false,
                dataType: 'json',
                data:tarea,
                success: function (data) {
                    this.setState({tareas:data});
                }.bind(this)
            });
        }
    },
    quitarTarea(tarea){
        if(this.state.id_usuario==0) {
            var tareas = this.state.tareas;
            var posicion = -1;
            for (var i = 0; i < tareas.length; i++)
                if (tareas[i] != null && tareas[i].id == tarea) {
                    posicion = i;
                    break;
                }
            if (posicion > -1)
                tareas.splice(posicion, 1);
            this.setState({tareas: tareas});
        }else{
            $.ajax({
                url: url_global + '/tarea/'+tarea,
                type: 'POST',
                cache: false,
                dataType: 'json',
                data:{
                    _token:csrf_token,
                    _method:'DELETE'
                },
                success: function (data) {
                    this.setState({tareas:data});
                }.bind(this)
            });
        }
    },
    render(){
        return(
            <div className="row">
                <div className="col m9">
                    <div className="row valign-wrapper">
                        <div className="col s2">
                            <img src="imagenes/pomodoro.png" alt="" className="circle responsive-img"/>
                        </div>
                        <div className="col s10">
                            <h2>Pomodoro</h2>
                        </div>
                    </div>
                </div>
                <div className="col m3">
                    <Perfil obtenerTareas={this.obtenerTareas}/>
                </div>
                <div className="col m9 center-align">
                    <Reloj trabajo={25} descanso={5}/>
                </div>
                <div className="col m3">
                    <ListaTareas tareas={this.state.tareas} agregarTarea={this.agregarTarea} quitarTarea={this.quitarTarea}/>
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <Paneles/>,
    document.getElementById('todo')
);