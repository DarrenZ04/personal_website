// Loading Bar Animation
const loadingBar = document.getElementById('loadingBar');
const loadingProgress = document.getElementById('loadingProgress');
const loadingPercentage = document.getElementById('loadingPercentage');

function simulateLoading() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            loadingProgress.style.width = '100%';
            loadingPercentage.textContent = '100%';
            setTimeout(() => {
                loadingBar.classList.add('hidden');
                // Start page animations after loading
                initPageAnimations();
            }, 500);
        } else {
            const roundedProgress = Math.min(Math.round(progress), 99);
            loadingProgress.style.width = progress + '%';
            loadingPercentage.textContent = roundedProgress + '%';
        }
    }, 100);
}

// Initialize loading on page load
if (document.readyState === 'complete') {
    simulateLoading();
} else {
    window.addEventListener('load', () => {
        simulateLoading();
    });
}

// Fallback: if page loads very quickly, still show loading animation briefly
document.addEventListener('DOMContentLoaded', () => {
    // Ensure minimum loading time for smooth transition
    setTimeout(() => {
        if (loadingProgress.style.width === '0%' || !loadingProgress.style.width) {
            simulateLoading();
        }
    }, 100);
});

// Initialize page animations
function initPageAnimations() {
    // Animate navbar
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        setTimeout(() => {
            navbar.classList.add('loaded');
        }, 100);
    }

    // Animate hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.add('animate');
        }, 300);
    }

    // Animate sections on scroll
    const sections = document.querySelectorAll('.section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Animate about image container
                if (entry.target.id === 'about') {
                    const aboutImageContainer = document.querySelector('.about-image-container');
                    if (aboutImageContainer) {
                        setTimeout(() => {
                            aboutImageContainer.classList.add('animate');
                        }, 200);
                    }
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Animate cards with stagger effect
    animateCards();
}

// Animate cards with stagger
function animateCards() {
    const projectCards = document.querySelectorAll('.project-card');
    const courseworkCards = document.querySelectorAll('.coursework-card');
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    [...projectCards, ...courseworkCards].forEach(card => {
        cardObserver.observe(card);
    });

    // Animate social links
    const socialLinks = document.querySelectorAll('.social-link');
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
        const socialObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    socialLinks.forEach((link, index) => {
                        setTimeout(() => {
                            link.classList.add('animate');
                        }, index * 150);
                    });
                }
            });
        }, {
            threshold: 0.2
        });
        socialObserver.observe(contactSection);
    }
}

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger icon
    const spans = hamburger.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(8px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Cards are now animated by the animateCards() function

// Add active state to navigation links based on scroll position
const sections = document.querySelectorAll('.section, .hero');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id') || 'about';
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}` || 
            (current === '' && link.getAttribute('href') === '#about')) {
            link.classList.add('active');
        }
    });
});

// Profile Image Loading
const profileImage = document.getElementById('profileImage');
const imagePlaceholder = document.getElementById('imagePlaceholder');

if (profileImage && imagePlaceholder) {
    profileImage.onload = function() {
        profileImage.classList.add('loaded');
        imagePlaceholder.classList.add('hidden');
    };
    
    profileImage.onerror = function() {
        profileImage.classList.remove('loaded');
        imagePlaceholder.classList.remove('hidden');
    };
    
    // Try to load the image
    const img = new Image();
    img.onload = function() {
        profileImage.classList.add('loaded');
        imagePlaceholder.classList.add('hidden');
    };
    img.onerror = function() {
        profileImage.classList.remove('loaded');
        imagePlaceholder.classList.remove('hidden');
    };
    img.src = profileImage.src;
}

