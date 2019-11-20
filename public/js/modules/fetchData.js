export async function fetchData(queryUrl, query) {
    const res = await fetch(queryUrl + "?query=" + encodeURIComponent(query) + "&format=json")
    const jsonRes = await res.json()
    let data = jsonRes.results.bindings
    data = data.map(cleanData)
    data = reMap(data)
    // data = reMap(data)
    console.log(data[0]);
    
}

function cleanData(row) {
    //Object function Laurens
    let result = []
    Object.entries(row)
    .forEach(([key, propValue]) => {
        result[key] = propValue.value

    })    

    return result
}

function reMap(data) {
    console.log(data);
    let newData = data.reduce((provinces, entry) => {  
        provinces[entry.provinceName] = provinces[entry.provinceName] || [{province: entry.provinceName, cities: [], lat: entry.latProv, long: entry.longProv}]
        provinces[entry.provinceName].push({
            city: entry.cityName,
            cityLat: entry.latCity,
            cityLong: entry.longCity
        })
        return provinces
    }, [])
    console.log(newData["Chûbu regio"][0])
    newData.forEach(region => region.map(regioEntry => {
        if (Object.keys(regioEntry)[0] !== 'province') {
            newData["Chûbu regio"][0].cities.push(regioEntry)
            console.log(regioEntry);
        }
    }))
    // newData = newData.reduce(() => {

    // })
    console.log(newData);
    
    return newData
}