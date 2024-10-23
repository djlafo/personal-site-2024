import { useState } from 'react';
import useLocationHandler from './LocationHandler';

/* 3rd PARTY COMPONENTS */
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/* COMPONENTS */
import { Modal, Page } from '../../components';

/* SETTINGS */
import WeatherSettings from './WeatherSettings';

/* TYPES */
import { LocationData } from './WeatherSettings/types';

/* WEATHER */
import WeeklyWeather from './WeeklyWeather';

import './weather.css';




/* COMPONENT */
export default function Weather() {
    const [settingsOpened, setSettingsOpened] = useState(false);
    const [settingsCloseFlag, setSettingsCloseFlag] = useState(false);
    const [zip,coords,locationHandler] = useLocationHandler(e => {
        toast(e.message);
    });

    if ((!zip || !coords) && !settingsOpened) {
        setSettingsOpened(true);
    } else if (zip && coords && settingsOpened && settingsCloseFlag) {
        setSettingsCloseFlag(false);
        setSettingsOpened(false);
    }

    const locationHandlerProx = (ld: LocationData) => {
        setSettingsCloseFlag(true);
        locationHandler(ld);
    }

    return <Page>
        <div className='weather'>
            <ToastContainer />
            <Modal onClose={() => setSettingsOpened(false)} 
                styleOne
                opened={settingsOpened}>
                <WeatherSettings zip={zip} 
                    coords={coords} 
                    onLocationChange={locationHandlerProx}/>
            </Modal>

            <WeeklyWeather zip={zip} coords={coords}/>

            <input type='button' 
                value='Settings'
                onClick={() => setSettingsOpened(true)}/>
        </div>
    </Page>;
}