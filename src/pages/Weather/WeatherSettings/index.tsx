import { useState } from 'react';

import { LocationDataFn } from './types';


interface WeatherSettingsTypes {
    zip?: string;
    coords?: string;
    onLocationChange: LocationDataFn;
    readOnly?: boolean;
}

const PopupInfo = () => <>
    <h2>
        Weather Settings
    </h2>
    <p>
        - UV is only available for current date due to API constraint.  Multiplied by 10 for visibility.<br/>
        - Zip code table obtained from <a href='https://simplemaps.com/data/us-zips' target='_blank' rel='noreferrer'>simplemaps</a><br/>
        <br/>
        0-20 low<br/>
        30-50 moderate<br/>
        60-70 high<br/>
        80-100 very high<br/>
    </p>
</>;

export default function WeatherSettings({onLocationChange, zip, coords, readOnly} : WeatherSettingsTypes) {
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

    return <div className='settings'>
        <PopupInfo/>
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
                    readOnly={readOnly}/>
                <input type='button' 
                    value='Get by Coordinates' 
                    onClick={() => onLocationChange({coords: _coords})}
                    readOnly={readOnly}/>
                <input type='button' 
                    value={'Autoget Coordinates'} 
                    onClick={() => onLocationChange({auto: true})} 
                    readOnly={readOnly}/>
            </div>
        </div>
    </div>;
}