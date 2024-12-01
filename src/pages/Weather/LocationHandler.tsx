import { useState } from "react";
import { LocationData, LocationDataReq } from "./WeatherSettings/types";
import { getCoordsFromZip, getZipFromCoords } from "../../helpers/location";

/* HELPERS */
const grabOther = async ({zip, coords} : LocationData) => {
    return new Promise<LocationDataReq>((acc, rej) => {
        if(!zip && coords) {
            getZipFromCoords(coords).then(z => {
                acc({zip: z, coords: coords});
            }).catch(e => rej(e));
        } else if (zip && !coords) {
            getCoordsFromZip(zip).then(c => {
                acc({zip: zip, coords: c});
            }).catch(e => rej(e));
        } else {
            rej(new Error('Invalid parameters'));
        }
    });
};

const urlParams = new URLSearchParams(window.location.search);

const getParam = (s : string) => {
    return urlParams.get(s) || localStorage.getItem(s) || undefined;
}


type locationReturn = [string | undefined, string | undefined, (ld: LocationData) => Promise<void>];

export default function useLocationHandler() : locationReturn {
    const [zip, setZip] = useState(getParam('zip'));
    const [coords, setCoords] = useState(getParam('coords'));

    const setLocation = (ld : LocationData) => {
        return grabOther(ld).then(ldFull => {
            setZip(ldFull.zip);
            setCoords(ldFull.coords);
        });
    }

    if(zip && coords) {
        localStorage.setItem('zip', zip);
        localStorage.setItem('coords', coords);
        window.history.replaceState(null, '', `?coords=${coords}&zip=${zip}`);
    }

    return [zip,coords,setLocation];
}