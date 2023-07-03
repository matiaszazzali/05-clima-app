import 'inquirer';
import 'colors';
import inquirer from 'inquirer';

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: 'Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Buscar Ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`
            },
        ]

    }
];


const inquirerMenu = async() => {

    console.clear();
    console.log('======================='.green);
    console.log('Seleccione una opción'.gray);
    console.log('=======================\n'.green);


    const { opcion } = await inquirer.prompt(preguntas);

    return opcion;
}

const pausa = async() => {
    
    
    const pauseText = [
        {
            type: "input",
            name: "input",
            message: `Presiona ${'ENTER'.green} para continuar.`
        }
    ]

    console.log("\n")
    await inquirer.prompt(pauseText);
}


const leerInput = async( message ) => {

    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ) {
                if( value.length == 0){
                    return 'Por favor ingrese un valor'
                }
                return true;
            }

        }
    ]

    const {desc} = await inquirer.prompt(question);

    return desc;
}

const listarLugares = async( lugares = [] ) => {

    const choices = lugares.map( (lugar, idx) => {

        let idxStr = `${idx+1}.`.green;
        return {
            value: lugar.id,
            name: `${idxStr} ${lugar.nombre}`
        }
    });

    choices.unshift({
        value: '0',
        name: '0.'.green + ' Cancelar'
    });

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar',
            choices
        }
    ]
    const { id } = await inquirer.prompt(preguntas);

    return id;
}

const confirmar = async( mensaje ) => {

    const pregunta = [
        {
            type: 'confirm',
            name: 'ok',
            message: mensaje
        }
    ]

    const {ok} = await inquirer.prompt(pregunta);

    return ok;

}

const mostrarListadoChecklist = async( tareas = [] ) => {

    const choices = tareas.map( (tarea, idx) => {

        let idxStr = `${idx+1}.`.green;
        return {
            value: tarea.id,
            name: `${idxStr} ${tarea.desc}`,
            checked: (tarea.completadoEn) ? true : false
        }
    });


    const preguntas = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Seleccione',
            choices
        }
    ]
    const { ids } = await inquirer.prompt(preguntas);

    return ids;
}

export {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoChecklist
}