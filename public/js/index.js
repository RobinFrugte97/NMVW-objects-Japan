import { drawVis } from './modules/drawVis.js' 
import { fetchData } from './modules/fetchData.js'


const chartLocation = "../src/japan.json"
const queryUrl = "https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-08/sparql"
const query = `
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
	PREFIX dc: <http://purl.org/dc/elements/1.1/>
	PREFIX dct: <http://purl.org/dc/terms/>
	PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
	PREFIX edm: <http://www.europeana.eu/schemas/edm/>
	PREFIX foaf: <http://xmlns.com/foaf/0.1/>
	PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>
	PREFIX gn: <http://www.geonames.org/ontology#>
		
	SELECT ?provinceName ?cityName ?latCity ?longCity ?latProv ?longProv (COUNT(?cho)AS ?choCount) WHERE {
			# Follow the database relations to navigate down to city level in Japan.
			<https://hdl.handle.net/20.500.11840/termmaster6917> skos:narrower ?region .
			?region skos:narrower ?province .
			?province skos:prefLabel ?provinceName .
			?region skos:prefLabel ?regionName .
			?province skos:narrower ?city .
			?city skos:prefLabel ?cityName .
	
			# Get the geolocation of both the provinces and the cities in Japan.
			?province skos:exactMatch/wgs84:lat ?latProv .
			?province skos:exactMatch/wgs84:long ?longProv .    	
			?city skos:exactMatch/wgs84:lat ?latCity .
			?city skos:exactMatch/wgs84:long ?longCity .
			
			# Get any object as long as it originates from one of the cities.
			?cho ?b ?c .
			?cho dct:spatial ?city .
			
	} ORDER BY ?provinceName`
		
runVis()

function runVis() {
	const data = fetchData(queryUrl, query)
	data.then(console.log(data))
	
	drawVis(chartLocation, data)
}