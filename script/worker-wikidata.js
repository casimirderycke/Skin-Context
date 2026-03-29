self.addEventListener('message', async (e) => {
    const { qid } = e.data;

    const query = `
        SELECT ?subklasLabel ?naarGenoembdLabel ?afbeelding ?landLabel
            ?fabrikantLabel ?ontworpenDoorLabel
            (YEAR(?oprIchtingRaw) AS ?oprichting)
            (YEAR(?inDienstRaw)   AS ?inDienst)
            ?vuursnelheid ?aantalGeproduceerd ?massa ?kaliber
            ?munitieLabel ?mondingsnelheid ?boring
            ?operatorLabel ?lengte
            ?conflictLabel ?beinvloedDoorLabel ?gevolgdDoorLabel
        WHERE {
        VALUES ?item { wd:${qid} }
        OPTIONAL { ?item wdt:P279  ?subklas. }
        OPTIONAL { ?item wdt:P138  ?naarGenoemd. }
        OPTIONAL { ?item wdt:P18   ?afbeelding. }
        OPTIONAL { ?item wdt:P495  ?land. }
        OPTIONAL { ?item wdt:P176  ?fabrikant. }
        OPTIONAL { ?item wdt:P287  ?ontworpenDoor. }
        OPTIONAL { ?item wdt:P571  ?oprIchtingRaw. }
        OPTIONAL { ?item wdt:P729  ?inDienstRaw. }
        OPTIONAL { ?item wdt:P3792 ?vuursnelheid. }
        OPTIONAL { ?item wdt:P1092 ?aantalGeproduceerd. }
        OPTIONAL { ?item wdt:P2067 ?massa. }
        OPTIONAL { ?item wdt:P4403 ?kaliber. }
        OPTIONAL { ?item wdt:P739  ?munitie. }
        OPTIONAL { ?item wdt:P4137 ?mondingsnelheid. }
        OPTIONAL { ?item wdt:P2556 ?boring. }
        OPTIONAL { ?item wdt:P137  ?operator. }
        OPTIONAL { ?item wdt:P2043 ?lengte. }
        OPTIONAL { ?item wdt:P607  ?conflict. }
        OPTIONAL { ?item wdt:P737  ?beinvloedDoor. }
        OPTIONAL { ?item wdt:P156  ?gevolgdDoor. }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "nl,en". }
    }`;

    try {
        const res = await fetch('https://query.wikidata.org/sparql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/sparql-results+json',
            },
            body: `query=${encodeURIComponent(query)}`,
        });
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }
        const json = await res.json();
        self.postMessage({ ok: true, rijen: json.results?.bindings ?? [] });
    } catch (err) {
        self.postMessage({ ok: false, fout: err.message });
    }
});
