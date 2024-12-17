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
    const [zip,coords,locationHandler] = useLocationHandler();
    const [settingsOpened, setSettingsOpened] = useState(!zip && !coords);
    const [loading, setLoading] = useState(false);
    const [errorMessages, setErrorMessages] = useState('');

    const locationHandlerProx = (ld : LocationData) => {
        setLoading(true);
        locationHandler(ld).then((ldTwo : LocationData) => {
            toast(`Loading ${ldTwo.zip}...`);
            setSettingsOpened(false);
        }).catch(e => {
            showError(e);
        }).finally(() => setLoading(false));
    }

    const showError = (e : any) => {
        setErrorMessages(em => `${em}${e.message || e}\n${e.stack}\n\n`);
        toast(e.message || e);
    }

    return <Page>
        <div className='weather'>
            <ToastContainer />
            <Modal onClose={() => setSettingsOpened(false)} 
                styleOne
                opened={settingsOpened}>
                <WeatherSettings zip={zip} 
                    coords={coords} 
                    onLocationChange={locationHandlerProx}
                    readOnly={loading}/>
            </Modal>

            <WeeklyWeather zip={zip} coords={coords} onError={showError}/>

            <input type='button' 
                value='Settings'
                onClick={() => setSettingsOpened(true)}/>

            {errorMessages && <textarea readOnly rows={7} value={errorMessages}/>}
        </div>
    </Page>;
}