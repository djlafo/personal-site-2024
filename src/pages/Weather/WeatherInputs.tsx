import React, { useState} from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getCoordsFromZip, getZipFromCoords } from './zipcodes';

interface WeatherInputProps {
    initialCoords: string;
    initialZIP: string;
    doReload: (c : string, z : string) => void;
}

export default function WeatherInputs({ initialZIP, initialCoords, doReload } : WeatherInputProps) {
    const [zip, setZip] = useState<string>(initialZIP);
    const [coords, setCoords] = useState<string>(initialCoords);
    const [grabbing, setGrabbing] = useState(false);

    const [previousInitial, setPreviousInitial] = useState(initialZIP);

    if(previousInitial !== initialZIP) {
        setPreviousInitial(initialZIP);
        setZip(initialZIP);
    }

    const grabCoords = () => {
        if ("geolocation" in navigator) {
            setGrabbing(true);
            navigator.geolocation.getCurrentPosition(p => {
                setGrabbing(false);
                toast('Grabbed coordinates');
                setUrlParams({ c: `${p.coords.latitude},${p.coords.longitude}`});
            }, e => {
                setGrabbing(false);
                toast.error(e.message);
            }, {
                maximumAge: 60000,
                timeout: 5000,
                enableHighAccuracy: false
            });
        }
    };

    const setUrlParams = ({ z, c } : { z?: string, c?: string}) => {
        const setCoordsParam = (c2 : string, z2: string) => {
            window.history.replaceState(null, '', `?coords=${c2.replaceAll(' ', '')}zip=${z2}`);
            doReload(c2, z2);
        };
        if(!c && z) {
            getCoordsFromZip(z).then(c3 => {
                setCoordsParam(c3, z);
                setCoords(c3);
            }).catch(e => toast(e.message));
        } else if (c) {
            const sp = c.replaceAll(' ', '').split(',');
            if(sp.length !== 2) {
                toast('Incorrect coordinates: numbers not divided by ,');
            } else {
                getZipFromCoords(Number(sp[0]), Number(sp[1])).then(z3 => {
                    setCoordsParam(c, z3);
                    setZip(z3);
                    toast(`Set ZIP to ${z3}`);
                }).catch(e => toast(e.message));
            }
        }
    };

    return <div>
        ZIP: <input type='textbox' value={zip} onChange={e => setZip(e.target.value)}/><br/>
        Coordinates: <input type='textbox' value={coords} onChange={e => setCoords(e.target.value)}/><br/>
        <div className='weather-input-buttons'>
            <input type='button' value='Get by ZIP' onClick={() => setUrlParams({z: zip})}/>
            <input type='button' value='Get by Coordinates' onClick={() => setUrlParams({c: coords})}/>
            <input type='button' value={grabbing ? 'Trying to grab coordinates...' : 'Autoget Coordinates'} readOnly={grabbing} onClick={() => grabCoords()}/>
        </div>
    </div>;
}
