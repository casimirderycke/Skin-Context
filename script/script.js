(function() {
    'use strict';
    
    if (document.querySelector('.hero-title')) {
        gsap.from('.hero-title', { y: 50, opacity: 0, duration: 1.5, ease: 'power2.out' });
    }

    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) slideshow();

    const zoekInput = document.querySelector('#zoek-wapens');
    const zoekSkins = document.querySelector('#zoek-skins');
    const filterKnoppen = document.querySelectorAll('.filter-btn');
    const geenResultaten = document.querySelector('#geen-resultaten-wapens');

    let huidigeFilter = 'alle';
    let huidigeZoekterm = '';
    let zoekTimeout;

    filterKnoppen.forEach(knop => {
        knop.addEventListener('click', () => {
            huidigeFilter = knop.getAttribute('data-filter') || 'alle';

            filterKnoppen.forEach(k => {
                k.setAttribute('variant', 'outline');
                k.classList.remove('actief');
            });
            knop.setAttribute('variant', 'filled');
            knop.classList.add('actief');

            filterEnToon();
        });
    });

    [zoekInput, zoekSkins].forEach(input => {
        if (!input) return;
        input.addEventListener('input', function () {
            if (zoekTimeout) clearTimeout(zoekTimeout);
            zoekTimeout = setTimeout(() => {
                huidigeZoekterm = this.value.toLowerCase().trim();
                filterEnToon();
            }, 300);
        });
    });

    function filterEnToon() {
        let zichtbaar = 0;

        document.querySelectorAll('ui-kaart').forEach(kaart => {
            const titel = (kaart.getAttribute('titel') || '').toLowerCase();
            const categorie = (kaart.getAttribute('categorie') || '').toLowerCase();

            const matchZoek = titel.includes(huidigeZoekterm);
            const matchFilter = huidigeFilter === 'alle' || categorie === huidigeFilter;

            if (matchZoek && matchFilter) {
                kaart.style.display = '';
                zichtbaar++;
            } else {
                kaart.style.display = 'none';
            }
        });

        if (geenResultaten) {
            geenResultaten.hidden = zichtbaar > 0;
        }
    }

    function slideshow() {
        let currentSlideIndex = 0;
        const slides = document.querySelectorAll('.slide');
        const totalSlides = slides.length;

        gsap.set(slides[0], { opacity: 1 });

        function toonSlide(index) {
            gsap.to(slides[currentSlideIndex], { opacity: 0, duration: 2, ease: 'power1.inOut' });
            gsap.to(slides[index], { opacity: 1, duration: 2, ease: 'power1.inOut' });
            currentSlideIndex = index;
        }

        function volgendeSlide() {
            toonSlide((currentSlideIndex + 1) % totalSlides);
        }

        setInterval(volgendeSlide, 5000);
    }

})();


