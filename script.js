// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('themeToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);

    // Theme toggle event listener
    themeToggle.addEventListener('click', function () {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', function () {
        mobileMenuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on links
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function () {
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (event) {
        if (!mobileMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
    });

    // FAQ Accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', function () {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Observe all elements with animate-on-scroll class
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(element => {
        observer.observe(element);
    });

    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Add/remove scrolled class for styling
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollTop = scrollTop;
    });

    // Add click handlers for CTA buttons
    const downloadButtons = document.querySelectorAll('.btn-primary');
    const demoButtons = document.querySelectorAll('.btn-secondary');

    downloadButtons.forEach(button => {
        if (button.textContent.includes('Download') || button.textContent.includes('Get')) {
            button.addEventListener('click', function () {
                // Add download tracking or redirect logic here
                console.log('Download button clicked');
                // Example: window.location.href = 'path-to-apk-file';
            });
        }
    });

    demoButtons.forEach(button => {
        if (button.textContent.includes('Demo') || button.textContent.includes('Watch')) {
            button.addEventListener('click', function () {
                // Add demo video modal or redirect logic here
                console.log('Demo button clicked');
                // Example: showVideoModal();
            });
        }
    });

    // Add feature card hover effects with staggered animation
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 100}ms`;
    });

    // Add highlight items staggered animation
    const highlightItems = document.querySelectorAll('.highlight-item');
    highlightItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 200}ms`;
    });

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    const newsletterInput = document.querySelector('.newsletter-input');
    const newsletterBtn = document.querySelector('.newsletter-btn');

    if (newsletterForm) {
        newsletterBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const email = newsletterInput.value.trim();

            if (email && isValidEmail(email)) {
                // Add newsletter subscription logic here
                console.log('Newsletter subscription:', email);
                newsletterInput.value = '';
                showNotification('Thank you for subscribing!', 'success');
            } else {
                showNotification('Please enter a valid email address', 'error');
            }
        });
    }

    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 100);
        }, 2000);
    }

    // Add parallax effect to background shapes
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-shape, .features-shape, .faq-shape');

        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });

    // Add typing effect to hero title (optional enhancement)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.innerHTML;
        const words = originalText.split(' ');
        let currentWord = 0;
        let currentChar = 0;
        let isDeleting = false;

        function typeEffect() {
            // This is a placeholder for a typing effect
            // You can implement this if you want the title to have a typing animation
        }
    }

    // Add loading animation for page load
    window.addEventListener('load', function () {
        document.body.classList.add('loaded');

        // Stagger animation for hero elements
        const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-description, .hero-stats, .hero-cta, .hero-rating');
        heroElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 200}ms`;
            element.classList.add('fade-in-up');
        });
    });

    // Add hover sound effects (optional)
    function addHoverSounds() {
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .feature-card');

        buttons.forEach(button => {
            button.addEventListener('mouseenter', function () {
                // Add subtle hover sound if needed
                // playHoverSound();
            });
        });
    }

    // Initialize all enhancements
    addHoverSounds();

    console.log('Learnix Quiz App initialized successfully!');
});

// scroll to top button logic

const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll',function(){
    if(window.pageYOffset > 200){
        scrollToTopBtn.style.display = 'flex';
    }
    else{
        scrollToTopBtn.style.display = 'none';
    }
});

scrollToTopBtn.addEventListener('click',function(){
    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
});
