export interface LocationData {
    zip?: string;
    coords?: string;
    auto?: boolean;
}

export interface LocationDataReq {
    zip: string;
    coords: string;
}

export type LocationDataFn = ({zip, coords, auto} : LocationData) => void;
