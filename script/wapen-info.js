const WAPENS = {
    ak47:   { qid: 'Q37116',  naam: 'AK-47' },
    awp:    { qid: 'Q638202', naam: 'AWP' },
    deagle: { qid: 'Q217278', naam: 'Desert Eagle' },
    mp9:    { qid: 'Q996888', naam: 'MP9' },
    m4a1s:  { qid: 'Q843709', naam: 'Close Quarters Battle Receiver' },
    m4a4:   { qid: 'Q214688', naam: 'M4A4' },
};

const VELDEN = {
    subklasLabel:       'Type',
    naarGenoembdLabel:  'Naar vernoemd',
    landLabel:          'Land van oorsprong',
    fabrikantLabel:     'Fabrikant',
    ontworpenDoorLabel: 'Ontworpen door',
    oprichting:         'Oprichting',
    inDienst:           'Indiensttreding',
    vuursnelheid:       'Vuursnelheid (rpm)',
    aantalGeproduceerd: 'Geproduceerd',
    massa:              'Massa (kg)',
    kaliber:            'Kaliber',
    munitieLabel:       'Munitie',
    mondingsnelheid:    'Mondingsnelheid (m/s)',
    boring:             'Boring (mm)',
    conflictLabel:      'Conflicten (voorbeeld)',
    operatorLabel:      'Operator',
    lengte:             'Lengte (mm)',
    beinvloedDoorLabel: 'Beïnvloed door',
    gevolgdDoorLabel:   'Gevolgd door',
};

const hash  = window.location.hash.replace('#', '').trim();
const wapen = WAPENS[hash];

if (wapen) {
    const worker = new Worker('script/worker-wikidata.js');
    worker.postMessage({ qid: wapen.qid });
    worker.addEventListener('message', (e) => {
        worker.terminate();
        if (e.data.ok) toonInfo(e.data.rijen);
        else console.error('[wapen-info]', e.data.fout);
    });
}

function toonInfo(rijen) {
    if (!rijen.length) return;

    const naam = document.querySelector('.wapen-naam');
    if (naam) naam.textContent = wapen.naam;

    const wikidataLink = document.querySelector('.wapen-wikidata');
    if (wikidataLink) {
        wikidataLink.href = `https://www.wikidata.org/wiki/${wapen.qid}`;
        wikidataLink.hidden = false;
    }

    const foto = document.querySelector('.wapen-foto');
    if (foto) {
        const afbeelding = rijen.find(r => r.afbeelding?.value)?.afbeelding?.value;
        if (afbeelding) {
            foto.innerHTML = `<img src="${afbeelding}" class="wapen-video" alt="${wapen.naam}">`;
        } else {
            const type = rijen[0].subklasLabel?.value ?? '';
            foto.innerHTML = `
                <div class="wapen-foto-inhoud">
                    <span class="wapen-foto-naam">${wapen.naam}</span>
                    ${type ? `<span class="wapen-foto-type">${type}</span>` : ''}
                </div>`;
        }
    }

    const grid = document.querySelector('.wapen-grid');
    if (!grid) return;

    const waarden = {};
    for (const sleutel of Object.keys(VELDEN)) {
        const val = rijen.find(r => r[sleutel]?.value)?.[sleutel].value;
        if (val) waarden[sleutel] = val;
    }

    grid.innerHTML = Object.entries(VELDEN)
        .filter(([sleutel]) => waarden[sleutel])
        .map(([sleutel, label]) =>
            `<info-kaartje label="${label}" waarde="${waarden[sleutel]}"></info-kaartje>`
        )
        .join('');
    gsap.from(grid.querySelectorAll('info-kaartje'), {opacity: 0, y: 20, duration: 0.4, stagger: 0.05, ease: 'power2.out',});
}
