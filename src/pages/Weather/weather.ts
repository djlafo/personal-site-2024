interface APIData {                                                                
    properties: {
        periods: Array<OriginalWeatherData>
    };
    [key: string]: any;
}

interface OriginalWeatherData {
    startTime: string,
    temperature: number;
    temperatureUnit: string;
    relativeHumidity: {
        value: number,
        unitCode: string
    };
    probabilityOfPrecipitation: {
        unitCode: string,
        value: number
    };
    windSpeed: string;
    shortForecast: string;
    [key: string]: any;
}

export interface WeatherData {
    time: Date;
    temp: number;
    tempUnit: string;
    humidity: number;
    rainChance: number;
    windSpeed: string;
    desc: string;
    icon: string;
    UV: number | undefined;
}

interface UVAPIData {
    ORDER: number;
    ZIP: string;
    CITY: string;
    STATE: string;
    DATE_TIME: string;
    UV_VALUE: number;
}

const coordinateURL = (coord : string) => `https://api.weather.gov/points/${coord}`;
const uvURL = (zip: string) => `https://data.epa.gov/efservice/getEnvirofactsUVHOURLY/ZIP/${zip}/JSON`;

const findUV = (a : Array<UVAPIData>, d : Date) => {
    return a.find(uv => {
        const day = Number(uv.DATE_TIME.substring(4, 6));
        const time = uv.DATE_TIME.substring(12).split(' ');
        const timeTwentyFour = time[1] === 'PM' ? (time[0] === '12' ? Number(time[0]) : Number(time[0]) + 12) : Number(time[0]);
        return (d.getDate() === day && d.getHours() === timeTwentyFour);
    });
}

export async function getWeather(zip : string, coord : string): Promise<Array<WeatherData>> {
    return new Promise((acc, rej) => {
        (async() => {
            try {
                const coordResp = await fetch(coordinateURL(coord.replaceAll(' ', '')));
                const coordJson = await coordResp.json();
                const hourlyURL = coordJson.properties.forecastHourly;

                type common = {
                    storageKey : string;
                    api: string;
                };

                const fetches : Array<common> = [{
                    storageKey: 'weather',
                    api: hourlyURL
                }, {
                    storageKey: 'uv',
                    api: uvURL(zip)
                }];

                const apiFetch = async function<T>(f : common) : Promise<T> {
                    return new Promise((acc,rej) => {
                        (async() => {
                            const storage = localStorage.getItem(f.storageKey);
                            const date = localStorage.getItem(`${f.storageKey}Date`);
                            let tJson : T;
                            if(storage && date && new Date(date) > new Date()) {
                                tJson = JSON.parse(storage);
                            } else {
                                const response: Response = await fetch(f.api);
                                tJson = await response.json();
                            }
                            const hourAhead = new Date(new Date().setHours(new Date().getHours() + 1)).toUTCString();
                            localStorage.setItem(f.storageKey, JSON.stringify(tJson));
                            localStorage.setItem(`${f.storageKey}Date`, hourAhead);
    
                            acc(tJson);
                        })();
                    });
                }

                const weatherJson : APIData = await apiFetch<APIData>(fetches[0]);
                const uvJson : Array<UVAPIData> = await apiFetch<Array<UVAPIData>>(fetches[1])

                const dataPoints : Array<OriginalWeatherData> = weatherJson.properties.periods;
                const data: Array<WeatherData> = dataPoints.map(e => {
                    const date = new Date(e.startTime);
                    return {
                        time: date,
                        temp: e.temperature,
                        tempUnit: e.temperatureUnit,
                        humidity: e.relativeHumidity.value,
                        rainChance: e.probabilityOfPrecipitation.value,
                        windSpeed: e.windSpeed,
                        desc: e.shortForecast,
                        icon: e.icon,
                        UV: findUV(uvJson, date)?.UV_VALUE
                    };
                });
                acc(data);
            } catch {
                rej();
            }
        })();
    });
}

export function calcHeatIndex(T : number, RH : number) : number {
    let calc = .5 * (T + 61 + ((T-68)*1.2) + (RH*.094));
    calc = (calc + T) / 2;
    if(calc >= 80) {
        calc = -42.379 + 2.04901523*T + 10.14333127*RH - .22475541*T*RH - .00683783*T*T - .05481717*RH*RH + .00122874*T*T*RH + .00085282*T*RH*RH - .00000199*T*T*RH*RH;
        if(RH > 85 && T >= 80 && T <=87) {
            calc -= ((RH-85)/10) * ((87-T)/5);
        }
    }
    return calc;
}

export function calcWetBulb(T: number, RH : number) : number {
    return T * Math.atan(0.151977 * Math.sqrt(RH + 8.313689)) + 0.00391838 * Math.sqrt(RH**3) * Math.atan(0.023101 * RH) - Math.atan(RH - 1.676331) + Math.atan(T + RH) - 4.686035;
}