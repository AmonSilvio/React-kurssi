// store.js
import React, { createContext, useReducer } from 'react';


const Pelitila = {

    NIMI_MUUTTUI: 'NIMI_MUUTTUI',
    ALOITA_PAINETTU: 'ALOITA_PAINETTU',
    RUUTU_VALITTU: 'RUUTU_VALITTU',
    PELI_OHI: 'PELI_OHI',
    PELI_KÄYNNISSÄ: 'PELI_KÄYNNISSÄ'
}

const nap = {
    pelaaja: "X",
    vastustaja: "O",
    tyhja: " "
};
const initialState = {
    pelilauta:
        [{ nappula: nap.tyhja, paikka: 0 }, { nappula: nap.tyhja, paikka: 1 }, { nappula: nap.tyhja, paikka: 2 },
        { nappula: nap.tyhja, paikka: 3 }, { nappula: nap.tyhja, paikka: 4 }, { nappula: nap.tyhja, paikka: 5 },
        { nappula: nap.tyhja, paikka: 6 }, { nappula: nap.tyhja, paikka: 7 }, { nappula: nap.tyhja, paikka: 8 }],
    tila: Pelitila.NIMET_PUUTTEELLISET, pelaaja: "", pelivuoroX: true, voittaja: -1, peliKäynnissä: false
}


//const initialState = {};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
    const [state, dispatch] = useReducer((state, action) => {

        let kopio = state.pelaaja.slice()


        switch (action.type) {

            case Pelitila.PELI_KÄYNNISSÄ:
                if (action.data === "O") {
                    nap.pelaaja = "O"
                    nap.vastustaja = "X"
                }
                return { ...state, peliKäynnissä: true };

            case Pelitila.NIMI_MUUTTUI:
                kopio = action.data
                return { ...state, pelaaja: kopio };

            case Pelitila.VASTUSTAJAN_SIIRTO:
                let kopio2 = state.pelilauta.slice()
                kopio2[action.data].nappula = nap.vastustaja
                return { ...state, pelilauta: kopio2 }


            case Pelitila.RUUTU_VALITTU:
                if (state.pelilauta[action.data].nappula === " ") {
                    let kopio2 = state.pelilauta.slice()
                    kopio2[action.data].nappula = nap.pelaaja
                    return { ...state, pelilauta: kopio2 }
                }
                return { ...state }

            default:
                throw new Error();
        }
    }, initialState);

    return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider }