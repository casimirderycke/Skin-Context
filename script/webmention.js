const DENO_URL = 'https://deno-webmention.casimirderycke.deno.net';
const SLEUTEL  = 'daf67b33cc12f470b8de6c22c5268d84afa6d99c4a3907fda1dbc07664f7ab9f';


async function laadAantalMentions(target) {
    const url = `${DENO_URL}/?key=${SLEUTEL}&target=${encodeURIComponent(target)}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.mentions ?? 0;
}

function toonAantalMentions(aantal) {
    const teller = document.querySelector('#wm-teller');
    if (!teller) return;

    teller.textContent = aantal === 0 ? 'Nog geen mentions' : `${aantal} ${aantal === 1 ? 'persoon schreef' : 'mensen schreven'} over dit wapen`;
}


async function verstuurWebmention(source, target) {
    const url = `${DENO_URL}/?key=${SLEUTEL}`;

    const response = await fetch(url, {
        method:  'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body:    `source=${encodeURIComponent(source)}&target=${encodeURIComponent(target)}`
    });

    return response;
}

const huidigeUrl = window.location.href;

const uUrl = document.querySelector('.u-url');
if (uUrl) uUrl.setAttribute('href', huidigeUrl);

try {
    const aantal = await laadAantalMentions(huidigeUrl);
    toonAantalMentions(aantal);
} catch {
    toonAantalMentions(0);
}

const knop   = document.querySelector('#wm-verstuur');
const invoer = document.querySelector('#wm-url');

if (knop && invoer) {
    knop.addEventListener('click', async (e) => {
        e.preventDefault();
        if (!invoer.value) return;

        knop.textContent = 'Versturen';
        try {
            const res = await verstuurWebmention(invoer.value, huidigeUrl);
            knop.textContent = res.ok ? 'Verstuurd' : 'Mislukt';
        } catch {
            knop.textContent = 'Mislukt';
        }
    });
}
