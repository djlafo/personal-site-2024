import SettingsInputs from './SettingsInputs';
import { LocationDataFn } from './types';

interface WeatherSettingsTypes {
    zip?: string;
    coords?: string;
    onLocationChange: LocationDataFn;
}

export default function WeatherSettings({onLocationChange, zip, coords} : WeatherSettingsTypes) {
    return <div className='settings'>
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
        <SettingsInputs zip={zip} coords={coords} onLocationChange={onLocationChange}/>
    </div>;
}