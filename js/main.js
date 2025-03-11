// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Navigation functionality
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section');

    // Function to activate current section based on hash or default to home
    const activateSection = () => {
        const hash = window.location.hash || '#home';
        
        // Update active nav link
        navLinks.forEach(link => {
            if (link.getAttribute('href') === hash) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Show active section
        sections.forEach(section => {
            if (section.id === hash.substring(1)) {
                section.classList.add('active-section');
            } else {
                section.classList.remove('active-section');
            }
        });
    };

    // Initial activation
    activateSection();

    // Listen for hash changes
    window.addEventListener('hashchange', activateSection);

    // Smooth scrolling for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            const targetSection = document.querySelector(href);
            
            // Update active classes
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
            
            sections.forEach(section => section.classList.remove('active-section'));
            targetSection.classList.add('active-section');
            
            // Smooth scroll to the section
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update URL hash without causing jump
            history.pushState(null, null, href);
        });
    });
});

// Matrix Rain Background
class MatrixRain {
    constructor() {
        this.canvas = document.getElementById('matrix-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
        this.fontSize = 14;
        this.columns = 0;
        this.drops = [];
        this.initialize();
        
        // Handle window resize
        window.addEventListener('resize', () => this.initialize());
    }
    
    initialize() {
        // Set canvas dimensions
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Calculate columns based on canvas width
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        
        // Initialize drops at random y positions
        this.drops = [];
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = Math.random() * -100;
        }
        
        // Start the animation
        this.animate();
    }
    
    draw() {
        // Semi-transparent black to create fade effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#0f0'; // Matrix green
        this.ctx.font = `${this.fontSize}px monospace`;
        
        // Loop through drops
        for (let i = 0; i < this.drops.length; i++) {
            // Get random character
            const text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
            
            // Draw the character
            this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);
            
            // Move drop down
            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0; // Reset to top
            }
            
            this.drops[i]++;
        }
    }
    
    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize Matrix Effect
window.addEventListener('load', () => {
    new MatrixRain();
});

// Terminal typing effect
class TerminalTyping {
    constructor(elementSelector, textContent, speed = 50) {
        this.element = document.querySelector(elementSelector);
        this.textContent = textContent;
        this.speed = speed;
        this.index = 0;
        this.typing();
    }

    typing() {
        if (this.index < this.textContent.length) {
            this.element.textContent += this.textContent.charAt(this.index);
            this.index++;
            setTimeout(() => this.typing(), this.speed);
        }
    }
}

// Project cards hover effect
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.borderColor = 'var(--primary-color)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        });
    });
});
