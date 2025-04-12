// Set current year in footer
document.getElementById("current-year").textContent = new Date().getFullYear();

// Navigation functionality
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll("nav a");
  const sections = document.querySelectorAll("main section"); // Target sections within main
  let isAnimating = false; // Flag to prevent multiple animations

  // Set initial state: Hide all sections except the default one (usually #home)
  const initialHash = window.location.hash || "#home";
  sections.forEach((section) => {
    if (`#${section.id}` !== initialHash) {
      section.style.display = "none";
      section.style.opacity = "0";
    } else {
      section.classList.add("active-section"); // Keep the class for potential styling
      // Animate initial home section content
      animateHomeContent();
    }
  });

  // Update active nav link based on initial hash
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === initialHash) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Function to handle section transition
  const switchSection = (targetHash) => {
    if (isAnimating) return; // Don't start new animation if one is running
    isAnimating = true;

    const currentSection = document.querySelector("section.active-section");
    const targetSection = document.querySelector(targetHash);

    if (!targetSection || currentSection === targetSection) {
      isAnimating = false;
      return; // Target doesn't exist or is already active
    }

    // Update nav links immediately
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === targetHash);
    });

    const animationDefaults = {
      duration: 400, // Faster transition
      easing: "easeInOutQuad", // Smooth easing
    };

    // Animate out current section
    const animateOut = currentSection
      ? anime({
          targets: currentSection,
          opacity: [1, 0],
          translateY: [0, 15], // Slight downward movement
          ...animationDefaults,
          complete: () => {
            currentSection.classList.remove("active-section");
            currentSection.style.display = "none";
          },
        }).finished
      : Promise.resolve(); // If no current section, resolve immediately

    // Animate in new section after the current one starts fading
    animateOut.then(() => {
      targetSection.style.display = "block"; // Make it visible before animating
      targetSection.classList.add("active-section");
      anime({
        targets: targetSection,
        opacity: [0, 1],
        translateY: [-15, 0], // Slight upward movement
        ...animationDefaults,
        complete: () => {
          isAnimating = false; // Animation finished
          // Trigger content animations if needed
          if (targetHash === "#home") animateHomeContent();
          // Add other sections here later (e.g., if (targetHash === '#about') animateAboutContent();)
        },
      });
    });

    // Update URL hash
    history.pushState(null, null, targetHash);
  };

  // Listen for hash changes (e.g., browser back/forward)
  window.addEventListener("hashchange", () => {
    // Check if the hashchange was triggered by our own logic
    const currentActiveSection = document.querySelector("section.active-section");
    if (`#${currentActiveSection?.id}` !== window.location.hash) {
      switchSection(window.location.hash || "#home");
    }
  });

  // Handle clicks on nav links
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetHash = link.getAttribute("href");
      // Only switch if the target isn't already active
      const currentActiveSection = document.querySelector("section.active-section");
      if (`#${currentActiveSection?.id}` !== targetHash) {
        switchSection(targetHash);
      }
    });
  });

  // Function to animate home section content
  function animateHomeContent() {
    const homeSection = document.querySelector("#home");
    if (!homeSection) return;

    const h1 = homeSection.querySelector(".response h1");
    const subtitle = homeSection.querySelector(".response .subtitle");
    const skills = homeSection.querySelectorAll(".response.skills .skill");
    const commands = homeSection.querySelectorAll(".typing-animation > .command"); // Select only direct children commands
    const prompts = homeSection.querySelectorAll(".typing-animation > .prompt"); // Select only direct children prompts

    // Reset styles before animation
    const elementsToReset = [h1, subtitle, ...skills, ...commands, ...prompts];
    elementsToReset.forEach((el) => {
      if (el) {
        el.style.opacity = 0;
        el.style.transform = "translateY(10px)";
      }
    });

    anime
      .timeline({
        easing: "easeOutExpo",
        delay: anime.stagger(75), // Reduced overall stagger
      })
      .add({ targets: prompts[0], opacity: [0, 1], translateY: [10, 0], delay: 100 }) // Reduced initial delay
      .add({ targets: commands[0], opacity: [0, 1], translateY: [10, 0] })
      .add({ targets: h1, opacity: [0, 1], translateY: [10, 0] }, "-=40") // Slightly reduced overlap delay
      .add({ targets: subtitle, opacity: [0, 1], translateY: [10, 0] }, "-=40") // Slightly reduced overlap delay
      .add({ targets: prompts[1], opacity: [0, 1], translateY: [10, 0] })
      .add({ targets: commands[1], opacity: [0, 1], translateY: [10, 0] })
      .add(
        {
          targets: skills,
          opacity: [0, 1],
          translateY: [10, 0],
          delay: anime.stagger(35), // Reduced skills stagger
        },
        "-=40"
      ); // Slightly reduced overlap delay

    // Animate timeline items on scroll
    const timelineItems = document.querySelectorAll("#experience .timeline-item");

    const observerOptions = {
      root: null, // Use the viewport as the root
      rootMargin: "0px",
      threshold: 0.1, // Trigger when 10% of the item is visible
    };

    const observerCallback = (entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add a class to trigger animation via CSS or use Anime.js directly
          anime({
            targets: entry.target,
            opacity: [0, 1],
            translateY: [20, 0], // Slide up effect
            delay: index * 100, // Stagger animation based on order
            duration: 600,
            easing: "easeOutQuad",
          });
          observer.unobserve(entry.target); // Stop observing once animated
        }
      });
    };

    const experienceObserver = new IntersectionObserver(observerCallback, observerOptions);

    // Initially hide items and start observing
    timelineItems.forEach((item) => {
      item.style.opacity = "0"; // Hide elements initially
      experienceObserver.observe(item);
    });

    // Animate Stats on scroll
    const statsContainer = document.querySelector("#about .stats");
    const statValues = document.querySelectorAll("#about .stat-value");

    if (statsContainer && statValues.length > 0) {
      const statsObserverOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.5, // Trigger when 50% of the container is visible
      };

      let statsAnimated = false; // Flag to ensure animation runs only once

      const statsObserverCallback = (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true; // Set flag

            statValues.forEach((statValue, index) => {
              const targetValue = parseInt(statValue.textContent.replace("+", ""), 10); // Get target number
              const dummy = { value: 0 }; // Dummy object to animate

              anime({
                targets: dummy,
                value: targetValue,
                round: 1, // Round to whole numbers
                easing: "easeOutExpo",
                duration: 1500,
                delay: index * 150, // Stagger the start of each stat animation
                update: function () {
                  // Update the element's text content
                  statValue.textContent = Math.round(dummy.value) + (statValue.textContent.includes("+") ? "+" : "");
                },
              });

              // Also fade in the stat element itself
              anime({
                targets: statValue.closest(".stat"), // Target the parent .stat container
                opacity: [0, 1],
                translateY: [10, 0],
                duration: 800,
                delay: index * 150,
                easing: "easeOutQuad",
              });
            });

            observer.unobserve(entry.target); // Stop observing once animated
          }
        });
      };

      const statsObserver = new IntersectionObserver(statsObserverCallback, statsObserverOptions);

      // Initially hide stats
      statValues.forEach((stat) => {
        const statContainer = stat.closest(".stat");
        if (statContainer) {
          statContainer.style.opacity = "0";
        }
      });

      // Start observing the stats container
      statsObserver.observe(statsContainer);
    }
  }
});

