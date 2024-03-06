require("colors");
const { guardarDB } = require("./helpers/guardarArchivo");
const {
  inquirerMenu,
  pausa,
  leerInput,
  listadoBorrarTareas,
  confirmar,
  mostrarListadoChecklist,
} = require("./helpers/inquirer");
const { leerDB } = require("./helpers/guardarArchivo");
const Tareas = require("./models/tareas");

const main = async () => {
  let opt = "";
  const tareas = new Tareas();

  const tareasDB = leerDB();

  if (tareasDB) {
    //establecer tareas
    //TODO : cargar tareas
    tareas.cargarTareasFromArray(tareasDB);
  }

  do {
    //imprimir el menu
    opt = await inquirerMenu();

    switch (opt) {
      case "1":
        //crear opción
        const desc = await leerInput("Descripción:");
        tareas.crearTarea(desc);
        break;
      case "2": //listar todas las tareas
        tareas.listadoCompleto();
        break;
      case "3": //listar completadas
        tareas.listarPendientesCompletadas(true);
        break;
      case "4": //listar pendientes
        tareas.listarPendientesCompletadas(false);
        break;
      case "5": //Completado | Pendiente
        const ids = await mostrarListadoChecklist(tareas.listadoArr);
        tareas.toggleCompletadas(ids);
        break;
      case "6": //borrar
        const id = await listadoBorrarTareas(tareas.listadoArr);
        if (id !== "0") {
          const ok = await confirmar("¿Confirma que desea borrar la tarea?");
          //TODO: preguntar si esta seguro
          if (ok) {
            tareas.borrarTarea(id);
            console.log("Tarea borrada correctamente");
          }
        }
        break;
    }

    guardarDB(tareas.listadoArr);

    await pausa();
  } while (opt !== "0");
};

main();
