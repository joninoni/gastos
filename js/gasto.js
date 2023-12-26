const formulario = document.getElementById('agregar-gasto');
const gastosListado = document.querySelector('#gastos ul');

// Eventos
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
}
//Classes

//Funciones
function preguntarPresupuesto(){
    const presupuestoUsuario =  Number(prompt('¿Cual es tu presupuesto?'));
    
    if(presupuestoUsuario === ''||presupuestoUsuario === null||isNaN(presupuestoUsuario)||presupuestoUsuario<=0){
        window.location.reload();
    }
}