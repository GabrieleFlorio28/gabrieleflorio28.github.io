/**
 * Main JavaScript File - Vincenzo Gabriele Florio Portfolio
 * Handles general page behaviors, typewriter text, navbar menu,
 * matrix rain canvas, scroll-reveal animations, and interactive contact form logic.
 */

document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Mobile Navbar Toggle ---
    const navToggle = document.getElementById("nav-toggle-btn");
    const navLinks = document.getElementById("nav-links-list");

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", () => {
            navLinks.classList.toggle("show");
            // Change hamburger icon to close mark on toggle
            const icon = navToggle.querySelector("i");
            if (icon) {
                if (navLinks.classList.contains("show")) {
                    icon.className = "fa-solid fa-xmark";
                } else {
                    icon.className = "fa-solid fa-bars";
                }
            }
        });
    }

    // --- 2. Terminal Typewriter Effect ---
    const typingTextElement = document.getElementById("typing-text");
    if (typingTextElement) {
        const phrases = [
            "Dottore di Primo Livello in Informatica",
            "Cybersecurity Enthusiast",
            "Docker & DevOps Specialist",
            "Linux Systems Administrator"
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                // Delete characters
                typingTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50; // Deleting is faster
            } else {
                // Type characters
                typingTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            // Check if word is fully typed
            if (!isDeleting && charIndex === currentPhrase.length) {
                // Pause at the end of the typed word
                typingSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                // Move to next phrase
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 500; // Pause before typing next word
            }

            setTimeout(type, typingSpeed);
        }

        // Initialize typewriter
        setTimeout(type, 1000);
    }

    // --- 3. Matrix Rain Canvas Background ---
    const canvas = document.getElementById("matrix-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        // Columns for matrix rain drops
        const fontSize = 14;
        let columns = Math.floor(width / fontSize);
        let drops = [];

        // Initialize rain drops (Y coordinates)
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }

        // Characters to display (mix of binary and security-related characters)
        const charSet = "0101011001010101ABCDEFUX/.->[]{}_$".split("");

        function drawMatrix() {
            // Dark transparent background overlay to create trails
            ctx.fillStyle = "rgba(10, 12, 16, 0.05)";
            ctx.fillRect(0, 0, width, height);

            // Draw characters
            ctx.font = `${fontSize}px 'Fira Code', monospace`;

            for (let i = 0; i < drops.length; i++) {
                // Random char
                const text = charSet[Math.floor(Math.random() * charSet.length)];
                
                // Color variation: mostly cyan/green, very subtle
                const isGreen = Math.random() > 0.5;
                ctx.fillStyle = isGreen ? "rgba(0, 255, 102, 0.35)" : "rgba(0, 240, 255, 0.35)";

                // X & Y coordinates
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                ctx.fillText(text, x, y);

                // Reset drop to top if it reaches end of screen, or randomly to create stagger
                if (y > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                // Move drop down
                drops[i]++;
            }
        }

        // Handle window resizing
        window.addEventListener("resize", () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            columns = Math.floor(width / fontSize);
            drops = [];
            for (let i = 0; i < columns; i++) {
                drops[i] = Math.random() * -100;
            }
        });

        // Run rain loop at ~30 FPS for smooth background
        setInterval(drawMatrix, 35);
    }

    // --- 4. Scroll-Triggered Reveal Animations ---
    const revealElements = document.querySelectorAll(".reveal");
    
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    // Don't unobserve — keep it as-is for a one-time reveal
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -40px 0px"
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // --- 5. Interactive Contact Form (Terminal Simulation) ---
    const contactForm = document.getElementById("contact-form-element");
    const logPanel = document.getElementById("terminal-upload-log");
    const alertSuccess = document.getElementById("form-alert-success");
    const alertError = document.getElementById("form-alert-error");

    if (contactForm && logPanel) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Validate inputs
            const name = document.getElementById("form-name").value.trim();
            const email = document.getElementById("form-email").value.trim();
            const subject = document.getElementById("form-subject").value.trim();
            const message = document.getElementById("form-message").value.trim();

            if (!name || !email || !subject || !message) {
                showAlert(alertError);
                return;
            }

            // Hide previous alerts
            alertSuccess.style.display = "none";
            alertError.style.display = "none";

            // Disable form and show log panel
            toggleFormFields(true);
            logPanel.style.display = "block";
            
            // Clear previous step visibilities
            document.getElementById("log-step-1").style.display = "none";
            document.getElementById("log-step-2").style.display = "none";
            document.getElementById("log-step-3").style.display = "none";
            document.getElementById("log-step-4").style.display = "none";

            // Trigger log sequential simulation steps
            setTimeout(() => {
                showLogStep("log-step-1");
            }, 600);

            setTimeout(() => {
                showLogStep("log-step-2");
            }, 1300);

            setTimeout(() => {
                showLogStep("log-step-3");
            }, 2000);

            setTimeout(() => {
                showLogStep("log-step-4");
                
                // Show success, re-enable fields, and clear inputs
                setTimeout(() => {
                    showAlert(alertSuccess);
                    contactForm.reset();
                    toggleFormFields(false);
                    // Smooth scroll to top of card to see alert
                    contactForm.parentElement.scrollIntoView({ behavior: "smooth" });
                }, 800);

            }, 2800);
        });

        function showLogStep(id) {
            const step = document.getElementById(id);
            if (step) {
                step.style.display = "block";
                // Play tiny typing sound or dynamic terminal vibe (visual suffices)
            }
        }

        function showAlert(alertEl) {
            alertEl.style.display = "block";
            alertEl.style.animation = "fadeIn 0.3s ease forwards";
        }

        function toggleFormFields(disable) {
            const inputs = contactForm.querySelectorAll("input, textarea, button");
            inputs.forEach(input => {
                input.disabled = disable;
            });
        }
    }
});
