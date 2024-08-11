import React, { useState} from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getCoordsFromZip } from './zipcodes';

interface WeatherInputProps {
    initialCoords: string;
    initialZIP: string;
    urlParams: URLSearchParams;
}

export default function WeatherInputs({ initialZIP, initialCoords, urlParams } : WeatherInputProps) {
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
        const setCoordsParam = (c2 : string) => {
            urlParams.set('coords', c2.replaceAll(' ', ''));
            window.location.search = urlParams.toString();
        };
        if(!c && z) {
            getCoordsFromZip(z).then(c3 => {
                setCoordsParam(c3);
            }).catch(e => toast(e.message));
        } else if (c) {
            setCoordsParam(c);
        }
    };

    return <div>
        ZIP: <input type='textbox' value={zip} onChange={e => setZip(e.target.value)}/><br/>
        Coordinates: <input type='textbox' value={coords} onChange={e => setCoords(e.target.value)}/><br/>
        <input className='big-button' type='button' value='Get by ZIP' onClick={() => setUrlParams({z: zip})}/>
        <input className='big-button' type='button' value='Get by Coordinates' onClick={() => setUrlParams({c: coords})}/>
        <input className='big-button' type='button' value={grabbing ? 'Trying to grab coordinates...' : 'Autoget Coordinates'} readOnly={grabbing} onClick={() => grabCoords()}/>
    </div>;
}
