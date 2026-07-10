/**
 * SHIPIBO Bistró Amazónico — Interactive Script
 * Vanilla JS, no dependencies
 */

(function () {
    'use strict';

    /* ============================================
       HEADER — Scroll behavior
       ============================================ */
    const header = document.getElementById('header');
    let lastScroll = 0;

    function handleHeaderScroll() {
        const currentScroll = window.scrollY;
        if (currentScroll > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });

    /* ============================================
       HAMBURGER — Mobile menu toggle
       ============================================ */
    const hamburger = document.getElementById('hamburgerBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileLinks = mobileNav.querySelectorAll('a');

    function toggleMobileMenu() {
        const isOpen = hamburger.classList.contains('active');
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', !isOpen);
        document.body.style.overflow = isOpen ? '' : 'hidden';
    }

    hamburger.addEventListener('click', toggleMobileMenu);

    mobileLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            if (mobileNav.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            toggleMobileMenu();
        }
    });

    /* ============================================
       SMOOTH SCROLL — Anchor links
       ============================================ */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var headerHeight = header.offsetHeight;
                var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ============================================
       MENU TABS
       ============================================ */
    const tabButtons = document.querySelectorAll('.menu__tab');
    const tabPanels = document.querySelectorAll('.menu__panel');

    tabButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var tabId = this.getAttribute('data-tab');

            // Update buttons
            tabButtons.forEach(function (b) {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');

            // Update panels
            tabPanels.forEach(function (panel) {
                panel.classList.remove('active');
            });
            var targetPanel = document.getElementById('panel-' + tabId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // Keyboard navigation for tabs
    tabButtons.forEach(function (btn, index) {
        btn.addEventListener('keydown', function (e) {
            var newIndex = index;
            if (e.key === 'ArrowRight') {
                newIndex = (index + 1) % tabButtons.length;
            } else if (e.key === 'ArrowLeft') {
                newIndex = (index - 1 + tabButtons.length) % tabButtons.length;
            } else if (e.key === 'Home') {
                newIndex = 0;
            } else if (e.key === 'End') {
                newIndex = tabButtons.length - 1;
            } else {
                return;
            }
            e.preventDefault();
            tabButtons[newIndex].click();
            tabButtons[newIndex].focus();
        });
    });

    /* ============================================
       SCROLL ANIMATIONS — Intersection Observer
       ============================================ */
    var animatedElements = document.querySelectorAll('.anim-fade, .anim-reveal');

    if ('IntersectionObserver' in window) {
        var observerOptions = {
            root: null,
            rootMargin: '0px 0px -60px 0px',
            threshold: 0.1
        };

        var animationObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    animationObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(function (el) {
            animationObserver.observe(el);
        });
    } else {
        // Fallback: show all
        animatedElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    /* ============================================
       HERO ANIMATIONS — Staggered entrance
       ============================================ */
    var heroElements = document.querySelectorAll('.hero .anim-fade');
    heroElements.forEach(function (el, index) {
        el.style.transitionDelay = (0.2 + index * 0.15) + 's';
        // Trigger after a small delay
        setTimeout(function () {
            el.classList.add('visible');
        }, 100);
    });

    /* ============================================
       RESERVATION FORM — Send to WhatsApp
       ============================================ */
    var form = document.getElementById('reservaForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var name = document.getElementById('reservaName').value.trim();
            var date = document.getElementById('reservaDate').value;
            var guests = document.getElementById('reservaGuests').value;
            var time = document.getElementById('reservaTime').value;
            var notes = document.getElementById('reservaNotes').value.trim();

            if (!name || !date || !guests || !time) {
                // Shake the button
                var btn = form.querySelector('.btn');
                btn.style.animation = 'shake 0.4s ease';
                setTimeout(function () {
                    btn.style.animation = '';
                }, 400);
                return;
            }

            // Format date nicely
            var dateObj = new Date(date + 'T12:00:00');
            var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            var dateFormatted = dateObj.toLocaleDateString('es-AR', options);

            var message = 'Hola! Quiero hacer una reserva en SHIPIBO 🐍\n\n';
            message += '👤 Nombre: ' + name + '\n';
            message += '📅 Fecha: ' + dateFormatted + '\n';
            message += '⏰ Horario: ' + time + '\n';
            message += '👥 Personas: ' + guests + '\n';
            if (notes) {
                message += '📝 Notas: ' + notes + '\n';
            }

            var encodedMessage = encodeURIComponent(message);
            var whatsappURL = 'https://wa.me/5491165384415?text=' + encodedMessage;

            window.open(whatsappURL, '_blank', 'noopener');
        });
    }

    /* ============================================
       PARALLAX — Subtle hero parallax on scroll
       ============================================ */
    var heroBg = document.querySelector('.hero__bg');
    if (heroBg) {
        window.addEventListener('scroll', function () {
            var scrollY = window.scrollY;
            if (scrollY < window.innerHeight) {
                heroBg.style.transform = 'translateY(' + (scrollY * 0.3) + 'px)';
            }
        }, { passive: true });
    }

    /* ============================================
       GALLERY — Image load fade-in
       ============================================ */
    var galleryImages = document.querySelectorAll('.gallery__item img');
    galleryImages.forEach(function (img) {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.6s ease';

        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.addEventListener('load', function () {
                img.style.opacity = '1';
            });
            img.addEventListener('error', function () {
                img.style.opacity = '0.3';
            });
        }
    });

    /* ============================================
       COUNTER ANIMATION — Rating score
       ============================================ */
    function animateCounter(element, target, duration) {
        var start = 0;
        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            var current = (start + (target - start) * eased).toFixed(1);
            element.textContent = current;
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }

    var ratingScore = document.querySelector('.testimonials__rating-score');
    if (ratingScore && 'IntersectionObserver' in window) {
        var ratingObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(ratingScore, 4.8, 1200);
                    ratingObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        ratingObserver.observe(ratingScore);
    }

    /* ============================================
       WHATSAPP FAB — Hide on bottom
       ============================================ */
    var fab = document.getElementById('fabWhatsapp');
    if (fab) {
        window.addEventListener('scroll', function () {
            var scrollHeight = document.documentElement.scrollHeight;
            var scrollTop = window.scrollY;
            var clientHeight = window.innerHeight;
            var distanceFromBottom = scrollHeight - scrollTop - clientHeight;

            if (distanceFromBottom < 200) {
                fab.style.opacity = '0';
                fab.style.pointerEvents = 'none';
            } else {
                fab.style.opacity = '1';
                fab.style.pointerEvents = 'auto';
            }
        }, { passive: true });
    }

    /* ============================================
       ACTIVE NAV LINK — Highlight on scroll
       ============================================ */
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.header__link, .header__mobile-link');

    function highlightNavLink() {
        var scrollPos = window.scrollY + 100;

        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(function (link) {
                    link.style.color = '';
                    if (link.getAttribute('href') === '#' + id) {
                        link.style.color = 'var(--dorado)';
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink, { passive: true });

    /* ============================================
       SHAKE ANIMATION — CSS keyframe injection
       ============================================ */
    var shakeKeyframes = '@keyframes shake { 0%,100% { transform:translateX(0); } 25% { transform:translateX(-5px); } 75% { transform:translateX(5px); } }';
    var styleSheet = document.createElement('style');
    styleSheet.textContent = shakeKeyframes;
    document.head.appendChild(styleSheet);

})();
