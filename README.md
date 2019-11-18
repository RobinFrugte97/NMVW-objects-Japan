# Livelink

[Objecten van Japan](https://robinfrugte97.github.io/functional-programming/public/index.html)

# Functional programming

The goal of this course is to use d3 to clean data and make a dynamic representation (data visualisarion); data is functionally transformed to a visualisation of museum objects from [NMVW](http://collectie.wereldculturen.nl/).
More about functional programming can be found in my [wiki](https://github.com/RobinFrugte97/functional-programming/wiki/Functional-programming).


# Concept

![](https://github.com/RobinFrugte97/functional-programming/raw/master/src/images/screenshotEveryObject.png)

My concept is about showing object images on a chart. The museum has a lot of different objects from all over the world. I liked the idea of plotting the objects on a map. I decided to focus specifically on Japan, because Japan has a lot of interesting objects. I want to use the coordinates of each object to plot them on a map of Japan.


# Wiki

My progress, experiments, thoughts and code snippets can be found in my [wiki](https://github.com/RobinFrugte97/functional-programming/wiki/Functional-programming). My wiki consists of a more detailed page about my [concept](https://github.com/RobinFrugte97/functional-programming/wiki/Concept), a [daily progression](https://github.com/RobinFrugte97/functional-programming/wiki/Daily-progress) page which discribes what's going on day-to-day. There is a page dedicated to [functional programming](https://github.com/RobinFrugte97/functional-programming/wiki/Functional-programming), where I describe what functional programming is about and some examples from tutorials. I also describe some of my [experiments](https://github.com/RobinFrugte97/functional-programming/wiki/Experiments) throughout the project. I have also practised with [cleaning data in a functional manner](https://github.com/RobinFrugte97/functional-programming/wiki/Datacleaning).

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
- Object name
- The date the object was created
- The geographic location in longitude and latitude
- The place name the object originates from
- The image of the object

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
	
	SELECT ?cho ?printName ?placeName ?printImage ?date ?lat ?long WHERE {
  		<https://hdl.handle.net/20.500.11840/termmaster6917> skos:narrower* ?place .
	    ?place skos:prefLabel ?placeName .
  		?place skos:exactMatch/wgs84:lat ?lat .
  		?place skos:exactMatch/wgs84:long ?long .
  		?place skos:exactMatch/gn:parentCountry ?land .

	   ?cho dc:title ?printName ;
	        dc:type ?type ;
	        dct:spatial ?place ;
	        edm:isShownBy ?printImage ;
  			dct:created ?date .
	}
```
### Original data

![](https://github.com/RobinFrugte97/functional-programming/raw/master/src/images/oldData.jpg)

This is the original data I'm getting from the SPARQL query. It's already pretty clean and almost ready for use. As you can see the data is nested in an object. This is something I will change. The geographic coordinates latitude and longitude come as type `string`. If I want to plot these coordinates I will have to change them to type `number`.


![](https://github.com/RobinFrugte97/functional-programming/raw/master/src/images/newData.jpg)

This is the data how I'm using it in my application after doing a small bit of cleaning. As you can see the nested data is gone and the coordinates are `number`'s. 

---
## Acknowledgements

- [NMVW](http://collectie.wereldculturen.nl/), for giving us the opportunity to work with their data,
- [Fun Fun Function](https://www.youtube.com/channel/UCO1cgjhGzsSYb1rsB4bFe4Q), for his course on functional programming,
- [Kris Kuiper](https://github.com/kriskuiper/Functional-Programming-In-JavaScript), for his useful documentation of functional programming,
- [d3 wiki](https://github.com/d3/d3/wiki), for helping me understand what d3 functions I need to use for my application.