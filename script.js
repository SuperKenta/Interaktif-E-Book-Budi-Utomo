/**
 * MathPro - Kalkulator Barisan & Deret Aritmatika
 * Improved JavaScript with better error handling, performance, and best practices
 */

// ============================================
// Initialization
// ============================================

/**
 * Initialize the application
 * Uses DOMContentLoaded for better performance and reliability
 */
function initApp() {
    // Cache DOM elements for better performance
    cacheElements();
    
    // Set up event listeners with proper error handling
    setupEventListeners();
    
    // Display welcome message using DOM (better UX than alert)
    showWelcomeMessage();
}

/**
 * Display welcome message in the UI
 * @param {string} message - The welcome message to display
 */
function showWelcomeMessage(message = 'Welcome to Your Calculator!') {
    const welcomeElement = document.getElementById('welcome-message');
    if (welcomeElement) {
        welcomeElement.textContent = message;
        welcomeElement.classList.add('show');
        
        // Auto-hide after 5 seconds for better UX
        setTimeout(() => {
            welcomeElement.classList.remove('show');
        }, CONFIG.ERROR_DISPLAY_DURATION);
    } else {
        // Fallback to console if element doesn't exist
        console.log(message);
    }
}

(function() {
    'use strict';

    // ============================================
    // Configuration & Constants
    // ============================================
    const CONFIG = {
        ANIMATION_DURATION: 300,
        SCROLL_BEHAVIOR: 'smooth',
        ERROR_DISPLAY_DURATION: 5000
    };

    // DOM Element Cache for performance
    const elements = {
        barisanForm: null,
        deretForm: null,
        calculatorForms: null,
        barisanResult: null,
        deretResult: null
    };

    // ============================================
    // Utility Functions
    // ============================================

    /**
     * Safely get element by ID with caching
     * @param {string} id - Element ID
     * @returns {HTMLElement|null}
     */
    function getElement(id) {
        return document.getElementById(id);
    }

    /**
     * Parse float with validation
     * @param {string|number} value - Input value
     * @returns {number|null}
     */
    function parseNumber(value) {
        if (value === '' || value === null || value === undefined) {
            return null;
        }
        const num = parseFloat(value);
        return isNaN(num) ? null : num;
    }

    /**
     * Parse integer with validation
     * @param {string|number} value - Input value
     * @returns {number|null}
     */
    function parseInteger(value) {
        if (value === '' || value === null || value === undefined) {
            return null;
        }
        const num = parseInt(value, 10);
        return isNaN(num) ? null : num;
    }

    /**
     * Show error message in designated container
     * @param {string} elementId - Error container element ID
     * @param {string} message - Error message
     */
    function showError(elementId, message) {
        const errorElement = getElement(elementId);
        if (!errorElement) return;

        errorElement.textContent = message;
        errorElement.classList.add('visible');
        errorElement.setAttribute('aria-hidden', 'false');

        // Auto-hide after duration
        setTimeout(() => {
            hideError(elementId);
        }, CONFIG.ERROR_DISPLAY_DURATION);
    }

    /**
     * Hide error message
     * @param {string} elementId - Error container element ID
     */
    function hideError(elementId) {
        const errorElement = getElement(elementId);
        if (!errorElement) return;

        errorElement.classList.remove('visible');
        errorElement.setAttribute('aria-hidden', 'true');
        errorElement.textContent = '';
    }

    /**
     * Smooth scroll to element
     * @param {string|HTMLElement} target - Target element or selector
     */
    function smoothScrollTo(target) {
        const element = typeof target === 'string' ? getElement(target.replace('#', '')) : target;
        if (!element) return;

        // Check if element is visible (not hidden by CSS)
        const style = window.getComputedStyle(element);
        if (style.display === 'none') {
            // If hidden, scroll to parent section
            const parent = element.closest('section') || element.parentElement;
            if (parent) {
                parent.scrollIntoView({ behavior: CONFIG.SCROLL_BEHAVIOR });
                return;
            }
        }
        
        element.scrollIntoView({ behavior: CONFIG.SCROLL_BEHAVIOR });
    }

    /**
     * Format number for display (handle large numbers and decimals)
     * @param {number} num - Number to format
     * @returns {string}
     */
    function formatNumber(num) {
        if (!Number.isFinite(num)) {
            return 'Tak Terhingga';
        }
        
        // Handle very large or very small numbers with scientific notation
        if (Math.abs(num) >= 1e15 || (Math.abs(num) < 1e-6 && num !== 0)) {
            return num.toExponential(4);
        }
        
        // Round to reasonable decimal places
        const rounded = Math.round(num * 10000) / 10000;
        
        // Format with thousand separators
        return rounded.toLocaleString('id-ID', {
            maximumFractionDigits: 4,
            minimumFractionDigits: 0
        });
    }

    /**
     * Format formula display with proper signs
     * @param {number} num - Number to format
     * @returns {string}
     */
    function formatFormulaNumber(num) {
        if (num >= 0) {
            return num.toString();
        }
        return `(${num})`;
    }

    // ============================================
    // Calculator Functions
    // ============================================

    /**
     * Show the selected calculator form
     * @param {string} type 
     */
    window.showCalculator = function(type) {
        // Initialize elements if not cached
        if (!elements.barisanForm) {
            elements.barisanForm = getElement('barisan-form');
            elements.deretForm = getElement('deret-form');
            elements.calculatorForms = getElement('calculator-forms');
            elements.barisanResult = getElement('barisan-result');
            elements.deretResult = getElement('deret-result');
        }

        // Validate type
        if (type !== 'barisan' && type !== 'deret') {
            console.warn('Invalid calculator type:', type);
            return;
        }

        // Hide results when switching calculators
        hideError('barisan-error');
        hideError('deret-error');

        if (elements.barisanResult) {
            elements.barisanResult.classList.add('hidden');
            elements.barisanResult.setAttribute('aria-hidden', 'true');
        }
        if (elements.deretResult) {
            elements.deretResult.classList.add('hidden');
            elements.deretResult.setAttribute('aria-hidden', 'true');
        }

        // Show the selected form
        if (type === 'barisan') {
            elements.barisanForm.classList.remove('hidden');
            elements.barisanForm.setAttribute('aria-hidden', 'false');
            elements.deretForm.classList.add('hidden');
            elements.deretForm.setAttribute('aria-hidden', 'true');
            
            // Focus first input for accessibility
            setTimeout(() => {
                const firstInput = getElement('barisan-a');
                if (firstInput) firstInput.focus();
            }, CONFIG.ANIMATION_DURATION);
        } else {
            elements.deretForm.classList.remove('hidden');
            elements.deretForm.setAttribute('aria-hidden', 'false');
            elements.barisanForm.classList.add('hidden');
            elements.barisanForm.setAttribute('aria-hidden', 'true');
            
            // Focus first input for accessibility
            setTimeout(() => {
                const firstInput = getElement('deret-a');
                if (firstInput) firstInput.focus();
            }, CONFIG.ANIMATION_DURATION);
        }

        // Scroll to forms section
        if (elements.calculatorForms) {
            smoothScrollTo(elements.calculatorForms);
        }
    };

    /**
     * Validate input for arithmetic sequence calculations
     * @param {number} a - First term
     * @param {number} b - Common difference
     * @param {number} n - Term number
     * @returns {object} - Validation result with isValid and errors array
     */
    function validateBarisanInput(a, b, n) {
        const errors = [];

        if (a === null) {
            errors.push('Suku pertama (a) harus diisi');
        }
        if (b === null) {
            errors.push('Beda (b) harus diisi');
        }
        if (n === null) {
            errors.push('Suku ke-n (n) harus diisi');
        }
        if (n !== null && (n < 1 || !Number.isInteger(n))) {
            errors.push('Nilai n harus bilangan bulat positif');
        }
        if (n !== null && n > 1e7) {
            errors.push('Nilai n terlalu besar (maksimal 10.000.000)');
        }

        // Check for potential overflow
        if (a !== null && b !== null && n !== null) {
            const un = a + (n - 1) * b;
            if (!Number.isFinite(un)) {
                errors.push('Hasil perhitungan terlalu besar');
            }
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Calculate Barisan Aritmatika (Arithmetic Sequence)
     * Formula: Un = a + (n-1) * b
     * @param {Event} event - Form submit event
     */
    window.calculateBarisan = function(event) {
        event.preventDefault();
        
        // Clear previous errors
        hideError('barisan-error');
        
        // Get input values
        const aInput = getElement('barisan-a');
        const bInput = getElement('barisan-b');
        const nInput = getElement('barisan-n');
        
        const a = parseNumber(aInput.value);
        const b = parseNumber(bInput.value);
        const n = parseInteger(nInput.value);

        // Validate inputs
        const validation = validateBarisanInput(a, b, n);
        if (!validation.isValid) {
            showError('barisan-error', validation.errors.join('. '));
            // Focus first invalid input
            if (a === null) {
                aInput.focus();
            } else if (b === null) {
                bInput.focus();
            } else if (n === null || (n !== null && (n < 1 || !Number.isInteger(n)))) {
                nInput.focus();
            }
            return;
        }

        // Calculate using formula: Un = a + (n-1) * b
        const un = a + (n - 1) * b;

        // Generate step-by-step calculation
        const calculationSteps = generateBarisanCalculation(a, b, n, un);
        
        // Display results
        const resultBox = getElement('barisan-result');
        const calculationDiv = getElement('barisan-calculation');
        const answerSpan = getElement('barisan-answer');

        if (calculationDiv) {
            calculationDiv.textContent = calculationSteps;
        }
        if (answerSpan) {
            answerSpan.textContent = formatNumber(un);
        }
        if (resultBox) {
            resultBox.classList.remove('hidden');
            resultBox.setAttribute('aria-hidden', 'false');
            
            // Announce result to screen readers
            const announcement = document.createElement('div');
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            announcement.className = 'visually-hidden';
            announcement.textContent = `Hasil perhitungan: U${n} = ${formatNumber(un)}`;
            resultBox.appendChild(announcement);
            
            // Scroll to result
            setTimeout(() => {
                smoothScrollTo(resultBox);
            }, 100);
        }
    };

    /**
     * Generate step-by-step calculation for barisan
     * @param {number} a - First term
     * @param {number} b - Common difference
     * @param {number} n - Term number
     * @param {number} un - Result
     * @returns {string}
     */
    function generateBarisanCalculation(a, b, n, un) {
        const steps = [];
        
        steps.push('Diketahui:');
        steps.push(`• Suku pertama (a) = ${a}`);
        steps.push(`• Beda (b) = ${b}`);
        steps.push(`• Suku ke-n (n) = ${n}`);
        steps.push('');
        steps.push('Langkah Perhitungan:');
        steps.push(`1. Gunakan rumus: Uₙ = a + (n-1) × b`);
        steps.push(`2. Substitusikan nilai: U${n} = ${a} + (${n}-1) × ${b}`);
        steps.push(`3. Hitung dalam kurung: (${n}-1) = ${n - 1}`);
        
        const multiplied = (n - 1) * b;
        steps.push(`4. Kalikan: ${n - 1} × ${formatFormulaNumber(b)} = ${multiplied}`);
        
        const sign = un >= 0 ? '+' : '';
        steps.push(`5. Jumlahkan: ${a} ${sign} ${multiplied} = ${un}`);
        
        return steps.join('\n');
    }

    /**
     * Validate input for arithmetic series calculations
     * @param {number} a - First term
     * @param {number} b - Common difference
     * @param {number} n - Number of terms
     * @returns {object} - Validation result with isValid and errors array
     */
    function validateDeretInput(a, b, n) {
        const errors = [];

        if (a === null) {
            errors.push('Suku pertama (a) harus diisi');
        }
        if (b === null) {
            errors.push('Beda (b) harus diisi');
        }
        if (n === null) {
            errors.push('Banyak suku (n) harus diisi');
        }
        if (n !== null && (n < 1 || !Number.isInteger(n))) {
            errors.push('Nilai n harus bilangan bulat positif');
        }
        if (n !== null && n > 1e6) {
            errors.push('Nilai n terlalu besar (maksimal 1.000.000)');
        }

        // Check for potential overflow
        if (a !== null && b !== null && n !== null) {
            const sn = (n / 2) * (2 * a + (n - 1) * b);
            if (!Number.isFinite(sn)) {
                errors.push('Hasil perhitungan terlalu besar');
            }
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Calculate Deret Aritmatika (Arithmetic Series)
     * Formula: Sn = n/2 × (2a + (n-1) × b)
     * @param {Event} event - Form submit event
     */
    window.calculateDeret = function(event) {
        event.preventDefault();
        
        // Clear previous errors
        hideError('deret-error');
        
        // Get input values
        const aInput = getElement('deret-a');
        const bInput = getElement('deret-b');
        const nInput = getElement('deret-n');
        
        const a = parseNumber(aInput.value);
        const b = parseNumber(bInput.value);
        const n = parseInteger(nInput.value);

        // Validate inputs
        const validation = validateDeretInput(a, b, n);
        if (!validation.isValid) {
            showError('deret-error', validation.errors.join('. '));
            // Focus first invalid input
            if (a === null) {
                aInput.focus();
            } else if (b === null) {
                bInput.focus();
            } else if (n === null || (n !== null && (n < 1 || !Number.isInteger(n)))) {
                nInput.focus();
            }
            return;
        }

        // Calculate using formula: Sn = n/2 × (2a + (n-1) × b)
        const sn = (n / 2) * (2 * a + (n - 1) * b);
        
        // Also calculate Un for the alternative formula
        const un = a + (n - 1) * b;

        // Generate step-by-step calculation
        const calculationSteps = generateDeretCalculation(a, b, n, un, sn);
        
        // Display results
        const resultBox = getElement('deret-result');
        const calculationDiv = getElement('deret-calculation');
        const answerSpan = getElement('deret-answer');

        if (calculationDiv) {
            calculationDiv.textContent = calculationSteps;
        }
        if (answerSpan) {
            answerSpan.textContent = formatNumber(sn);
        }
        if (resultBox) {
            resultBox.classList.remove('hidden');
            resultBox.setAttribute('aria-hidden', 'false');
            
            // Announce result to screen readers
            const announcement = document.createElement('div');
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            announcement.className = 'visually-hidden';
            announcement.textContent = `Hasil perhitungan: S${n} = ${formatNumber(sn)}`;
            resultBox.appendChild(announcement);
            
            // Scroll to result
            setTimeout(() => {
                smoothScrollTo(resultBox);
            }, 100);
        }
    };

    /**
     * Generate step-by-step calculation for deret
     * @param {number} a - First term
     * @param {number} b - Common difference
     * @param {number} n - Number of terms
     * @param {number} un - nth term
     * @param {number} sn - Result
     * @returns {string}
     */
    function generateDeretCalculation(a, b, n, un, sn) {
        const steps = [];
        
        steps.push('Diketahui:');
        steps.push(`• Suku pertama (a) = ${a}`);
        steps.push(`• Beda (b) = ${b}`);
        steps.push(`• Banyak suku (n) = ${n}`);
        steps.push('');
        
        steps.push('Langkah Perhitungan:');
        steps.push(`1. Gunakan rumus: Sₙ = n/2 × (2a + (n-1) × b)`);
        
        const twoA = 2 * a;
        const nMinusOne = n - 1;
        const nMinusOneTimesB = nMinusOne * b;
        const twoAPlusNMinusOneTimesB = twoA + nMinusOneTimesB;
        
        steps.push(`2. Substitusikan nilai: S${n} = ${n}/2 × (2×${a} + (${n}-1) × ${b})`);
        
        steps.push(`3. Sederhanakan: S${n} = ${n}/2 × (${twoA} + ${nMinusOne} × ${b})`);
        
        steps.push(`4. Kalikan dalam kurung: ${nMinusOne} × ${b} = ${nMinusOneTimesB}`);
        
        steps.push(`5. Jumlahkan dalam kurung: 2a + (n-1)b = ${twoA} + ${nMinusOneTimesB} = ${twoAPlusNMinusOneTimesB}`);
        
        const nOverTwo = n / 2;
        steps.push(`6. Kalikan dengan n/2: ${n}/2 × ${twoAPlusNMinusOneTimesB} = ${nOverTwo} × ${twoAPlusNMinusOneTimesB}`);
        
        steps.push(`7. Hasil akhir: Sₙ = ${sn}`);
        
        // Add alternative formula verification
        steps.push('');
        steps.push('📝 Verifikasi dengan rumus alternatif:');
        steps.push(`Sₙ = n/2 × (a + Uₙ)`);
        steps.push(`Uₙ = a + (n-1)b = ${a} + ${nMinusOne}×${b} = ${un}`);
        steps.push(`Sₙ = ${n}/2 × (${a} + ${un}) = ${nOverTwo} × ${a + un} = ${sn}`);
        
        return steps.join('\n');
    }

    // ============================================
    // Navigation & Accessibility
    // ============================================

    /**
     * Initialize smooth scrolling for navigation links
     */
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Skip if it's just "#"
                if (href === '#') return;
                
                e.preventDefault();
                
                const target = document.querySelector(href);
                if (target) {
                    smoothScrollTo(target);
                    
                    // Update URL without scrolling
                    history.pushState(null, null, href);
                    
                    // Update aria-current for accessibility
                    document.querySelectorAll('.nav-links a').forEach(link => {
                        link.removeAttribute('aria-current');
                    });
                    this.setAttribute('aria-current', 'page');
                }
            });
        });
    }

    /**
     * Handle navbar scroll effect
     */
    function initNavbarScroll() {
        let lastScroll = 0;
        const navbar = document.querySelector('.navbar');
        
        if (!navbar) return;
        
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                navbar.classList.remove('scroll-up');
                return;
            }
            
            if (currentScroll > lastScroll && currentScroll > 100) {
                // Scrolling down
                navbar.classList.add('scroll-up');
            } else {
                // Scrolling up
                navbar.classList.remove('scroll-up');
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
    }

    /**
     * Initialize mobile menu toggle
     */
    function initMobileMenu() {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (!menuToggle || !navLinks) return;
        
        menuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            this.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
            
            // Toggle hamburger animation
            this.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                menuToggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
        
        // Close menu when pressing Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                menuToggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.focus();
            }
        });
    }

    /**
     * Initialize Intersection Observer for animations
     */
    function initScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements with animate-on-scroll class
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    // ============================================
    // Form Reset Functionality
    // ============================================

    /**
     * Initialize form reset buttons
     */
    function initFormResets() {
        // Add reset functionality to forms
        const forms = document.querySelectorAll('.calculator-form form');
        
        forms.forEach(form => {
            // Add reset button
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                const resetBtn = document.createElement('button');
                resetBtn.type = 'button';
                resetBtn.className = 'btn btn-secondary';
                resetBtn.textContent = 'Reset';
                resetBtn.addEventListener('click', () => {
                    form.reset();
                    // Hide results
                    const formId = form.closest('.calculator-form').id;
                    const resultBox = getElement(`${formId.replace('-form', '')}-result`);
                    if (resultBox) {
                        resultBox.classList.add('hidden');
                    }
                    // Clear errors
                    const errorId = `${formId.replace('-form', '')}-error`;
                    hideError(errorId);
                });
                
                submitBtn.parentNode.insertBefore(resetBtn, submitBtn.nextSibling);
            }
        });
    }

    // ============================================
    // Keyboard Navigation
    // ============================================

    /**
     * Initialize keyboard navigation for calculator cards
     */
    function initKeyboardNavigation() {
        const cards = document.querySelectorAll('.calculator-card');
        
        cards.forEach((card, index) => {
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
                
                // Arrow key navigation
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextCard = cards[index + 1];
                    if (nextCard) {
                        nextCard.focus();
                    }
                }
                
                if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevCard = cards[index - 1];
                    if (prevCard) {
                        prevCard.focus();
                    }
                }
            });
        });
    }

    // ============================================
    // Initialization
    // ============================================

    /**
     * Initialize all functionality when DOM is ready
     */
    function init() {
        // Cache DOM elements
        elements.barisanForm = getElement('barisan-form');
        elements.deretForm = getElement('deret-form');
        elements.calculatorForms = getElement('calculator-forms');
        elements.barisanResult = getElement('barisan-result');
        elements.deretResult = getElement('deret-result');

        // Initialize features
        initSmoothScrolling();
        initNavbarScroll();
        initMobileMenu();
        initScrollAnimations();
        initFormResets();
        initKeyboardNavigation();

        // Log initialization (remove in production)
        console.log('MathPro Calculator initialized successfully');

        // Set initial ARIA states
        if (elements.barisanForm) {
            elements.barisanForm.setAttribute('aria-hidden', 'true');
        }
        if (elements.deretForm) {
            elements.deretForm.setAttribute('aria-hidden', 'true');
        }
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already loaded
        init();
    }

})();

