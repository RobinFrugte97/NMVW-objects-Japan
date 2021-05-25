# Livelink

[Objecten van Japan](https://robinfrugte97.github.io/frontend-data/public/index.html)

# Frontend data

The goal of this course is to build an interactive visualisation using D3.
More info can be found in my [wiki](https://github.com/RobinFrugte97/frontend-data/wiki).


# Concept

My concept is about giving people a topographical visualisation of all the objects in Japan. The visualisation is not meant to accurately narrow down which object came from which region, but to give people a general vision.

![](https://raw.githubusercontent.com/RobinFrugte97/frontend-data/master/src/images/fdHome.png)

# D3 update pattern

To create an interactive visualisation, I make use of the update pattern within D3. I reuse existing DOM elements (created in D3) and load different data into them. I add additional elements if needed, and remove any leftover elements after loading new data to visualize. Read more about the D3 update pattern in my [wiki](https://github.com/RobinFrugte97/frontend-data/wiki/D3-Update-pattern).

# Wiki

My progress, experiments, thoughts and code snippets can be found in my [wiki](https://github.com/RobinFrugte97/frontend-data/wiki). My wiki consists of a more detailed page about my [concept](https://github.com/RobinFrugte97/frontend-data/wiki/Concept). There is a page dedicated to [D3 update pattern](https://github.com/RobinFrugte97/frontend-data/wiki/D3-Update-pattern), where I describe what D3 update pattern is about and how I implemented it into my project. I also describe some of my [experiments](https://github.com/RobinFrugte97/frontend-data/wiki/Experiments) throughout the project. I have also practised with [cleaning data with the reduce method](https://github.com/RobinFrugte97/functional-programming/wiki/Datacleaning).

## Get started

Download the project,

Locate `public/index.html` and run it.


## Data

The data I'm using comes from the API of [Netwerk digitaal erfgoed](https://www.netwerkdigitaalerfgoed.nl/), with my unique URL: https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-08/sparql

### NMVW data

The NMVW is a collective of multiple museums. They have a large [collection](http://collectie.wereldculturen.nl/) of items, ranging from Japanese prints from the Edo era to all sorts of clothes from Indonesia. Every object in the collection is documented on their [site](http://collectie.wereldculturen.nl/).

Most items have at least:

- A title or name
- An image showing the object
- A date from when the object originates
- A location from where the object originates
- A discription about the object


### Used data

I'm gathering data about all objects in Japan to then plot them on a map of Japan to see where in Japan most objects originate from.

I'm getting the following data:
- Japanese regions with objects
- The geocoordinates of that region in longitude and latitude
- The total amount of objects within that region
- All underlying cities that have objects
- The geocoordinates of that city in longitude and latitude
- The amount of objects within that city

The SPARQL query I'm using to retrieve the aforementioned data for my application: 

```
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
			
	} ORDER BY ?provinceName
```
### Original data
![](https://raw.githubusercontent.com/RobinFrugte97/frontend-data/master/src/images/dataResult.png)

---
## Acknowledgements

- [NMVW](http://collectie.wereldculturen.nl/), for giving us the opportunity to work with their data,
- [Kris Kuiper](Github.com/kriskuiper), for helping my formulate my data cleaning function.
