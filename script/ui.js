(function() {
    'use strict';

class InfoTag extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
      <style>
        :host { display: inline-block; }
        .tag {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          padding: 0.3rem 0.8rem;
          font-size: 0.8rem;
          font-weight: 300;
          border-radius: 0.3rem;
          font-family: 'Inter', sans-serif;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      </style>
      <span class="tag" role="note"><slot></slot></span>
    `;
    }
}

customElements.define('info-tag', InfoTag);

class ActionKnop extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    static get observedAttributes() {
        return ['variant'];
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        const variant = this.getAttribute('variant') || 'filled';

        const filledStyles = `
      background: linear-gradient(135deg, #333 0%, #555 100%);
      border: 1px solid rgba(255, 255, 255, 0.2);
    `;
        const outlineStyles = `
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.3);
    `;

        this.shadowRoot.innerHTML = `
      <style>
        :host { display: inline-block; }
        button {
          ${variant === 'outline' ? outlineStyles : filledStyles}
          color: #ffffff;
          padding: 0.5rem 0.75rem;
          font-size: 0.85rem;
          border-radius: 0.75rem;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
          letter-spacing: ${variant === 'outline' ? '0.05em' : 'normal'};
          text-transform: uppercase;
          box-shadow: 0 0 0 rgba(0,0,0,0);
        }
        .buttonstart {
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          pointer-events: none;
        }
      </style>
      <button><div class="buttonstart"></div><slot></slot></button>
    `;

        const knop = this.shadowRoot.querySelector('button');
        const buttonstart = this.shadowRoot.querySelector('.buttonstart');
        const hoverBg = variant === 'outline' ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #444 0%, #666 100%)';
        const defaultBg = variant === 'outline' ? 'transparent' : 'linear-gradient(135deg, #333 0%, #555 100%)';
        const defaultBorder = variant === 'outline' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)';

        knop.addEventListener('mouseover', () => {
            knop.style.background = hoverBg;
            knop.style.borderColor = 'rgba(255,255,255,0.4)';
            gsap.to(knop, { y: -2, scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.3)', duration: 0.3 });
            gsap.to(buttonstart, { left: '100%', duration: 0.6, ease: 'power1.inOut' });
        });
        knop.addEventListener('mouseout', () => {
            knop.style.background = defaultBg;
            knop.style.borderColor = defaultBorder;
            gsap.to(knop, { y: 0, scale: 1, boxShadow: '0 0 0 rgba(0,0,0,0)', duration: 0.3 });
            gsap.set(buttonstart, { left: '-100%' });
        });
    }
}

customElements.define('action-knop', ActionKnop);

class UiKaart extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['titel', 'beschrijving', 'afbeelding', 'tags', 'categorie', 'datum', 'detail-url', 'knop-tekst'];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (oldVal !== newVal && this.isConnected) {
            this.render();
        }
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const titel = this.getAttribute('titel');
        const beschrijving = this.getAttribute('beschrijving');
        const afbeelding = this.getAttribute('afbeelding');
        const tagsRaw = this.getAttribute('tags');
        const datum = this.getAttribute('datum');
        const detailUrl = this.getAttribute('detail-url');
        const knopTekst = this.getAttribute('knop-tekst');

        this.shadowRoot.innerHTML = `
        <style>
          :host { display: block; height: 100%; }

          .card {
            background: #2a2a2a;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
            border-radius: 0.75rem;
            font-family: 'Inter', sans-serif;
            color: #ffffff;
            height: 100%;
            display: flex;
            flex-direction: column;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }

          .card:hover {
            transform: translateY(-0.5rem);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
            border-color: rgba(255, 255, 255, 0.2);
          }

          .visual-header {
            height: 12rem;
            background: #1a1a1a;
            overflow: hidden;
            position: relative;
            flex-shrink: 0;
          }

          .visual-header img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }

          .card:hover .visual-header img {
            transform: scale(1.05);
          }

          .content {
            padding: 1.5rem;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .title {
            font-size: 1.3rem;
            margin: 0;
            color: #ffffff;
          }

          .date {
            font-size: 0.9rem;
            /* use higher-contrast color (matches --kleur-text-alt) */
            color: var(--kleur-text-alt, #cccccc);
          }

          .description {
            color: #cccccc;
            line-height: 1.6;
            flex-grow: 1;
            font-size: 1rem;
          }

          .footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 0.75rem;
            margin-top: auto;
          }

          .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
          }
        </style>

        <article class="card">
          <div class="visual-header">
            ${afbeelding ? `<img src="${afbeelding}" alt="${titel}">` : ''}
          </div>
          <div class="content">
            <h3 class="title">${titel}</h3>
            ${datum ? `<div class="date">${datum}</div>` : ''}
            <p class="description">${beschrijving}</p>
            <div class="footer">
              <div class="tags" id="tags-container"></div>
              ${knopTekst ? `<action-knop id="kaart-knop" variant="outline">${knopTekst}</action-knop>` : ''}
            </div>
          </div>
        </article>
      `;

        const tagsContainer = this.shadowRoot.querySelector('#tags-container');
        tagsContainer.innerHTML = '';
        if (tagsRaw) {
            tagsRaw.split(',').forEach(t => {
                const tag = document.createElement('info-tag');
                tag.textContent = t.trim();
                tagsContainer.appendChild(tag);
            });
        }

        if (knopTekst) {
            const knop = this.shadowRoot.querySelector('#kaart-knop');
            if (knop) {
                knop.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (detailUrl) {
                        window.location.href = detailUrl;
                    } else {
                        this.dispatchEvent(new CustomEvent('kaart-klik', { bubbles: true }));
                    }
                });
            }
        }
    }
}

customElements.define('ui-kaart', UiKaart);

class InfoKaartje extends HTMLElement {
    static get observedAttributes() { 
      return ['label', 'waarde']; 
    }

    connectedCallback() { 
      this.render(); 
    }

    attributeChangedCallback() {
       if (this.isConnected == true) {
        this.render();
      } 
    }

    render() {
        const label  = this.getAttribute('label');
        const waarde = this.getAttribute('waarde');
        if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; height: 100%; }
                .kaartje {
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.15);
                    border-radius: 0.75rem;
                    padding: 1.25rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                    position: relative;
                    overflow: hidden;
                    height: 100%;
                    box-sizing: border-box;
                    box-shadow: 0 0.625rem 1.875rem rgba(0,0,0,0.3);
                }
                .buttonstart {
                    position: absolute;
                    top: 0; left: -100%;
                    width: 100%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
                    pointer-events: none;
                }
                .label  {
                    font-size: 0.7rem;
                    color: #888;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    font-family: 'Inter', sans-serif;
                }
                .waarde {
                    font-size: 1rem;
                    color: #fff;
                    font-weight: 500;
                    font-family: 'Inter', sans-serif;
                    overflow-wrap: break-word;
                    word-break: break-word;
                }
            </style>
            <div class="kaartje">
                <div class="buttonstart"></div>
                <span class="label">${label}</span>
                <span class="waarde">${waarde}</span>
            </div>
        `;

        const kaartje = this.shadowRoot.querySelector('.kaartje');
        const buttonstart = this.shadowRoot.querySelector('.buttonstart');

        kaartje.addEventListener('mouseover', () => {
            gsap.to(kaartje, { y: -4, borderColor: 'rgba(255,255,255,0.3)', boxShadow: '0 1.25rem 2.5rem rgba(0,0,0,0.4)', duration: 0.3 });
            gsap.to(buttonstart, { left: '100%', duration: 0.6, ease: 'power1.inOut' });
        });
        kaartje.addEventListener('mouseout', () => {
            gsap.to(kaartje, { y: 0, borderColor: 'rgba(255,255,255,0.15)', boxShadow: '0 0.625rem 1.875rem rgba(0,0,0,0.3)', duration: 0.3 });
            gsap.set(buttonstart, { left: '-100%' });
        });
    }
}

customElements.define('info-kaartje', InfoKaartje);

})();