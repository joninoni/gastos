const formulario = document.getElementById('agregar-gasto');
const gastosListado = document.querySelector('#gastos ul');
const primario =document.querySelector(".primario");
const regex = /^\d+(\.)?\d*$/;


// Eventos
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener("submit",validandoFormulario);
}
//Classes
class Presupuesto {
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto),
        this.restante = Number(presupuesto),
        this.gastos =[]
    }
}

class UI{
    mostrarPresupuesto(cantidad){
        const {presupuesto,restante}=cantidad;
        document.querySelector("#total").textContent=presupuesto;
        document.querySelector("#restante").textContent=restante;
    }
    mostrarMensaje(mensaje,tipo){
        const alerta=primario.querySelector(".alert");
        if(alerta === null){
            const divError=document.createElement("div");
            divError.classList.add("text-center","alert");        
            if(tipo ==="error"){
                divError.classList.add("alert-danger");
            }
            else{
                divError.classList.add("alert-success");
            }
            divError.textContent=mensaje;
            //insertando el mensaje
            
            primario.insertBefore(divError,formulario);
    
            setTimeout(() => {
                //eliminando al mensaje
                divError.remove();
            }, 3000);
        }  
    }
}

let presupuesto;
const ui = new UI;

//Funciones
function preguntarPresupuesto(){
    // const presupuestoUsuario =  Number(prompt('¿Cual es tu presupuesto?'));
    const presupuestoUsuario = 50;
    // if(presupuestoUsuario === ''||presupuestoUsuario === null||isNaN(presupuestoUsuario)||presupuestoUsuario<=0){
    //     window.location.reload();
    // }
    presupuesto = new Presupuesto(presupuestoUsuario);
    ui.mostrarPresupuesto(presupuesto);
}
function validandoFormulario(e){
    e.preventDefault();
    const nombre = document.querySelector("#gasto").value;
    const cantidad = document.querySelector("#cantidad").value;
    if (nombre ===""  || cantidad ==="") {
            ui.mostrarMensaje("No puede haber campos vacios","error");
            return;
    }
    if(cantidad <=0 || isNaN(cantidad)){
            ui.mostrarMensaje("Cantidad no valida","error");
            return
    }
    if(regex.test(nombre)){
        ui.mostrarMensaje("gasto no valido","error")
        return;
    }
    
}