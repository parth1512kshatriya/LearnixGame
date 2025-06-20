// Theme Management
class ThemeManager {
    constructor(headerEffect) {
        this.headerEffect = headerEffect;
        this.theme = this.getStoredTheme() || this.getSystemTheme();
        this.init();
    }

    getStoredTheme() {
        return localStorage.getItem('theme');
    }

    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    init() {
        this.applyTheme(this.theme);
        this.bindEvents();
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.theme = theme;

        if (this.headerEffect && typeof this.headerEffect.updateHeaderStyle === 'function') {
            this.headerEffect.updateHeaderStyle();
        }
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    bindEvents() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!this.getStoredTheme()) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

// Header Scroll Effect
class HeaderScrollEffect {
    constructor() {
        this.header = document.querySelector('.header');
        this.init();
    }

    init() {
        if (this.header) {
            this.bindEvents();
            this.updateHeaderStyle();
        }
    }

    updateHeaderStyle() {
        const scrollY = window.scrollY;

        if (scrollY > 100) {
            this.header.style.background = 'rgba(255, 255, 255, 0.95)';
            this.header.style.backdropFilter = 'blur(20px)';
            this.header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            this.header.style.background = 'rgba(255, 255, 255, 0.8)';
            this.header.style.backdropFilter = 'blur(12px)';
            this.header.style.boxShadow = 'none';
        }

        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            if (scrollY > 100) {
                this.header.style.background = 'rgba(17, 24, 39, 0.95)';
            } else {
                this.header.style.background = 'rgba(17, 24, 39, 0.8)';
            }
        }
    }

    bindEvents() {
        let ticking = false;

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateHeaderStyle();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick);
    }
}

// Mobile Menu Management
class MobileMenu {
    constructor() {
        this.menuBtn = document.getElementById('mobileMenuBtn');
        this.menu = document.getElementById('mobileMenu');
        this.isOpen = false;
        this.init();
    }

    init() {
        if (this.menuBtn && this.menu) {
            this.bindEvents();
        }
    }

    bindEvents() {
        this.menuBtn.addEventListener('click', () => this.toggle());

        const navLinks = this.menu.querySelectorAll('.mobile-nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.close());
        });

        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.menu.contains(e.target) && !this.menuBtn.contains(e.target)) {
                this.close();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768 && this.isOpen) {
                this.close();
            }
        });
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.menu.classList.add('active');
        this.menuBtn.classList.add('active');
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.menu.classList.remove('active');
        this.menuBtn.classList.remove('active');
        this.isOpen = false;
        document.body.style.overflow = '';
    }
}

// Smooth Scrolling
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    this.scrollToElement(targetElement);
                }
            }
        });
    }

    scrollToElement(element) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const elementPosition = element.offsetTop - headerHeight - 20;

        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

// Parallax Effects
class ParallaxEffects {
    constructor() {
        this.elements = document.querySelectorAll('.hero-shape, .floating-element');
        this.init();
    }

    init() {
        if (this.elements.length > 0) {
            this.bindEvents();
        }
    }

    bindEvents() {
        let ticking = false;

        const updateParallax = () => {
            const scrollY = window.scrollY;

            this.elements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });

            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick);
    }
}

// Form Handling
class FormHandler {
    constructor() {
        this.newsletterForm = document.querySelector('.newsletter-form');
        this.init();
    }

    init() {
        if (this.newsletterForm) {
            this.bindEvents();
        }
    }

    bindEvents() {
        const submitBtn = this.newsletterForm.querySelector('.newsletter-btn');
        const emailInput = this.newsletterForm.querySelector('.newsletter-input');

        if (submitBtn && emailInput) {
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNewsletterSubmit(emailInput.value);
            });

            emailInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleNewsletterSubmit(emailInput.value);
                }
            });
        }
    }

    handleNewsletterSubmit(email) {
        if (this.validateEmail(email)) {
            this.showNotification('Hurray !! Your Email is now Registered!', 'success');
            console.log('Newsletter subscription:', email);
        } else {
            this.showNotification('Please enter a valid email address.', 'error');
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            color: white;
            font-weight: 600;
            z-index: 9999;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            ${type === 'success' ? 'background: #10b981;' : 'background: #ef4444;'}
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Accessibility Enhancements
class AccessibilityEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.addKeyboardNavigation();
        this.addFocusManagement();
    }

    addKeyboardNavigation() {
        const interactiveElements = document.querySelectorAll('.theme-toggle, .mobile-menu-btn');

        interactiveElements.forEach(element => {
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });
    }

    addFocusManagement() {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');

        if (mobileMenu && mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                setTimeout(() => {
                    if (mobileMenu.classList.contains('active')) {
                        const firstLink = mobileMenu.querySelector('.mobile-nav-link');
                        if (firstLink) firstLink.focus();
                    }
                }, 100);
            });
        }
    }
}

// Error Handling
class ErrorHandler {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('error', (e) => {
            console.error('JavaScript Error:', e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled Promise Rejection:', e.reason);
        });
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    try {
        const headerEffect = new HeaderScrollEffect();
        new ThemeManager(headerEffect);
        new MobileMenu();
        new SmoothScroll();
        new ParallaxEffects();
        new FormHandler();
        new AccessibilityEnhancer();
        new ErrorHandler();

        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            item.querySelector('.faq-question').addEventListener('click', () => {
                item.classList.toggle('active');
            });
        });

        const tabs = document.querySelectorAll('.faq-tab');
        const categories = document.querySelectorAll('.faq-category');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const selected = tab.getAttribute('data-category');
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                categories.forEach(cat => {
                    cat.style.display = (cat.getAttribute('data-category') === selected) ? 'block' : 'none';
                });
            });
        });

        document.body.classList.add('loaded');
        console.log('Learnix website initialized successfully!');
    } catch (error) {
        console.error('Error initializing website:', error);
    }
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
