// efe-u.github.io — tmux-style site interactions
(() => {
    'use strict';

    const blocks = Array.from(document.querySelectorAll('.block'));
    const links  = Array.from(document.querySelectorAll('.cmd-link'));
    const crumb  = document.getElementById('crumb');
    const active = document.getElementById('active-name');

    const labelFor = (id) => {
        const link = links.find(l => l.dataset.target === id);
        if (!link) return id;
        const cmd = link.querySelector('.cmd');
        return cmd ? cmd.textContent.trim() : id;
    };

    const setActive = (id) => {
        if (!id) return;
        links.forEach(l => l.classList.toggle('active', l.dataset.target === id));
        if (crumb)  crumb.textContent  = '~/' + id;
        if (active) active.textContent = labelFor(id);
        if (history.replaceState) {
            history.replaceState(null, '', '#' + id);
        } else {
            location.hash = id;
        }
    };

    // Echo flash on click-jump: green highlight + brief cursor
    const echo = (block) => {
        block.classList.remove('echo');
        // force reflow so the animation restarts cleanly
        void block.offsetWidth;
        block.classList.add('echo');
        setTimeout(() => block.classList.remove('echo'), 750);
    };

    // Sidebar click → smooth scroll + echo
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = link.dataset.target;
            const target = document.getElementById(id);
            if (!target) return;
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActive(id);
            echo(target);
        });
    });

    // Fade-in on scroll
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -10% 0px' });

    blocks.forEach(b => fadeObserver.observe(b));

    // Active-section tracking — pick the block closest to the top of viewport
    let lastActive = null;
    const trackActive = () => {
        const headerOffset = 80;
        let bestId = null;
        let bestDist = Infinity;
        for (const b of blocks) {
            const rect = b.getBoundingClientRect();
            const dist = Math.abs(rect.top - headerOffset);
            if (rect.bottom > headerOffset && dist < bestDist) {
                bestDist = dist;
                bestId = b.id;
            }
        }
        if (bestId && bestId !== lastActive) {
            lastActive = bestId;
            setActive(bestId);
        }
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            trackActive();
            ticking = false;
        });
    }, { passive: true });

    // Initial state — honour URL hash if present
    const initial = () => {
        const hashId = location.hash.replace('#', '');
        if (hashId && document.getElementById(hashId)) {
            setActive(hashId);
            requestAnimationFrame(() => {
                document.getElementById(hashId).scrollIntoView({ block: 'start' });
            });
        } else {
            setActive('whoami');
        }
        // Reveal first block immediately so hero isn't blank on load
        const first = document.getElementById('whoami');
        if (first) first.classList.add('visible');
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initial);
    } else {
        initial();
    }
})();
