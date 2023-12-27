const formulario = document.getElementById('agregar-gasto');
const gastosListado = document.querySelector('#gastos ul');

// Eventos
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
}
//Classes
class Presupuesto {
    constructor(presupuesto){
        this.presupuesto = presupuesto,
        this.restante = presupuesto,
        this.gastos =[]
    }
    
}

class UI{
    mostrarPresupuesto(cantidad){
        const {presupuesto,restante}=cantidad;

        document.querySelector("#total").textContent=presupuesto;
        document.querySelector("#restante").textContent=restante;
    }
}

let presupuesto;
const ui = new UI;

//Funciones
function preguntarPresupuesto(){
    const presupuestoUsuario =  Number(prompt('¿Cual es tu presupuesto?'));
    
    if(presupuestoUsuario === ''||presupuestoUsuario === null||isNaN(presupuestoUsuario)||presupuestoUsuario<=0){
        window.location.reload();
    }
    presupuesto = new Presupuesto(presupuestoUsuario);
    ui.mostrarPresupuesto(presupuesto);
}
