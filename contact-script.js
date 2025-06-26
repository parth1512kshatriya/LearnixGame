// Import existing functionality
document.addEventListener('DOMContentLoaded', function () {
    // Theme Toggle Functionality (same as main site)
    const themeToggle = document.getElementById('themeToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    const termsCheckbox = document.getElementById('terms');
    const sendMessageBtn = document.getElementById('sendMessageBtn');

    // Initial state
    sendMessageBtn.disabled = !termsCheckbox.checked;

    // Enable/disable the button based on terms checkbox
    termsCheckbox.addEventListener('change', () => {
        sendMessageBtn.disabled = !termsCheckbox.checked;
    });


    // Check for saved theme preference or default to 'dark'
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

    // scroll to top button logic

    const scrollToTop = document.getElementById('scrollToTop');

    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 200) {
            scrollToTop.style.display = 'flex';
        }
        else {
            scrollToTop.style.display = 'none';
        }
    });

    scrollToTop.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });


    // Contact Form Functionality
    const contactForm = document.getElementById('contactForm');
    const formInputs = contactForm.querySelectorAll('input, select, textarea');

    // Form validation functions
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePhone(phone) {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }

    function validateName(name) {
        return name.length >= 2 && /^[a-zA-Z\s]+$/.test(name);
    }

    function showError(fieldName, message) {
        const errorElement = document.getElementById(fieldName + 'Error');
        const inputElement = document.getElementById(fieldName);

        if (errorElement && inputElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            inputElement.classList.add('error');
        }
    }

    function clearError(fieldName) {
        const errorElement = document.getElementById(fieldName + 'Error');
        const inputElement = document.getElementById(fieldName);

        if (errorElement && inputElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
            inputElement.classList.remove('error');
        }
    }

    function clearAllErrors() {
        const errorElements = document.querySelectorAll('.form-error');
        const inputElements = document.querySelectorAll('.error');

        errorElements.forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });

        inputElements.forEach(input => {
            input.classList.remove('error');
        });
    }

    // Real-time validation
    formInputs.forEach(input => {
        input.addEventListener('blur', function () {
            validateField(this);
        });

        input.addEventListener('input', function () {
            if (this.classList.contains('error')) {
                clearError(this.name);
            }
        });
    });

    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;

        switch (fieldName) {
            case 'firstName':
                if (!value) {
                    showError(fieldName, 'First name is required');
                    return false;
                } else if (!validateName(value)) {
                    showError(fieldName, 'Please enter a valid first name');
                    return false;
                } else {
                    clearError(fieldName);
                    return true;
                }

            case 'lastName':
                if (!value) {
                    showError(fieldName, 'Last name is required');
                    return false;
                } else if (!validateName(value)) {
                    showError(fieldName, 'Please enter a valid last name');
                    return false;
                } else {
                    clearError(fieldName);
                    return true;
                }

            case 'email':
                if (!value) {
                    showError(fieldName, 'Email address is required');
                    return false;
                } else if (!validateEmail(value)) {
                    showError(fieldName, 'Please enter a valid email address');
                    return false;
                } else {
                    clearError(fieldName);
                    return true;
                }

            case 'phone':
                if (value && !validatePhone(value)) {
                    showError(fieldName, 'Please enter a valid phone number');
                    return false;
                } else {
                    clearError(fieldName);
                    return true;
                }

            case 'subject':
                if (!value) {
                    showError(fieldName, 'Please select a subject');
                    return false;
                } else {
                    clearError(fieldName);
                    return true;
                }

            case 'message':
                if (!value) {
                    showError(fieldName, 'Message is required');
                    return false;
                } else if (value.length < 10) {
                    showError(fieldName, 'Message must be at least 10 characters long');
                    return false;
                } else {
                    clearError(fieldName);
                    return true;
                }

            case 'terms':
                if (!field.checked) {
                    showError(fieldName, 'You must agree to the terms and conditions');
                    return false;
                } else {
                    clearError(fieldName);
                    return true;
                }

            default:
                return true;
        }
    }

    // Form submission
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        clearAllErrors();
        let isValid = true;

        // Validate all required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'subject', 'message', 'terms'];

        requiredFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (!validateField(field)) {
                isValid = false;
            }
        });

        // Also validate optional phone field if filled
        const phoneField = document.getElementById('phone');
        if (phoneField.value.trim()) {
            if (!validateField(phoneField)) {
                isValid = false;
            }
        }

        if (isValid) {
            // Show loading state
            const submitBtn = document.querySelector('.contact-submit-btn');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span>Sending...</span>';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual submission logic)
            setTimeout(() => {
                // Show success message
                showNotification('Thank you! Your message has been sent successfully. We\'ll get back to you within 2 hours.', 'success');

                // Reset form
                contactForm.reset();

                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;

                // Optional: scroll to top or redirect
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });

            }, 2000);
        } else {
            // Scroll to first error
            const firstError = document.querySelector('.form-error[style*="block"]');
            if (firstError) {
                const errorField = firstError.previousElementSibling;
                errorField.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                errorField.focus();
            }
        }
    });

    // Contact Method Buttons
    const contactMethodBtns = document.querySelectorAll('.contact-method-btn');

    contactMethodBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const card = this.closest('.contact-method-card');
            const method = card.querySelector('h3').textContent;

            switch (method) {
                case 'Email Support':
                    window.location.href = 'mailto:support@learnixgame.com?subject=Support Request';
                    break;
                case 'Phone Support':
                    window.location.href = 'tel:+919311088577';
                    break;
                case 'WhatsApp Support':
                    window.open('https://wa.me/919311088577?text=Hi, I need help with Learnix', '_blank');
                    break;
                case 'Live Chat':
                    // Implement live chat functionality
                    showNotification('Live chat will be available soon! Please use other contact methods for now.', 'info');
                    break;
            }
        });
    });

    // Social Media Links
    const socialLinks = document.querySelectorAll('.contact-social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const platform = this.textContent.trim();
            showNotification(`${platform} page will be available soon!`, 'info');
        });
    });

    // Notification system (same as main site)
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    ${type === 'success' ? '<i class="fa-solid fa-check"></i>' :
                type === 'error' ? '<i class="fa-solid fa-exclamation-triangle"></i>' :
                    '<i class="fa-solid fa-info"></i>'}
                </div>
                <div class="notification-message">${message}</div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 0;
            border-radius: 0.75rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
            min-width: 300px;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentElement) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }

    // Add scroll animations
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

    // Observe contact elements
    const contactElements = document.querySelectorAll('.contact-method-card, .contact-stat, .contact-info-card, .contact-social-card');
    contactElements.forEach(element => {
        element.classList.add('animate-on-scroll');
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

    console.log('Contact page initialized successfully!');
});
