import React, { useState, useReducer, useContext, useEffect, Component } from 'react';
import './App.css';
import RuutuCtx from "./RuutuCtx.js";
import { store } from './store.js';
import io from 'socket.io-client';



const socket = io.connect(`http://localhost:8000`);




const Pelitila = {

    NIMI_MUUTTUI: 'NIMI_MUUTTUI',
    ALOITA_PAINETTU: 'ALOITA_PAINETTU',
    RUUTU_VALITTU: 'RUUTU_VALITTU',
    PELI_OHI: 'PELI_OHI',
    PELI_KÄYNNISSÄ: 'PELI_KÄYNNISSÄ'
}

const App6 = () => {

    const globalState = useContext(store);
    const { dispatch, state } = globalState;
    const [message, setMessage] = useState("")
    const [minunVuoro, setMinunVuoro] = useState(false)
    const [vastustajanSiirto, setVastustajansiirto] = useState("")
    const [peliMerkki, setPeliMerkki] = useState("X")


    socket.on('PELAAJAT_VALMIINA', (data) => {
        console.log("Pelaajat valmiina: ", data.peliKäynnissä)
        let v = "Odotetaan että " + data.vastustaja + " tekee siirtonsa."
        setVastustajansiirto(v)
        dispatch({ type: Pelitila.PELI_KÄYNNISSÄ, data: peliMerkki })
        setMinunVuoro(data.sinunVuoro)
        if (data.sinunVuoro === false) {
            setMessage(v)
        } else {
            setMessage("Tee siirtosi.")
        }
    })

    socket.on('PELI_OHI', (data) => {
        if (data.voitit && data.tulos === "voitto") {
            setMessage("Sinä voitit!")
        } else if (!data.voitit && data.tulos === "voitto") {
            setMessage("Sinä hävisit! Voittaja on " + data.voittaja + "!")
        } else {
            setMessage("Tasapeli!")
        }
        setMinunVuoro(false)
    })


    socket.on('VUORO_PELATTU', (data2) => {
        console.log("Vuoro pelattu: ", data2)
        dispatch({ type: Pelitila.VASTUSTAJAN_SIIRTO, data: data2.indeksi })
        setMessage("Tee siirtosi.")
        setMinunVuoro(true)
    })

    const nimiOMuuttui = (tapahtuma) => {
        dispatch({ type: Pelitila.NIMI_MUUTTUI, data: tapahtuma.target.value })
    }
    const aloitaNappiPainettu = () => {
        setMessage("Odotetaan toista pelaajaa")
        socket.emit('ALOITA_PAINETTU', { pelaaja: state.pelaaja })
    }
    const ruutuValittu = (indeksi) => {
        if (minunVuoro) {
            console.log("indeksi: " + indeksi)
            socket.emit('RUUTU_PAINETTU', { indeksi: indeksi })
            dispatch({ type: Pelitila.RUUTU_VALITTU, data: indeksi })
            setMessage(vastustajanSiirto)
            setMinunVuoro(false)
        }
    }

    const merkki = (val) => {        
        setPeliMerkki(val)
    }

    return (<div className="App">
        <header className="App-header">

            <br></br>{!state.peliKäynnissä && <div>
                {message === "" ? <div className="App-header">

                    {/* {(state.pelaaja !== "") && <div>Kirjoita pidempi nimi!</div>} */}
                    Anna nimi:<input type="text" value={state.pelaaja} onChange={(event) => nimiOMuuttui(event)} ></input>
                    <br></br>
                    <label for="merkki">Valitse pelimerkki:</label>
                   {/*  <Select defaultValue={{value: "X", label: "X"}} id="merkki" value={peliMerkki} options={options} /> */}                   
                    <select name="merkki" id="merkki" onChange={(event) => merkki(event.target.value)}>
                        <option value="X">X</option>
                        <option value="O">O</option>                        
                    </select>
                    <br></br>
                    <br></br> 
                    <button onClick={aloitaNappiPainettu}>Aloita peli</button>
                </div>
                    : <div>{message}</div>}</div>}
            <br></br>
            {state.peliKäynnissä && <div>
                {message !== "" && <div>{message}</div>}
                <div className="ristinollapeli"  >
                    {state.peliKäynnissä && state.pelilauta.map(alkio => <RuutuCtx ruutuValittu={ruutuValittu} ruuduntila={alkio} />)}

                </div>
                {/* {state.voittaja != -1 && "Voittaja on " + state.pelaajat[state.voittaja]} */} </div>}

        </header>
    </div>)

}
export default App6
