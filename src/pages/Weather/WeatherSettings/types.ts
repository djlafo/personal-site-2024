export interface LocationData {
    zip?: string;
    coords?: string;
}

export interface LocationDataReq {
    zip: string;
    coords: string;
}

export type LocationDataFn = ({zip, coords} : LocationData) => void;
