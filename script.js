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
