const FLOATS = [
    { naam: 'Factory New',    kort: 'FN' },
    { naam: 'Minimal Wear',   kort: 'MW' },
    { naam: 'Field-Tested',   kort: 'FT' },
    { naam: 'Well-Worn',      kort: 'WW' },
    { naam: 'Battle-Scarred', kort: 'BS' },
];

const WAPEN_NAAM = { ak47: 'AK-47', awp: 'AWP', deagle: 'Desert Eagle', mp9: 'MP9', m4a1s: 'M4A1-S',m4a4: 'M4A4' };

const SKINS = {
    ak47: [
        { naam: 'Fire Serpent', prijzen: { 'Factory New': 2825.95, 'Minimal Wear': 1365.08, 'Field-Tested': 802.00, 'Well-Worn': 832.96, 'Battle-Scarred': 553.34 } },
        { naam: 'Fuel Injector', prijzen: { 'Factory New': 648.85, 'Minimal Wear': 280.77, 'Field-Tested': 190.66, 'Well-Worn': 139.54, 'Battle-Scarred': 118.93 } },
        { naam: 'Wild Lotus', prijzen: { 'Factory New': 15761.89, 'Minimal Wear': 10797.41, 'Field-Tested': 7916.85, 'Well-Worn': 5523.98, 'Battle-Scarred': 4046.04 } },
        { naam: 'X-Ray', prijzen: { 'Factory New': 3548.14, 'Minimal Wear': 1612.82, 'Field-Tested': 963.07, 'Well-Worn': 510.22, 'Battle-Scarred': 387.01 } },
    ],
    awp: [
        { naam: 'BOOM', prijzen: { 'Factory New': 575.01, 'Minimal Wear': 176.64, 'Field-Tested': 117.17 } },
        { naam: 'Dragon Lore', prijzen: { 'Factory New': 11736.13, 'Minimal Wear': 9044.07, 'Field-Tested': 6339.09, 'Well-Worn': 5779.93, 'Battle-Scarred': 4838.02 } },
        { naam: 'Gungnir', prijzen: { 'Factory New': 12692.06, 'Minimal Wear': 10400.00, 'Field-Tested': 7853.60, 'Well-Worn': 7839.12, 'Battle-Scarred': 7397.23 } },
        { naam: 'Medusa', prijzen: { 'Factory New': 4845.00, 'Minimal Wear': 2783.87, 'Field-Tested': 2050.00, 'Well-Worn': 1822.98, 'Battle-Scarred': 1795.14 } },
    ],
    deagle: [
        { naam: 'Blaze', prijzen: { 'Factory New': 789.02, 'Minimal Wear': 912.06 } },
        { naam: 'Emerald Jörmungandr', prijzen: { 'Factory New': 951.57, 'Minimal Wear': 540.00, 'Field-Tested': 489.77, 'Well-Worn': 499.00, 'Battle-Scarred': 483.90 } },
        { naam: 'Fennec Fox', prijzen: { 'Factory New': 967.69, 'Minimal Wear': 478.16, 'Field-Tested': 366.04, 'Well-Worn': 371.09, 'Battle-Scarred': 346.94 } },
        { naam: 'Sunset Storm 壱', prijzen: { 'Factory New': 645.12, 'Minimal Wear': 593.27, 'Field-Tested': 541.82, 'Well-Worn': 880.79 } },
    ],
    m4a1s: [
        { naam: 'Hot Rod', prijzen: { 'Factory New': 2498.16, 'Minimal Wear': 2431.19 } },
        { naam: 'Hyper Beast', prijzen: { 'Factory New': 448.40, 'Minimal Wear': 122.62, 'Field-Tested': 120.00, 'Well-Worn': 111.94, 'Battle-Scarred': 110.16 } },
        { naam: 'Icarus Fell', prijzen: { 'Factory New': 816.38, 'Minimal Wear': 780.44 } },
        { naam: 'Imminent Danger', prijzen: { 'Factory New': 1747.63, 'Minimal Wear': 1156.67, 'Field-Tested': 768.17, 'Well-Worn': 2364.41, 'Battle-Scarred': 683.88 } },
    ],
    m4a4: [
        { naam: 'Daybreak', prijzen: { 'Factory New': 1332.31, 'Minimal Wear': 570.52, 'Field-Tested': 510.00, 'Well-Worn': 670.28, 'Battle-Scarred': 459.64 } },
        { naam: 'Eye of Horus', prijzen: { 'Factory New': 1626.71, 'Minimal Wear': 835.00, 'Field-Tested': 538.00, 'Well-Worn': 320.03, 'Battle-Scarred': 216.59 } },
        { naam: 'Howl', prijzen: { 'Factory New': 6892.99, 'Minimal Wear': 5187.12, 'Field-Tested': 4277.34, 'Well-Worn': 4999.00 } },
        { naam: 'Poseidon', prijzen: { 'Factory New': 2423.68, 'Minimal Wear': 1180.73, 'Field-Tested': 1212.13 } },
    ],
    mp9: [
        { naam: "Pandora's Box", prijzen: { 'Factory New': 223.83, 'Minimal Wear': 164.75, 'Field-Tested': 164.00 } },
        { naam: 'Setting Sun', prijzen: { 'Factory New': 88.51, 'Minimal Wear': 32.01, 'Field-Tested': 19.77, 'Well-Worn': 15.23, 'Battle-Scarred': 12.69 } },
        { naam: 'Stained Glass', prijzen: { 'Factory New': 218.22, 'Minimal Wear': 154.21, 'Field-Tested': 122.01, 'Well-Worn': 170.17, 'Battle-Scarred': 116.79 } },
        { naam: 'Wild Lily', prijzen: { 'Factory New': 2942.35, 'Minimal Wear': 2735.48, 'Field-Tested': 2217.84, 'Well-Worn': 2092.12, 'Battle-Scarred': 2195.02 } },
    ],
};

