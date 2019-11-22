export async function fetchData(queryUrl, query) {
    const res = await fetch(queryUrl + "?query=" + encodeURIComponent(query) + "&format=json")
    const jsonRes = await res.json()
    let data = jsonRes.results.bindings
    data = data.map(cleanData)
    return data = reMap(data)
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
    return data.reduce((provinces, entry) => {
        const citiesObject = {
            name: entry.cityName,
            lat: entry.latCity,
            long: entry.longCity,
            objects: Number(entry.choCount)
        }
        const defaultObject = {
            province: entry.provinceName, 
            cities: [citiesObject], 
            lat: entry.latProv, 
            long: entry.longProv,
            totalObjects: citiesObject.objects
        }
        const foundObject = provinces.find(item => {
            return item.province === entry.provinceName
        })
        if (!foundObject) {
            provinces.push(defaultObject)
        } else {
            foundObject.cities.push(citiesObject)
            foundObject.totalObjects += citiesObject.objects
        }

        return provinces
    }, [])
}