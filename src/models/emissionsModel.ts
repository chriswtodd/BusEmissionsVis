export type Emissions = {
    avgDistance: number;
    avgSpeed: number;
    avgTime: number;
    carCo2Equiv: number;
    co: number;
    co2: number;
    date: Date;
    engine_type: string;
    fc: number;
    hc: number;
    nox: number;
    paxKm: string;
    pm: number;
}

export type EmissionsQuery = {
    City: string;
    StartDate: Date;
    EndDate: Date;
    StartTime: string;
    EndTime: string;
}