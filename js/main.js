// Main JavaScript for Annan Shrestha Portfolio

document.addEventListener('DOMContentLoaded', function() {
    // Resource hints for better performance
    const links = [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://cdnjs.cloudflare.com' },
        { rel: 'preconnect', href: 'https://cdn.jsdelivr.net' }
    ];

    links.forEach(({rel, href}) => {
        const link = document.createElement('link');
        link.rel = rel;
        link.href = href;
        document.head.appendChild(link);
    });

    // Optimize background image loading with smooth transition
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        console.log('Hero background element found, starting image preload...');
        
        // Ensure the CSS background image loads immediately
        heroBackground.style.backgroundImage = "url('images/back.jpg')";
        
        // Create a new image to preload for better performance
        const img = new Image();
        img.onload = function() {
            console.log('Background image loaded successfully');
            // Image is loaded, ensure full opacity
            heroBackground.style.opacity = '1';
        };
        img.onerror = function() {
            console.log('Background image failed to load, using fallback');
            // Fallback: use solid color if image fails
            heroBackground.style.backgroundColor = '#1e293b';
            heroBackground.style.backgroundImage = 'none';
            heroBackground.style.opacity = '1';
        };
        img.src = 'images/back.jpg';
    } else {
        console.log('Hero background element not found');
    }

    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,
        once: true,
        mirror: false,
        offset: 100
    });

    // Typing animation
    const texts = [
        'GIS Analyst',
        'Spatial Analyst',
        'Remote Sensing Expert',
        'Environmental Mapper',
        'Web Mapping',
        'Data Scientist',
        'Cartographer',
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typedTextElement = document.querySelector('.typed-text');
    
    function typeAnimation() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typedTextElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            setTimeout(() => isDeleting = true, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }
        
        const speed = isDeleting ? 50 : 100;
        setTimeout(typeAnimation, speed);
    }
    
    // Start typing animation
    if (typedTextElement) {
        typeAnimation();
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            // Ignore if href is just "#"
            if (targetId === '#') return;
            e.preventDefault();
            const target = document.querySelector(targetId);
            
            if (target) {
                const navbarHeight = document.querySelector('#mainNav').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active navigation link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveNav() {
        let currentSection = '';
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Throttled scroll event listener
    let scrollTimer;
    window.addEventListener('scroll', () => {
        if (scrollTimer) {
            clearTimeout(scrollTimer);
        }
        scrollTimer = setTimeout(updateActiveNav, 10);
    });

    // Progress bar animation
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.setProperty('--target-width', width + '%');
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width + '%';
            }, 200);
            
            // Animate number counting
            const badge = bar.closest('.skill-item')?.querySelector('.badge');
            if (badge) {
                const targetValue = parseInt(width);
                animateValue(badge, 0, targetValue, 1500);
            }
        });
    }

    // Trigger when skills section comes into view
    const skillsSection = document.querySelector('#skills');
    if (skillsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateProgressBars();
                    observer.unobserve(entry.target);
                }
            });
        });
        observer.observe(skillsSection);
    }

    // Animate value counting
    function animateValue(element, start, end, duration) {
        const startTime = performance.now();
        const startValue = start;
        const endValue = end;
        
        function updateValue(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const currentValue = Math.round(startValue + (endValue - startValue) * easedProgress);
            
            element.textContent = currentValue + '%';
            
            if (progress < 1) {
                requestAnimationFrame(updateValue);
            }
        }
        
        requestAnimationFrame(updateValue);
    }

    // Easing function
    function easeOutQuart(t) {
        return 1 - (--t) * t * t * t;
    }

    // Contact form handling
    function validateForm(formData) {
        const email = formData.get('email');
        const message = formData.get('message');
        
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return false;
        }
        
        if (message.length < 10) {
            showNotification('Message must be at least 10 characters long', 'error');
            return false;
        }
        
        return true;
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            if (!validateForm(formData)) {
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
            submitBtn.disabled = true;
            
            // Get form data
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Create mailto link
            const mailtoLink = `mailto:annanshrestha1@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
            
            // Simulate sending delay
            setTimeout(() => {
                // Open email client
                window.location.href = mailtoLink;
                
                // Show success message
                showNotification('Thank you for your message! Your email client should open now.', 'success');
                
                // Reset form
                this.reset();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1000);
        });
    }

    // Show notification function
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'success' ? 'success' : 'info'} position-fixed`;
        notification.style.cssText = `
            top: 100px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            border: none;
            border-radius: 10px;
        `;
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
                ${message}
                <button type="button" class="btn-close ms-auto" aria-label="Close"></button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
        
        // Remove on close button click
        notification.querySelector('.btn-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    // Navbar background on scroll with glassmorphism
    const navbar = document.getElementById('mainNav');
    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', updateNavbar);
    updateNavbar(); // Initial call

    // Enhanced skill animations
    function animateSkills() {
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach((item, index) => {
            const progressBar = item.querySelector('.skill-progress');
            const circleProgress = item.querySelector('.skill-circle-progress');
            const skillBar = item.querySelector('.skill-bar');
            const percentage = parseInt(skillBar.getAttribute('data-width'));
            
            // Add animation class for shimmer effect
            setTimeout(() => {
                item.classList.add('animate');
            }, index * 200);
            
            // Animate progress bar
            setTimeout(() => {
                progressBar.style.width = percentage + '%';
            }, index * 200 + 300);
            
            // Animate circular progress
            const circumference = 2 * Math.PI * 25; // radius = 25
            const strokeDashoffset = circumference - (percentage / 100) * circumference;
            
            setTimeout(() => {
                circleProgress.style.strokeDashoffset = strokeDashoffset;
            }, index * 200 + 300);
        });
    }

    // Enhanced skill section observer (replacing the old one)
    const enhancedSkillsSection = document.querySelector('#skills');
    if (enhancedSkillsSection) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkills();
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        skillsObserver.observe(enhancedSkillsSection);
    }

    // Enhanced scroll animations for all sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add stagger animation to child elements
                const children = entry.target.querySelectorAll('.card, .project-card, .cert-card, .contact-card, .timeline-item, .education-item');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Observe all sections for enhanced animations
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        sectionObserver.observe(section);
    });

    // Add parallax effect to hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            const particles = heroSection.querySelectorAll('.particle');
            
            particles.forEach((particle, index) => {
                const speed = (index + 1) * 0.1;
                particle.style.transform = `translateY(${rate * speed}px)`;
            });
        });
    }

    // Mobile menu handling
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    }

    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));

    // Add loading states to external links
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.addEventListener('click', function() {
            if (this.target === '_blank') {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Opening...';
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            }
        });
    });

    // Initialize tooltips if Bootstrap is available
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Print optimization
    window.addEventListener('beforeprint', () => {
        document.body.classList.add('printing');
    });
    
    window.addEventListener('afterprint', () => {
        document.body.classList.remove('printing');
    });

    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log('Page load time:', loadTime + 'ms');
        });
    }

    // Error handling for failed image loads
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn('Failed to load image:', this.src);
        });
    });

    // Back to Top Button functionality
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Enhanced keyboard navigation
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && navbarCollapse?.classList.contains('show')) {
            navbarToggler.click();
        }
        
        // Alt + number keys for quick navigation
        if (e.altKey && !isNaN(e.key)) {
            const index = parseInt(e.key) - 1;
            const sections = ['home', 'about', 'skills', 'experience', 'projects', 'certifications', 'contact'];
            if (sections[index]) {
                e.preventDefault();
                document.querySelector(`#${sections[index]}`).scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    console.log('Portfolio initialized successfully! 🚀');
});

// Loading screen functionality
window.addEventListener('load', function() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.opacity = '0';
        setTimeout(() => {
            loading.style.display = 'none';
        }, 500);
    }
});