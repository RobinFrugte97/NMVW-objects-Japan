let enqueteData = `Gamen, uitgaan
handbal
Tekenen; ukelele spelen; schilderen; koken; bakken; haken; films; video's maken; fotografie
Sporten; muziek luisteren; series kijken; films kijken; met vrienden uithangen
Netflix; Tekenen; Eten
voetbal;muziek;vakantie;strand;vrienden
bier drinken; muziek luisteren; sporten;
Voetbal, Gamen, Design, Schoenen verzamelen
Voetbal; Gamen; Bioscoop;

Series kijken; Sporten; Lezen
pianospelen; films kijken; simsen; voetballen; tennissen; sporten
Honkbal; Auto's; 
Varen; zwemmen; pianospelen; dansen
Muziek maken; muziek produceren; uitgaan met vrienden
Skien, surfen, kitesurfen, wielrennen
voetbal, gezelligheid, kleding
Muziek;Games;
Tekenen; gamen(nintendo); lezen; wandelen;  

Schilderen en winkelen
netflix; festival; shoppen
tennis
Chillen
Lopen
Volleybal; graphic design; basketbal
Reizen; zwemmen; muziek luisteren
vormgeven; gamen; tafeltennis; bioscoop
Graffiti, snowboarden; films kijken; koken; reizen
Gamen; Lezen
rollerskaten;snowboarden;tekenen;tv kijken;drankjes doen
Gamen;
relaxen;hockey;biertjedrinken
Coderen; Tennis; Voetbalwedstrijden analyseren
Tekenen, gamen, lezen, schrijven
Fotografie; plantenverzorging; slapen; festivalbezoeken
Chillen, sporten, uitgaan
gamen; leven
Gamen; Serie kijken; terrass pakken
hockey;netflix;uitgaan
voetballen, feesten
Netflixen, vrienden meeten, reizen
vliegvissen; programmeren; reizen; netflix; dansen; uit gaan; wandelen
eten, bios pakken, muziek luisteren, dansen op festivals, rijden
Fotografie;DJ
Netflix, fitness
Netflix; borrelen; slapen
muziek; slapen; films; chillen
Voetbal
gamen; wandelen; fietsen door mooie gebieden; leuke dingen met vrienden; festival bezoeken; koffie drinken; veel planten verzamelen
voetballen, boxen, tekenen, dansen, zingen
Voetbal;Mountainbiking;Computer-hardware;Handel in technologie;Video-gamen;Meubel-restoraties;Sci-Fi boeken lezen;Japanse cultuur;
Tekenen; muziek maken
slapen, films kijken
Gamen, afspreken met vrienden, uitgaan
Wielrennen; Voetballen; Gitaarspelen
Voetballen;netflixen:fifa
Series kijken ; Muziek luisteren ; Afspreken met mensen ; Festivallen bezoeken ; Lekker eten
gamen; netflix kijken; sporten
Schilderen; computeren
Sporten;computeren
Tekenen; Serie's kijken; Drankje drinken
Series kijken; Tekenen
Films, muziek, games
Fitness; Voetbal; Tennis; Uitgaan; Tekenen
Muziek luisteren en zoeken
Gamen
Hockey
Drummen; Gamen; Chillen
Gamen, karten
tekenen; voetballen 
Zingen; Gitaar spelen; Fotograferen
Basketbal;uitgaan
skateboarden, fotograferen, filmen, drummen
Hobbies zijn voor de delusionals
Gitaar spelen; gamen; waterpolo; wandelen; reizen
Feesten ; borrelen ; netflixen ; vakantie 
Motorrijden;Gamen
Fitness, 
Dichten ; blowen
Games, tekenen, gitaar, muziek maken
Films en series
`
let filterTrash = {
    seperators: [";", " ; ", " ;", ", ",",", ":"],
    trash: ["hobbies zijn voor de delusionals", "geen", "nvt", "n.v.t", ""]
}
cleaningData(enqueteData, filterTrash)

async function cleaningData(data, filterTrash){
    regexBuilder(filterTrash)
    data = await splittingEntries(data)
    data = await replacingCharacters(data, regexps)
    data = await entryToLowerCase(data)
    data = await filterEntries(data, regexps)
    data = await capitalizeFirstLetter(data)
    console.log(data)  
}

function splittingEntries(data){
    return data.split("\n")
}

function replacingCharacters(data, regexps){
    return data.map(entry => entry.replace(regexps.seperatorRegex, ', '))
}

function entryToLowerCase(data) {
    return data.map(entry => entry.toLowerCase())
}

function regexBuilder(filterTrash) {
    let trashEntryRegex = new RegExp(filterTrash.trash.join("|"), 'gi')
    let seperatorRegex = new RegExp(filterTrash.seperators.join("|"), 'g')
    return regexps = {trashEntryRegex, seperatorRegex}
}

function filterEntries(data, regexps) {
    return data.filter(entry => entry.replace(regexps.trashEntryRegex, 'geen hobby'))
}

function capitalizeFirstLetter(data) {
    return data.map(entry => entry.charAt(0)
                .toUpperCase() + entry.slice(1))
}


