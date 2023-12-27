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
    nuevoGasto(gasto){
        this.gastos=[...this.gastos,gasto]
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
    mostrarGasto(gastos){
       this.limpiarHtml();
       gastos.forEach(gasto => {
            const {cantidad,nombre,id}=gasto;

            const li=document.createElement("li");
            li.className="list-gruop-item d-flex justify-content-between align-items-center";
            li.dataset.id=id;

            const spanNombre=document.createElement("span");
            spanNombre.textContent=nombre;

            const spanCantidad =document.createElement("span");
            spanCantidad.textContent=cantidad;
            spanCantidad.classList.add("badge","badge-primary","badge-pill","ml-2");

            const btnBorrar=document.createElement("button");
            btnBorrar.textContent="Borrar";
            btnBorrar.className="btn btn-danger borrar-gasto";
            
            li.appendChild(spanNombre);
            li.appendChild(spanCantidad);
            li.appendChild(btnBorrar);

            gastosListado.appendChild(li);
       });
    }
    limpiarHtml(){
        while(gastosListado.firstChild){
            gastosListado.removeChild(gastosListado.firstChild);
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
    // creando un objecto con los valores de los inputs
    const gasto ={nombre,cantidad,id:Date.now()};
    //pasar el objecto a la clase de presupuesto
    presupuesto.nuevoGasto(gasto);
    //mostrar mensaje de gasto agregado
    ui.mostrarMensaje("Gasto agregado");
    //resetear el formulario
    formulario.reset();

    const {gastos} =presupuesto;
    //pasando el arreglo de gastos de la clase Presupuesto a la clase de UI
    ui.mostrarGasto(gastos);
}