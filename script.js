// Toggle research details expand/collapse
function toggleResearch() {
    const details = document.getElementById('researchDetails');
    const hint = document.getElementById('toggleHint');
    details.classList.toggle('expanded');
    hint.textContent = details.classList.contains('expanded') ? '[click to collapse]' : '[click to expand]';
}

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
