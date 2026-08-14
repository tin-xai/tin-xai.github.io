// Toggle research details expand/collapse
function toggleResearch() {
    const details = document.getElementById('researchDetails');
    const hint = document.getElementById('toggleHint');
    details.classList.toggle('expanded');
    hint.textContent = details.classList.contains('expanded') ? '[click to collapse]' : '[click to expand]';
}

// Publication filter
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.pub-card');
    const links = document.querySelectorAll('.pub-filter-link');
    const countFav = document.getElementById('count-favorites');
    const countAll = document.getElementById('count-all');

    if (!links.length) return;

    const favCount = [...cards].filter(c => c.dataset.featured === 'true').length;
    const otherCount = [...cards].filter(c => c.dataset.featured !== 'true').length;
    if (countFav) countFav.textContent = favCount;
    if (countAll) countAll.textContent = otherCount;

    function applyFilter(filter) {
        cards.forEach(card => {
            const isFav = card.dataset.featured === 'true';
            const show = filter === 'favorites' ? isFav : !isFav;
            card.style.display = show ? '' : 'none';
        });
        links.forEach(l => l.classList.toggle('active', l.dataset.filter === filter));
    }

    links.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            applyFilter(link.dataset.filter);
        });
    });

    applyFilter('favorites');
});

// Resume card sliders (Education / Experience / Honors & Awards)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.resume-slider').forEach(slider => {
        const slides = Array.from(slider.querySelectorAll('.resume-slide'));
        const nav = slider.nextElementSibling;
        if (!slides.length || !nav || !nav.classList.contains('resume-slider-nav')) return;

        if (slides.length <= 1) {
            nav.classList.add('is-hidden');
            return;
        }

        const dotsWrap = nav.querySelector('.resume-dots');
        const prevBtn = nav.querySelector('[data-dir="-1"]');
        const nextBtn = nav.querySelector('[data-dir="1"]');
        let index = slides.findIndex(s => s.classList.contains('is-active'));
        if (index < 0) index = 0;

        const dots = slides.map((_, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'resume-dot';
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goTo(i));
            dotsWrap.appendChild(dot);
            return dot;
        });

        function update() {
            slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
            dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
        }

        function goTo(i) {
            index = (i + slides.length) % slides.length;
            update();
        }

        prevBtn.addEventListener('click', () => goTo(index - 1));
        nextBtn.addEventListener('click', () => goTo(index + 1));

        update();
    });
});

// Scroll-reveal for elements with class "fade-in"
document.addEventListener('DOMContentLoaded', () => {
    const faders = document.querySelectorAll('.fade-in');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        faders.forEach(el => observer.observe(el));
    } else {
        // Fallback: show everything immediately
        faders.forEach(el => el.classList.add('visible'));
    }
});
