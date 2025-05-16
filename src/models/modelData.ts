interface ModelData 
{
    EngineColours: { [key:string]: string };
    EngineTypes: { [key:string]: string };
    EmissionTypeUi: { [key:string]: string };
}

let modelData: ModelData = {
    EngineColours: {
        "ELECTRIC": "#3cc0fd",
        "EURO6": "#a3f383",
        "EURO5": "#e2f750",
        "EURO4": "#fdad0f",
        "EURO3": "#717C71",
        "EURO2": "#4F4537",
        "EURO1": "#292121",
        "PRE-EURO": "#ff0000"
    },

    EngineTypes: {
        "PRE-EURO": "PRE-EURO",
        "EURO1": "EURO1",
        "EURO2": "EURO2",
        "EURO3": "EURO3",
        "EURO4": "EURO4",
        "EURO5": "EURO5",
        "EURO6": "EURO6",
        "ELECTRIC": "ELECTRIC",
    },

    EmissionTypeUi: {
        "Average Distance": "Average Distance",
        "Average Speed": "Average Speed",
        "Average Time": "Average Time",
        "CO2": "CO2", 
        "CO": "CO", 
        "Fuel Consumption": "Fuel Consumption",
        "Hydro Carbons": "Hydro Carbons", 
        "Nitrogen Oxide": "Nitrogen Oxide", 
        "Particulate Matter": "Particulate Matter", 
        "Passenger Km": "Passenger Km",
        "Trips": "Trips"
    }
}

module.exports = modelData;