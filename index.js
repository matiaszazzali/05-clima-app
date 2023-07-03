
import 'dotenv/config'

import {inquirerMenu, leerInput, pausa, listarLugares} from "./helpers/inquirer.js"
import { Busquedas } from "./models/busquedas.js";

const main = async() => {

    const busquedas = new Busquedas();
    let opt;

    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                // input de la persona
                const userInput = await leerInput('Ciudad: ')
                
                // mostrar lugares
                const lugares = await busquedas.ciudad(userInput);
                
                // selección del lugar
                const idSeleccionado = await listarLugares(lugares);
                const lugarSeleccionado = lugares.find( l => l.id == idSeleccionado);

                if (idSeleccionado==0) continue;

                // guardar DB
                busquedas.agregarHistorial(lugarSeleccionado.nombre);

                // mostrar datos Clima
                const clima = await busquedas.climaLugar(lugarSeleccionado.lat,lugarSeleccionado.lng);

                
                console.log('\nInformación de la ciudad\n'.green)
                console.log('Ciudad: ',lugarSeleccionado.nombre)
                console.log('Lat: ',lugarSeleccionado.lat)
                console.log('Lng: ',lugarSeleccionado.lng)
                console.log('Temperatura: ',clima.temp)
                console.log('Mínima: ',clima.max)
                console.log('Máxima: ',clima.min)
                console.log('Cómo está el clima: ',clima.desc)

                break;
                case 2:
                    console.log("Historial de búsquedas");

                    busquedas.historialCapitalizado.forEach( (lugar, i) => {
                        const idx = `${i + 1}.`.green;
                        console.log(`${idx} ${lugar}`);
                    })
                    break;
            default:
                break;
        }

        if (opt!=0) await pausa();
    } while (opt!=0);
}

main();