const hash = window.location.hash.replace('#', '').trim();
const skins = SKINS[hash] ?? [];
const wapenNaam = WAPEN_NAAM[hash];

async function laadBeschrijvingen() {
    const res = await fetch('/data/wapens.ttl');
    const tekst = await res.text();
    const map = {};

    const regels = tekst.split('\n');
    let huidigNaam = null;
    let huidigWapen = null;

    for (const regel of regels) {
        if (regel.includes('sc:naam')) {
            huidigNaam = regel.split('"')[1];
        }
        if (regel.includes('sc:wapen')) {
            huidigWapen = regel.split('sc:')[2].split(/[\s;]/)[0];
        }
        if (regel.includes('sc:beschrijving') && huidigNaam && huidigWapen) {
            const beschrijving = regel.split('"')[1];
            if (!map[huidigWapen]) map[huidigWapen] = {};
            map[huidigWapen][huidigNaam] = beschrijving;
        }
    }

    return map;
}

const beschrijvingen = await laadBeschrijvingen()

const grid = document.querySelector('.skins-grid');
if (grid && skins.length) {
    for (const skin of skins) {
        const beschrijving = beschrijvingen[hash]?.[skin.naam] ?? `${wapenNaam}  ${skin.naam}`;
        const minPrijs = Math.min(...Object.values(skin.prijzen));

        const kaart = document.createElement('ui-kaart');
        kaart.setAttribute('titel', skin.naam);
        kaart.setAttribute('beschrijving', beschrijving);
        kaart.setAttribute('afbeelding', `img/${hash}/${skin.naam}.png`);
        kaart.setAttribute('tags', `vanaf €${minPrijs.toFixed(2)}`);
        kaart.setAttribute('knop-tekst', 'Bekijk prijzen');
        kaart.addEventListener('kaart-klik', () => openModal(skin));
        grid.appendChild(kaart);
    }
}

const overlay = document.createElement('div');
overlay.id = 'skin-overlay';
overlay.hidden = true;
document.body.appendChild(overlay);

const modal = document.createElement('div');
modal.id = 'skin-modal';
modal.hidden = true;
modal.innerHTML = `
    <button id="modal-sluiten" aria-label="Sluiten">✕</button>
    <div id="modal-inhoud"></div>
`;
document.body.appendChild(modal);

overlay.addEventListener('click', sluitModal);
modal.querySelector('#modal-sluiten').addEventListener('click', sluitModal);

function sluitModal() {
    overlay.hidden = true;
    modal.hidden = true;
    modal.querySelector('#modal-inhoud').innerHTML = '';
}

function openModal(skin) {
    overlay.hidden = false;
    modal.hidden = false;

    const inhoud = modal.querySelector('#modal-inhoud');
    tekenGrafiek(inhoud, skin.naam, skin.prijzen);
}

function tekenGrafiek(container, skinNaam, prijzen) {
    const condities = FLOATS.filter(f => prijzen[f.naam] !== undefined);

    if (!condities.length) {
        container.innerHTML = `<h3>${wapenNaam} | ${skinNaam}</h3><p class="geen-data">Geen prijsdata beschikbaar.</p>`;
        return;
    }

    container.innerHTML = `<h3>${wapenNaam} | ${skinNaam}</h3><div id="d3-grafiek"></div>`;

    const breedte = 520;
    const hoogte = 280;
    const ruimteOnder = 30;
    const ruimteBoven = 40;

    const svg = d3.select('#d3-grafiek').append('svg')
        .attr('viewBox', `0 0 ${breedte} ${hoogte}`)
        .attr('width', '100%');

    const xSchaal = d3.scaleBand()
        .domain(condities.map(f => f.kort))
        .range([0, breedte])
        .padding(0.3);

    const hoogstePrijs = condities.reduce((max, f) => Math.max(max, prijzen[f.naam]), 0);

    const ySchaal = d3.scaleLinear()
        .domain([0, hoogstePrijs])
        .range([hoogte - ruimteOnder, ruimteBoven]);

    const bodem = hoogte - ruimteOnder;

    condities.forEach((f, i) => {
        const prijs = prijzen[f.naam];

        svg.append('rect')
            .attr('x', xSchaal(f.kort))
            .attr('y', bodem)
            .attr('width', xSchaal.bandwidth())
            .attr('height', 0)
            .attr('rx', 4)
            .attr('fill', 'rgba(255,255,255,0.15)')
            .on('mouseover', function() { d3.select(this).attr('fill', 'rgba(255,165,0,0.7)'); })
            .on('mouseout', function() { d3.select(this).attr('fill', 'rgba(255,255,255,0.15)'); })
            .transition()
            .duration(500)
            .delay(i * 80)
            .attr('y', ySchaal(prijs))
            .attr('height', bodem - ySchaal(prijs));

        svg.append('text')
            .attr('x', xSchaal(f.kort) + xSchaal.bandwidth() / 2)
            .attr('y', ySchaal(prijs) - 16)
            .attr('text-anchor', 'middle')
            .style('fill', '#fff')
            .style('font-size', '0.7rem')
            .style('opacity', 0)
            .text(`€${prijs.toFixed(2)}`)
            .transition()
            .delay(i * 80 + 500)
            .style('opacity', 1);

        svg.append('text')
            .attr('x', xSchaal(f.kort) + xSchaal.bandwidth() / 2)
            .attr('y', hoogte - 10)
            .attr('text-anchor', 'middle')
            .style('fill', '#aaa')
            .style('font-size', '0.72rem')
            .text(f.kort);
    });
}
