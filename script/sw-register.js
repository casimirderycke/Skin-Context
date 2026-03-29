let reg;

if ('serviceWorker' in navigator) {

    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registratie => {
                reg = registratie;
                if (reg.waiting) {
                    toonUpdateBanner();
                    return;
                }
                reg.addEventListener('updatefound', () => {
                    const nieuw = reg.installing;
                    nieuw.addEventListener('statechange', () => {
                        if (nieuw.state === 'installed' && navigator.serviceWorker.controller) {
                            toonUpdateBanner();
                        }
                    });
                });
            });

        navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
        });
    });
}

function toonUpdateBanner() {
    if (document.querySelector('#update-banner')) return;
    const banner = document.createElement('div');
    banner.id = 'update-banner';
    banner.innerHTML = `
        <span>Er is een nieuwe versie beschikbaar.</span>
        <button id="update-knop">Vernieuwen</button>
    `;
    document.body.appendChild(banner);
    document.querySelector('#update-knop').addEventListener('click', () => {
        reg?.waiting?.postMessage({ type: 'SKIP_WAITING' });
    });
}