// Matrix Rain Background
class MatrixRain {
  constructor() {
    this.canvas = document.getElementById("matrix-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.characters = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";
    this.fontSize = 14;
    this.columns = 0;
    this.drops = [];
    this.initialize();

    // Handle window resize
    window.addEventListener("resize", () => this.initialize());
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
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "#0f0"; // Matrix green
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
window.addEventListener("load", () => {
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
document.addEventListener("DOMContentLoaded", () => {
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    let hoverAnimation = null; // Store animation instance
    card.addEventListener("mouseenter", () => {
      // Kill previous animation if running
      if (hoverAnimation) hoverAnimation.pause();

      hoverAnimation = anime({
        targets: card,
        borderColor: ["rgba(255, 255, 255, 0.1)", "var(--primary-color)"], // Animate border color
        scale: [1, 1.03], // Add scale effect
        translateZ: 0, // Force hardware acceleration
        duration: 300,
        easing: "easeOutQuad",
      });
    });

    card.addEventListener("mouseleave", () => {
      // Kill previous animation if running
      if (hoverAnimation) hoverAnimation.pause();

      hoverAnimation = anime({
        targets: card,
        borderColor: ["var(--primary-color)", "rgba(255, 255, 255, 0.1)"], // Animate border back
        scale: [1.03, 1], // Scale back
        translateZ: 0,
        duration: 300,
        easing: "easeOutQuad",
      });
    });
  });

  // Nav link hover
  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach((link) => {
    let hoverAnimation = null;
    link.addEventListener("mouseenter", () => {
      if (hoverAnimation) hoverAnimation.pause();
      hoverAnimation = anime({
        targets: link,
        translateY: [0, -2],
        duration: 200,
        easing: "easeOutQuad",
      });
    });
    link.addEventListener("mouseleave", () => {
      if (hoverAnimation) hoverAnimation.pause();
      hoverAnimation = anime({
        targets: link,
        translateY: [-2, 0],
        duration: 200,
        easing: "easeOutQuad",
      });
    });
  });

  // Skill tag hover
  // Debounce adding listeners until home animation is likely complete
  setTimeout(() => {
    const skillTags = document.querySelectorAll("#home .skill");
    skillTags.forEach((tag) => {
      let hoverAnimation = null;
      tag.addEventListener("mouseenter", () => {
        if (hoverAnimation) hoverAnimation.pause();
        hoverAnimation = anime({
          targets: tag,
          scale: [1, 1.1],
          translateZ: 0,
          backgroundColor: "var(--primary-color)", // Optional: highlight background
          color: "var(--background-color)", // Optional: change text color
          duration: 200,
          easing: "easeOutQuad",
        });
      });
      tag.addEventListener("mouseleave", () => {
        if (hoverAnimation) hoverAnimation.pause();
        hoverAnimation = anime({
          targets: tag,
          scale: [1.1, 1],
          translateZ: 0,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          color: "var(--text-color)",
          duration: 200,
          easing: "easeOutQuad",
        });
      });
    });
  }, 1500); // Adjust delay as needed based on home animation timing

  // Contact link icon hover
  const contactIcons = document.querySelectorAll(".contact-link i");
  contactIcons.forEach((icon) => {
    let hoverAnimation = null;
    const link = icon.closest(".contact-link"); // Get the parent link

    link.addEventListener("mouseenter", () => {
      if (hoverAnimation) hoverAnimation.pause();
      hoverAnimation = anime({
        targets: icon,
        translateY: [0, -3],
        rotate: [0, 5], // Slight rotation
        scale: [1, 1.1], // Slightly bigger
        color: "var(--primary-color)", // Highlight color
        duration: 250,
        easing: "easeOutBack", // Add a little bounce
      });
    });

    link.addEventListener("mouseleave", () => {
      if (hoverAnimation) hoverAnimation.pause();
      hoverAnimation = anime({
        targets: icon,
        translateY: [-3, 0],
        rotate: [5, 0],
        scale: [1.1, 1],
        color: "var(--text-color)", // Back to default
        duration: 250,
        easing: "easeOutQuad",
      });
    });
  });
});
