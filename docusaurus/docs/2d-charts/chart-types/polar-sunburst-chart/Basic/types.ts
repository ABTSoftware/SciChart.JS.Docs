export type TLevelDataEntry = {
    id: number[];
    start: number;
    end: number;
    name: string;
    backgroundColor: string;
};

export type TElement = {
    name: string;
    value: number;
    backgroundColor: string;
    children?: TElement[];
};

export type TLevelDataForChart = {
    data: number[][];
    metadata: SunburstMetadata[];
};