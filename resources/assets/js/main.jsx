var React = require('react');
var ReactDOM = require('react-dom');
var moment = require('moment');
var LocalStorageMixin = require('react-localstorage');
var FacebookLogin = require('react-facebook-login');

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

var FBLogin = React.createClass({
    componentWillMount: function () {
        window['statusChangeCallback'] = this.statusChangeCallback;
        window['checkLoginState'] = this.checkLoginState;
    },
    componentDidMount: function () {
        var s = '<div class="fb-login-button" ' +
            'data-scope="public_profile,email" data-size="large" ' +
            'data-show-faces="false" data-auto-logout-link="true" ' +
            'onlogin="checkLoginState"></div>';

        var div = document.getElementById('social-login-button-facebook')
        div.innerHTML = s;
    },
    componentWillUnmount: function () {
        delete window['statusChangeCallback'];
        delete window['checkLoginState'];
    },
    statusChangeCallback: function(response) {
        console.log(response);
    },
    // Callback for Facebook login button
    checkLoginState: function() {
        console.log('checking login state...');
        FB.getLoginStatus(function(response) {
            statusChangeCallback(response);
        });
    },
    render: function() {

        return (
            <div id='social-login-button-facebook'>

            </div>
        );
    }
});

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
    quitar(){
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

var Paneles = React.createClass({
    mixins: [LocalStorageMixin],
    comprobarNotificaciones(){
        var tareas = this.state.tareas;
        var ahora = moment();
        tareas.map(function(tarea,index){
            if(tarea!=null){
                if(ahora.hour() == tarea.hora && ahora.minute() == tarea.minuto){
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
                    }else
                        tareas.splice(index,1);
                }
            }
        });
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
            tareas:[]
        };
    },
    agregarTarea(tarea){
        var tareas = this.state.tareas;
        tareas.push(tarea);
        this.setState({tareas:tareas});
    },
    quitarTarea(tarea){
        var tareas = this.state.tareas;
        var posicion = -1;
        for(var i=0;i<tareas.length;i++)
            if(tareas[i] != null && tareas[i].id==tarea) {
                posicion = i;
                break;
            }
        if(posicion>-1)
            tareas.splice(posicion, 1);
        this.setState({tareas:tareas});
    },
    render(){
        return(
            <div className="row">
                <div className="col m9 center-align">
                    <h2>Pomodoro</h2>
                </div>
                <div className="col m3">

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