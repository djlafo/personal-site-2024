import { useState } from 'react';

import { LocationDataFn } from './types';
import { getBrowserCoordinates } from '../../../helpers/location';

import { toast } from 'react-toastify';


export interface SettingsInputTypes {
    zip?: string;
    coords?: string;
    onLocationChange: LocationDataFn;
}

export default function SettingsInputs({zip, coords, onLocationChange} : SettingsInputTypes) {
    const [lastZip, setLastZip] = useState(zip);
    const [lastCoords, setLastCoords] = useState(coords);
    const [_zip, setZip] = useState(zip || '');
    const [_coords, setCoords] = useState(coords || '');
    if(zip !== lastZip) {
        setLastZip(zip);
        setZip(zip || '');
    }
    if(coords && coords !== lastCoords) {
        setLastCoords(coords);
        setCoords(coords || '');
    }

    const [locating, setLocating] = useState(false);

    const grabCoords = () => {
        setLocating(true);
        getBrowserCoordinates().then(c => {
            setCoords(c);
            onLocationChange({coords: c});
        }).catch(e => {
            toast(e.message || e);
        }).finally(() => {
            setLocating(false);
        });
    };

    return (
        <div className='inputs'>
            <div>
                ZIP: <input type='textbox' value={_zip} onChange={e => setZip(e.target.value)}/>
            </div>
            <div>
                Coordinates: <input type='textbox' value={_coords} onChange={e => setCoords(e.target.value)}/>
            </div>
            <br/>
            <div className='buttons'>
                <input type='button' 
                    value='Get by ZIP' 
                    onClick={() => onLocationChange({zip: _zip})}
                    readOnly={locating}/>
                <input type='button' 
                    value='Get by Coordinates' 
                    onClick={() => onLocationChange({coords: _coords})}
                    readOnly={locating}/>
                <input type='button' 
                    value={locating ? 'Trying to grab coordinates...' : 'Autoget Coordinates'} 
                    onClick={() => grabCoords()} 
                    readOnly={locating}/>
            </div>
        </div>
    );
}