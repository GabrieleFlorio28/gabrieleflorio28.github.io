/**
 * Main JavaScript — Vincenzo Gabriele Florio Portfolio
 * Premium Cybersecurity Portfolio
 * 
 * Features:
 * - Smooth particle matrix rain background
 * - Typewriter effect with cursor
 * - Animated number counters
 * - Scroll-triggered reveal animations
 * - Sticky navbar scroll effects
 * - Mobile navigation toggle
 * - Terminal-style contact form simulation
 */

document.addEventListener("DOMContentLoaded", () => {

    // =========================================================================
    // 1. Mobile Navigation Toggle
    // =========================================================================
    const navToggle = document.getElementById("nav-toggle-btn");
    const navLinks = document.getElementById("nav-links-list");

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", () => {
            navLinks.classList.toggle("show");
            const icon = navToggle.querySelector("i");
            if (icon) {
                icon.className = navLinks.classList.contains("show")
                    ? "fa-solid fa-xmark"
                    : "fa-solid fa-bars";
            }
        });

        // Close nav when clicking a link (mobile UX)
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("show");
                const icon = navToggle.querySelector("i");
                if (icon) icon.className = "fa-solid fa-bars";
            });
        });
    }

    // =========================================================================
    // 2. Navbar Scroll Effect
    // =========================================================================
    const navbar = document.getElementById("main-navbar");
    if (navbar) {
        let lastScroll = 0;
        window.addEventListener("scroll", () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 50) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
            lastScroll = currentScroll;
        }, { passive: true });
    }

    // =========================================================================
    // 3. Typewriter Effect
    // =========================================================================
    const typingTextElement = document.getElementById("typing-text");
    if (typingTextElement) {
        const phrases = [
            "Cybersecurity Specialist",
            "Dottore in Informatica",
            "Docker & Container Security",
            "Linux Systems Administrator",
            "Penetration Testing Enthusiast"
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 80;

        function type() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                typingTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 40;
            } else {
                typingTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 80 + Math.random() * 40; // Natural typing feel
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                typingSpeed = 2500; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 600;
            }

            setTimeout(type, typingSpeed);
        }

        setTimeout(type, 1200);
    }

    // =========================================================================
    // 4. Matrix Rain Canvas (Optimized)
    // =========================================================================
    const canvas = document.getElementById("matrix-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");

        let width, height, columns, drops;
        const fontSize = 14;
        const charSet = "01アイウエオカキクケコサシスセソ{}[]<>/._$#@".split("");

        function initCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            columns = Math.floor(width / fontSize);
            drops = [];
            for (let i = 0; i < columns; i++) {
                drops[i] = Math.random() * -150;
            }
        }

        initCanvas();

        function drawMatrix() {
            // Trail effect
            ctx.fillStyle = "rgba(6, 10, 18, 0.06)";
            ctx.fillRect(0, 0, width, height);

            ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = charSet[Math.floor(Math.random() * charSet.length)];
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                // Vary colors between cyan and green tones
                const r = Math.random();
                if (r > 0.7) {
                    ctx.fillStyle = "rgba(0, 229, 255, 0.4)";
                } else if (r > 0.3) {
                    ctx.fillStyle = "rgba(0, 255, 136, 0.35)";
                } else {
                    ctx.fillStyle = "rgba(168, 85, 247, 0.25)";
                }

                ctx.fillText(text, x, y);

                if (y > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i]++;
            }
        }

        // Handle resize with debounce
        let resizeTimeout;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(initCanvas, 150);
        });

        // Run at ~28 FPS
        setInterval(drawMatrix, 36);
    }

    // =========================================================================
    // 5. Scroll-Triggered Reveal Animations
    // =========================================================================
    const revealElements = document.querySelectorAll(".reveal");

    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.08,
                rootMargin: "0px 0px -50px 0px",
            }
        );

        revealElements.forEach((el) => {
            revealObserver.observe(el);
        });
    }

    // =========================================================================
    // 6. Animated Number Counters
    // =========================================================================
    const statNumbers = document.querySelectorAll(".stat-number[data-target]");

    if (statNumbers.length > 0) {
        const counterObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const target = parseInt(el.getAttribute("data-target"), 10);
                        if (isNaN(target)) return;

                        let current = 0;
                        const increment = Math.max(1, Math.floor(target / 30));
                        const duration = 1500;
                        const stepTime = duration / (target / increment);

                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                current = target;
                                clearInterval(timer);
                            }
                            el.textContent = current;
                        }, stepTime);

                        counterObserver.unobserve(el);
                    }
                });
            },
            { threshold: 0.5 }
        );

        statNumbers.forEach((el) => {
            counterObserver.observe(el);
        });
    }

    // =========================================================================
    // 7. Interactive Contact Form (Terminal Simulation)
    // =========================================================================
    const contactForm = document.getElementById("contact-form-element");
    const logPanel = document.getElementById("terminal-upload-log");
    const alertSuccess = document.getElementById("form-alert-success");
    const alertError = document.getElementById("form-alert-error");

    if (contactForm && logPanel) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

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

            // Disable form
            toggleFormFields(true);
            logPanel.style.display = "block";

            // Reset log steps
            for (let i = 1; i <= 4; i++) {
                const step = document.getElementById(`log-step-${i}`);
                if (step) step.style.display = "none";
            }

            // Sequential terminal log simulation
            const steps = [
                { id: "log-step-1", delay: 700 },
                { id: "log-step-2", delay: 1400 },
                { id: "log-step-3", delay: 2200 },
                { id: "log-step-4", delay: 3000 },
            ];

            steps.forEach(({ id, delay }) => {
                setTimeout(() => showLogStep(id), delay);
            });

            // After complete
            setTimeout(() => {
                showAlert(alertSuccess);
                contactForm.reset();
                toggleFormFields(false);
                contactForm.parentElement.scrollIntoView({ behavior: "smooth" });
            }, 3800);
        });

        function showLogStep(id) {
            const step = document.getElementById(id);
            if (step) {
                step.style.display = "block";
                step.style.animation = "fadeIn 0.3s var(--ease-out) forwards";
            }
        }

        function showAlert(alertEl) {
            alertEl.style.display = "block";
            alertEl.style.animation = "fadeIn 0.4s var(--ease-out) forwards";
        }

        function toggleFormFields(disable) {
            const inputs = contactForm.querySelectorAll("input, textarea, button");
            inputs.forEach((input) => {
                input.disabled = disable;
                if (disable) {
                    input.style.opacity = "0.5";
                } else {
                    input.style.opacity = "1";
                }
            });
        }
    }

    // =========================================================================
    // 8. Smooth Page Transitions (Cursor Trail Effect)
    // =========================================================================
    // Add a subtle glow following the cursor
    const cursorGlow = document.createElement("div");
    cursorGlow.style.cssText = `
        position: fixed;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0, 229, 255, 0.04) 0%, transparent 70%);
        pointer-events: none;
        z-index: 9997;
        transform: translate(-50%, -50%);
        transition: left 0.15s ease-out, top 0.15s ease-out;
    `;
    document.body.appendChild(cursorGlow);

    document.addEventListener("mousemove", (e) => {
        cursorGlow.style.left = e.clientX + "px";
        cursorGlow.style.top = e.clientY + "px";
    });

});
