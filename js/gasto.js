const formulario = document.getElementById('agregar-gasto');
const gastosListado = document.querySelector('#gastos ul');
const primario =document.querySelector(".primario");
const regex = /^\d+(\.)?\d*$/;//solo permite numeros y un punto opcional
let presupuestoUsuario;


// Eventos
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener("submit",validandoFormulario);
    document.addEventListener("DOMContentLoaded",()=>{
        gastos=JSON.parse(localStorage.getItem("gastos"))||[];
        ui.mostrarGasto(gastos);
        const gastado =gastos.reduce((acc,total) => acc + total.cantidad,0);
        presupuestoUsuario =presupuestoUsuario -gastado;
        ui.actualizarRestante(presupuestoUsuario);
    })
}
//Classes
class Presupuesto {
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto),
        this.restante = Number(presupuesto),
        this.gastos =[];
    }
    nuevoGasto(gasto){
        this.gastos=[...this.gastos,gasto]
        this.calcularRestante();
    }
    calcularRestante(){
        const gastado=this.gastos.reduce( (total,gasto) => total + gasto.cantidad,0);
        this.restante =this.presupuesto - gastado;
    }
    eliminandoGasto(id){
        this.gastos=this.gastos.filter(gasto => gasto.id !==id);
        this.calcularRestante();
    }
}

class UI{
    mostrarPresupuesto(cantidad){
        const {presupuesto,restante}=cantidad;
        document.querySelector("#total").textContent=presupuesto;
        document.querySelector("#restante").textContent=restante;
    }
    mostrarMensaje(mensaje,tipo){
        const alerta=primario.querySelector(".alerta");
        if(!alerta){//mientras alerta no exista
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
            btnBorrar.onclick = ()=> {
                eliminarGasto(id);
            }
            
            li.appendChild(spanNombre);
            li.appendChild(spanCantidad);
            li.appendChild(btnBorrar);

            gastosListado.appendChild(li);
       });
        //sincronizando con localStorage
        sincronizarStorage(gastos);
    }
    actualizarRestante(restante){
        document.querySelector("#restante").textContent=restante;
    }
    modificarColor(presupuestoObj){
        const {presupuesto,restante}=presupuestoObj;
        //son para cambiar los colores segun sea el restante
        if((presupuesto/4) > restante){
            document.querySelector(".restante").classList.remove("alert-success", "alert-warning"); 
            document.querySelector(".restante").classList.add("alert-danger");
        }
        else if(presupuesto/2 > restante){
            document.querySelector(".restante").classList.remove("alert-success","alert-danger");
            document.querySelector(".restante").classList.add("alert-warning")
        }
        else{
            document.querySelector(".restante").classList.remove("alerta-danger","alert-warning");   
            document.querySelector(".restante").classList.add("alert-success");
        }
         //para habilitar el boton de submit segun sea el restante
        if(restante >= 0) {
            formulario.querySelector('button[type="submit"]').disabled=false;
        }
        else{
            ui.mostrarMensaje("presupuesto superado","error");
            formulario.querySelector('button[type="submit"]').disabled=true;
        }
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
   
    // if(presupuestoUsuario === ''||presupuestoUsuario === null||isNaN(presupuestoUsuario)||presupuestoUsuario<=0){
    //     window.location.reload();
    // }
    presupuestoUsuario =100;
    presupuesto = new Presupuesto(presupuestoUsuario);
    ui.mostrarPresupuesto(presupuesto);
}

function validandoFormulario(e){
    e.preventDefault();
    const nombre = document.querySelector("#gasto").value;
    const cantidad = Number(document.querySelector("#cantidad").value);
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

    const {gastos,restante} =presupuesto;
    //pasando el arreglo de gastos de la clase Presupuesto a la clase de UI
    ui.mostrarGasto(gastos);//muestra los gastos en el html
    ui.actualizarRestante(restante);
    ui.modificarColor(presupuesto);
}

function eliminarGasto(id){
    // elimina un gasto del objecto
    presupuesto.eliminandoGasto(id);
    const {gastos,restante}=presupuesto;
    //elimina el gasto del html
    ui.mostrarGasto(gastos);
    //rembolsa la cantidad
    ui.actualizarRestante(restante);
    //vuelve a modificar el color segun sea el restante
    ui.modificarColor(presupuesto);
}
function sincronizarStorage(gastos){
    localStorage.setItem("gastos",JSON.stringify(gastos));
}