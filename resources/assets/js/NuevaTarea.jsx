var React = require('react');
var ReactDOM = require('react-dom');

var opciones_repetir = [
    {valor:0,nombre:'No repetir'},
    {valor:1,nombre:'Cada 5 minutos'},
    {valor:2,nombre:'Cada 15 minutos'},
    {valor:3,nombre:'Cada 30 minutos'},
    {valor:4,nombre:'Cada 45 minutos'},
    {valor:5,nombre:'Cada hora'},
    {valor:6,nombre:'Cada 2 horas'},
    {valor:7,nombre:'Cada 3 horas'},
    {valor:8,nombre:'Cada 4 horas'},
    {valor:9,nombre:'Cada 5 horas'},
    {valor:10,nombre:'Cada 8 hora'}
];

var NuevaTarea = React.createClass({
    getInitialState(){
        return {nombre:'',hora:0,minuto:0,repetir:0};
    },
    handlerNombre(e){
        this.setState({nombre:e.target.value});
    },
    handlerHora(e){
        this.setState({hora:parseInt(e.target.value)});
    },
    handlerMinuto(e){
        this.setState({minuto:parseInt(e.target.value)});
    },
    handlerRepetir(e){
        this.setState({repetir:parseInt(e.target.value)});
    },
    guardar(){
        var tarea = {
            id:Math.floor((Math.random() * 10000) + 1),
            nombre:this.state.nombre,
            hora:this.state.hora,
            minuto:this.state.minuto,
            repetir:this.state.repetir
        };
        this.props.agregarTarea(tarea);
        this.cerrar();
    },
    cerrar(){
        this.setState({nombre:'',hora:0,minuto:0,repetir:0});
    },
    render(){
        var horas = [],minutos=[];
        for(var i=0;i<=23;i++)
            horas.push(<option key={i} value={i}>{i}</option>);
        for(i=0;i<59;i+=5)
            minutos.push(<option key={i} value={i}>{i}</option>);
        var repetir = opciones_repetir.map(function(opcion){
            return(<option key={opcion.valor} value={opcion.valor}>{opcion.nombre}</option>);
        });
        return(
            <div id="nueva_tarea" className="modal bottom-sheet black-text">
                <div className="modal-content">
                    <h4>Nueva tarea</h4>
                    <div className="row">
                        <form className="col s12">
                            <div className="row">
                                <div className="input-field col s5">
                                    <input placeholder="Nombre de la tarea" type="text" className="validate" value={this.state.nombre} onChange={this.handlerNombre}/>
                                    <label for="first_name">Nombre</label>
                                </div>
                                <div className="col s2">
                                    <label>Hora</label>
                                    <select className="browser-default" value={this.state.hora} onChange={this.handlerHora}>
                                        {horas}
                                    </select>
                                </div>
                                <div className="col s2">
                                    <label>Minutos</label>
                                    <select className="browser-default" value={this.state.minuto} onChange={this.handlerMinuto}>
                                        {minutos}
                                    </select>
                                </div>
                                <div className="col s3">
                                    <label>Repetir</label>
                                    <select className="browser-default" value={this.state.repetir} onChange={this.handlerRepetir}>
                                        {repetir}
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="modal-close waves-effect waves-green btn-flat" onClick={this.guardar}>Guardar</button>
                    <button type="button" className="modal-action modal-close waves-effect waves-green btn-flat">Cerrar</button>
                </div>
            </div>
        );
    }
});

module.exports = NuevaTarea;