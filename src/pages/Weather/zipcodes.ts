// ../../documents/uszips

import Papa from 'papaparse';

interface CsvRow {
    zip: string;
    lat: string;
    lng: string;
    [key: string]: any;
}

export default async function getZipFromCoord(lat: number, long: number) : Promise<string> {
    return new Promise((acc, rej) => {
        (async() => {
            try {
                const csvRead = await fetch ('./uszips.csv');
                const csvText = await csvRead.text();
                const csv = Papa.parse(csvText, {header: true});
                const closest = csv.data.reduce((d, c) => {
                    if(!d) return c;
                    const csvTyped = c as CsvRow;
                    const dTyped = d as CsvRow;
                    const dist = getDistance(lat, long, Number(csvTyped.lat), Number(csvTyped.lng));
                    const dist2 = getDistance(lat, long, Number(dTyped.lat), Number(dTyped.lng));
                    return dist < dist2 ? c : d; 
                }) as CsvRow;
                acc(closest.zip);
            } catch (e) {
                rej(e);
            }
        })();
    });
}

function deg2rad(deg : number) : number {
    return deg * (Math.PI/180)
}

function getDistance(lat1 : number, lon1 : number, lat2 : number, lon2 : number) : number {
    var R = 3958.8;
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
}