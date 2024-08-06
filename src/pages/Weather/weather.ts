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
    icon: string
}

const hourlyURL="https://api.weather.gov/gridpoints/LCH/113,87/forecast/hourly";
// import exampleData from '../example_data.json';

export async function getWeather(): Promise<Array<WeatherData>> {
    return new Promise((acc, rej) => {
        (async() => {
            try {
                const response: Response = await fetch(hourlyURL);
                const json: APIData = await response.json();
                // const json: APIData = exampleData;
                const dataPoints: Array<OriginalWeatherData> = json.properties.periods;
                const data: Array<WeatherData> = dataPoints.map(e => {
                    return {
                        time: new Date(e.startTime), //.toLocaleString('en-US', {timeZone: 'America/Chicago'}) 
                        temp: e.temperature,
                        tempUnit: e.temperatureUnit,
                        humidity: e.relativeHumidity.value,
                        rainChance: e.probabilityOfPrecipitation.value,
                        windSpeed: e.windSpeed,
                        desc: e.shortForecast,
                        icon: e.icon
                    };
                });
                acc(data);
            } catch (e) {
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