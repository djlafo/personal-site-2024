import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Page from '../../components/Page';
import MyResponsiveLine, { formatWeatherData, FormattedWeatherDataType } from './WeatherGraph';
import { getWeather, WeatherData } from './weather';
import getZipFromCoord from './zipcodes';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './weather.css';

const days = ['Sun','Mon','Tues','Wed','Thurs','Fri','Sat'];

function Weather() {
    const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);

    const getCoord = useCallback(() => {
        return urlParams.get('coord') || localStorage.getItem('coord') || ''
    }, [urlParams]);

    const [currentAttempt, setCurrentAttempt] = useState(0);
    const [weatherData, setWeatherData] = useState<Array<WeatherData>>([]);
    const [coord, setCoord] = useState<string>(() => getCoord());
    const [grabbing, setGrabbing] = useState(false);


    const setUrlParams = (c : string) => {
        if(coord) {
            const tCoord = c.replaceAll(' ', '').split(',');
            getZipFromCoord(Number(tCoord[0]), Number(tCoord[1])).then(n => {
                urlParams.set('coord', `${tCoord[0]},${tCoord[1]}`);
                window.location.search = urlParams.toString();
            });
        }
    }

    const loadWeather = useCallback((zip: string, coord: string) => {
        setCurrentAttempt(a => a + 1);
        getWeather(zip, coord).then(d => {
            localStorage.setItem('coord', coord);
            window.history.replaceState(null, '', `?coord=${coord}`);
            setWeatherData(d);
        }).catch(r => {
            console.error(r);
            setCurrentAttempt(a => a + 1);
            loadWeather(zip, coord);
        });
    }, []);

    const formattedWeatherData : Array<Array<FormattedWeatherDataType>> = useMemo(() => {
        return formatWeatherData(weatherData);
    }, [weatherData]);

    const getMax = (a: Array<FormattedWeatherDataType>) : string => {
        return a.find(ae => ae.id === 'temp')?.data.reduce((d, c) => d.y > c.y ? d : c).y?.toString() || '';
    }

    const grabCoords = () => {
        if ("geolocation" in navigator) {
            setGrabbing(true);
            navigator.geolocation.getCurrentPosition(p => {
                setGrabbing(false);
                toast('Grabbed coordinates');
                setUrlParams(`${p.coords.latitude},${p.coords.longitude}`);
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

    useEffect(() => {
        const dCoord = getCoord();
        if(dCoord) {
            const dCoordSp = dCoord.replaceAll(' ', '').split(',');
            getZipFromCoord(Number(dCoordSp[0]), Number(dCoordSp[1])).then(n => {
                toast(`ZIP set to ${n}`);
                loadWeather(n, dCoord);
            }).catch(e => console.error(e));
        }
    }, [loadWeather, getCoord]);

    return <Page>
        <div className='weather-page'>
            <ToastContainer />
            <h3>
                - UV is only available for current date due to API constraint.  Multiplied by 10 for visibility.<br/>
                - Zip code table obtained form <a href='https://simplemaps.com/data/us-zips' target='_blank' rel='noreferrer'>https://simplemaps.com/data/us-zips</a><br/>
                <br/>
                0-20 low<br/>
                30-50 moderate<br/>
                60-70 high<br/>
                80-100 very high<br/>
                110+ extreme<br/>
                <br/>
                Coordinates: <input type='textbox' value={coord} onChange={e => setCoord(e.target.value)}/><br/>
                <input className='big-button' type='button' value={grabbing ? 'Trying to grab coordinates...' : 'Autoget Coordinates'} readOnly={grabbing} onClick={() => grabCoords()}/>
                <input className='big-button' type='button' value='Get' onClick={() => setUrlParams(coord)}/>
            </h3>
            <br/>
            {
                (weatherData.length && formattedWeatherData.map(fwd => {
                    return <div key={fwd[0].data[0].x}>
                        <h2>
                            {days[new Date(fwd[0].data[0].x).getDay()]} - Max {getMax(fwd)}
                        </h2>
                        <div className='weather-chart-container'>
                            <div className='weather-chart'>
                                <MyResponsiveLine data={fwd}/>
                            </div>
                        </div>
                    </div>
                })) || null
            }
            {
                !weatherData.length && currentAttempt > 0 && `Attempting to load...attempt ${currentAttempt}`
            }
        </div>
    </Page>;
}


export default Weather;