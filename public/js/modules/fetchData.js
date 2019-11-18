export async function fetchData(queryUrl, query) {
    const res = await fetch(queryUrl + "?query=" + encodeURIComponent(query) + "&format=json")
    const jsonRes = await res.json()
    let data = jsonRes.results.bindings
    return data = data.map(cleanData)
}

function cleanData(row) {
    //Object function Laurens
    let result = []
    Object.entries(row)
        .forEach(([key, propValue]) => {
            result[key] = propValue.value
        })
    result.forEach(entry => {
            entry.lat = parseFloat(entry.lat)
            entry.long = parseFloat(entry.long)
    })
    return result
}