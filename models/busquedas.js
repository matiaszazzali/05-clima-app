import fs from "fs";

import axios from "axios";


class Busquedas {

    historial = [];
    dbPath = './db/database.json'

    constructor() {
        this.leerDB();
    }

    get historialCapitalizado(){
        // capitalizar cada palabra
        // const historialCap = [];
        // this.historial.forEach( lugar => {
        //     const arr = lugar.split(" ");
        //     for (var i = 0; i < arr.length; i++) {
        //         arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        //     }
        //     const lugarCap = arr.join(" ");
        //     historialCap.push(lugarCap);
        // })
        // return historialCap;

        return this.historial.map( lugar => {
            let palabras = lugar.split(" ") ;
            palabras = palabras.map( p => p.charAt(0).toUpperCase() + p.slice(1))
            return palabras.join(' ');
        })

    }
    get paramsMapbox(){
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language':'es'
        };
    }

    get paramsOpenWeather(){
        return {
            'appid':process.env.OPEN_WEATHER_KEY,
            'units':"metric",
            'lang':"es"
        }
    }

    async ciudad( lugar = '') {

        try {

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });


            const resp = await instance.get();
            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }))
        } catch (error) {
            throw error;
        }
    }

    async climaLugar( lat, lon){
        try {
            

            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsOpenWeather, lat, lon}
            })

            const resp = await instance.get();
            const {weather, main} = resp.data;

            return {
                desc: weather[0].description,
                min: main.temp_min, 
                max: main.temp_max, 
                temp: main.temp 

            }

        } catch (error) {
            console.log(error)
        }
    }

    agregarHistorial( lugar=''){

        // todo prevenir duplicados

        if (this.historial.includes(lugar.toLowerCase())) {
            return;
        }

        this.historial.unshift(lugar.toLocaleLowerCase());
        this.guardarDB()
        

    }

    guardarDB(){
        const payload = {
            historial: this.historial
        };
        fs.writeFileSync(this.dbPath,JSON.stringify(payload));
    }

    leerDB(){
        
        // debe existir
        if (!fs.existsSync(this.dbPath)) {
            return null;
        }
        
        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
        const data = JSON.parse(info);


        this.historial = data.historial;


    }
}



export {
    Busquedas
}