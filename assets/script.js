/**
 * Whitemars | Electric Mobility
 * Main Script
 */
console.log("SCRIPT RUNNING");
document.addEventListener('DOMContentLoaded', () => {
console.log("DOM LOADED");
    // --- Data Definitions ---
    const models = {
        "Guardian": {
            name: "Guardian",
            basePrice: null, // By Request
            type: "security",
            image: "https://ik.imagekit.io/6aokdqfct/guardian.jpeg",
            addons: [
                { id: "siren", name: "Siren & PA Speaker", price: 0, checked: true },
                { id: "strobe", name: "Orange Flashing Strobe", price: 0, checked: true },
                { id: "sticker", name: "Free Exterior Sticker Design", price: 0, checked: true },
                { id: "screen", name: "Wireless CarPlay/Android Auto", price: 0, checked: true },
                { id: "parking", name: "Sensor Parking & Camera Reverse", price: 0, checked: true }
            ]
        },
        "Nova 2": {
            name: "Nova 2",
            basePrice: 205000,
            type: "touring",
            image: "https://ik.imagekit.io/6aokdqfct/nova%202.jpeg",
            addons: [
                { id: "screen", name: "Wireless CarPlay/Android Auto", price: 0, checked: true },
                { id: "parking", name: "Sensor Parking & Camera Reverse", price: 0, checked: true }
            ]
        },
        "T2": {
            name: "T2",
            basePrice: 210000,
            type: "touring",
            image: "https://ik.imagekit.io/6aokdqfct/t2%20.jpeg",
            addons: [
                { id: "screen", name: "Wireless CarPlay/Android Auto", price: 0, checked: true },
                { id: "parking", name: "Sensor Parking & Camera Reverse", price: 0, checked: true }
            ]
        },
        "T4": {
            name: "T4",
            basePrice: 269000,
            type: "touring",
            image: "https://ik.imagekit.io/6aokdqfct/t4.jpeg",
            addons: [
                { id: "screen", name: "Wireless CarPlay/Android Auto", price: 0, checked: true },
                { id: "parking", name: "Sensor Parking & Camera Reverse", price: 0, checked: true }
            ]
        },
        "Nova 4": {
            name: "Nova 4",
            basePrice: 249000,
            type: "touring",
            image: "https://ik.imagekit.io/6aokdqfct/nova%204.jpeg",
            addons: [
                { id: "screen", name: "Wireless CarPlay/Android Auto", price: 0, checked: true },
                { id: "leather", name: "Leather Dashboard Upholstery", price: 0, checked: true }
            ]
        }
    };

    const LITHIUM_UPGRADE_PRICE = 90000;
    const WHATSAPP_NUMBER = "201155998338";

    // --- State ---
    let currentConfig = {
        model: null,
        battery: "Lead-Acid",
        color: "Black",
        addons: []
    };

    // --- Elements ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const configModal = document.getElementById('config-modal');
    const quoteModal = document.getElementById('quote-modal');
    const successOverlay = document.getElementById('success-overlay');
    const configForm = document.getElementById('config-form');
    const addonsContainer = document.getElementById('addons-container');
    const estTotalDisplay = document.getElementById('est-total');
    const colorWarning = document.getElementById('color-warning');

    // --- Navigation ---
    const nav = document.querySelector('nav');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // --- Modal Logic ---
    const openModal = (modal) => {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = (modal) => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    };

    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(configModal);
            closeModal(quoteModal);
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === configModal) closeModal(configModal);
        if (e.target === quoteModal) closeModal(quoteModal);
    });

    // --- Configurator Logic ---
    document.querySelectorAll('.open-config').forEach(btn => {
        btn.addEventListener('click', () => {
            const modelKey = btn.getAttribute('data-model');
            setupConfigurator(modelKey);
            openModal(configModal);
        });
    });

    const setupConfigurator = (modelKey) => {
        const model = models[modelKey];
        if (!model) return;
        currentConfig.model = model;
        currentConfig.battery = "Lead-Acid";
        currentConfig.color = "Black";
        currentConfig.addons = (model.addons || []).map(a => ({ ...a }));

        document.getElementById('config-title').textContent = window.currentLang === 'ar' ? `تخصيص ${model.name}` : `Configure ${model.name}`;
        document.getElementById('config-model-input').value = model.name;
        
        // Reset form
        if (configForm) configForm.reset();
        
        // Render Add-ons
        if (addonsContainer) {
            addonsContainer.innerHTML = '';
            currentConfig.addons.forEach(addon => {
                const div = document.createElement('div');
                div.className = 'flex items-center justify-between p-4 border border-white/10 rounded-xl bg-black/40';
                
                const addonNameAr = {
                    "Siren & PA Speaker": "صفارة إنذار ومكبر صوت",
                    "Orange Flashing Strobe": "ضوء وامض برتقالي",
                    "Free Exterior Sticker Design": "تصميم ملصق خارجي مجاني",
                    "Wireless CarPlay/Android Auto": "شاشة كاربلاي/أندرويد أوتو لاسلكية",
                    "Sensor Parking & Camera Reverse": "حساسات ركن وكاميرا خلفية",
                    "Leather Dashboard Upholstery": "تنجيد لوحة القيادة بالجلد"
                }[addon.name] || addon.name;

                const displayName = window.currentLang === 'ar' ? addonNameAr : addon.name;
                const includedText = window.currentLang === 'ar' ? 'مشمول' : 'Included';

                div.innerHTML = `
                    <div class="flex items-center gap-3">
                        <input type="checkbox" id="addon-${addon.id}" ${addon.checked ? 'checked' : ''} class="accent-white addon-checkbox" data-id="${addon.id}">
                        <label for="addon-${addon.id}" class="text-sm font-medium">${displayName}</label>
                    </div>
                    <span class="text-xs text-gray-500">${addon.price > 0 ? `+${addon.price.toLocaleString()} EGP` : includedText}</span>
                `;
                addonsContainer.appendChild(div);
            });
        }

        updatePrice();
    };

    const updatePrice = () => {
        const model = currentConfig.model;
        if (!model) return;
        if (model.type === 'security') {
            if (estTotalDisplay) estTotalDisplay.textContent = window.currentLang === 'ar' ? "عند الطلب" : "By Request";
            const configSubtitle = document.getElementById('config-subtitle');
            if (configSubtitle) configSubtitle.textContent = window.currentLang === 'ar' ? "تتم مشاركة الأسعار حصريًا مع عملاء قطاع الأمن والشركات." : "Pricing is shared exclusively with security sector clients and corporates.";
        } else {
            let total = model.basePrice;
            if (currentConfig.battery === 'Lithium') total += LITHIUM_UPGRADE_PRICE;
            
            // Add-ons
            currentConfig.addons.forEach(a => {
                if (a.checked) total += a.price;
            });

            if (estTotalDisplay) estTotalDisplay.textContent = `${total.toLocaleString()} EGP`;
            const configSubtitle = document.getElementById('config-subtitle');
            if (configSubtitle) configSubtitle.textContent = window.currentLang === 'ar' ? "حدد تفضيلاتك" : "Select your preferences";
        }

        // Color warning
        const inStockColors = ['Black', 'White']; // Example stock logic
        if (colorWarning) {
            if (!inStockColors.includes(currentConfig.color)) {
                colorWarning.classList.remove('hidden');
            } else {
                colorWarning.classList.add('hidden');
            }
        }

        // Update hidden summary
        const summary = `Model: ${model.name}, Battery: ${currentConfig.battery}, Color: ${currentConfig.color}, Add-ons: ${currentConfig.addons.filter(a => a.checked).map(a => a.name).join(', ')}`;
        const configSummaryInput = document.getElementById('config-summary-input');
        if (configSummaryInput) configSummaryInput.value = summary;
    };

    if (configForm) {
        configForm.addEventListener('change', (e) => {
            if (e.target.name === 'battery') {
                currentConfig.battery = e.target.value;
            }
            if (e.target.name === 'color') {
                currentConfig.color = e.target.value;
            }
            if (e.target.classList.contains('addon-checkbox')) {
                const id = e.target.getAttribute('data-id');
                const addon = currentConfig.addons.find(a => a.id === id);
                if (addon) addon.checked = e.target.checked;
            }
            updatePrice();
        });
    }

    // --- Quote Logic ---
    document.querySelectorAll('.open-quote').forEach(btn => {
        btn.addEventListener('click', () => {
            const modelKey = btn.getAttribute('data-model');
            const model = models[modelKey];
            if (model) {
                const quoteModelName = document.getElementById('quote-model-name');
                if (quoteModelName) quoteModelName.textContent = window.currentLang === 'ar' ? `الموديل: ${model.name}` : `Model: ${model.name}`;
                const quoteModelInput = document.getElementById('quote-model-input');
                if (quoteModelInput) quoteModelInput.value = model.name;
            }
            openModal(quoteModal);
        });
    });

    // --- WhatsApp Templates ---
    const generateWhatsAppLink = (text) => {
        return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    };

    const copyWhatsappBtn = document.getElementById('copy-whatsapp');
    if (copyWhatsappBtn) {
        copyWhatsappBtn.addEventListener('click', () => {
            const summary = document.getElementById('config-summary-input').value;
            const price = estTotalDisplay.textContent;
            const text = `Hello Whitemars Team, I am interested in configuring a vehicle:\n\n${summary}\n\nEstimated Total: ${price}\n\nPlease contact me with more details.`;
            
            navigator.clipboard.writeText(text).then(() => {
                alert("WhatsApp template copied to clipboard!");
                window.open(generateWhatsAppLink(text), '_blank');
            });
        });
    }

    const copyQuoteWhatsappBtn = document.getElementById('copy-quote-whatsapp');
    if (copyQuoteWhatsappBtn) {
        copyQuoteWhatsappBtn.addEventListener('click', () => {
            const model = document.getElementById('quote-model-input').value;
            const text = `Hello Whitemars Team, I would like to request a formal quote for the ${model} model. Please let me know the next steps.`;
            
            navigator.clipboard.writeText(text).then(() => {
                alert("WhatsApp template copied to clipboard!");
                window.open(generateWhatsAppLink(text), '_blank');
            });
        });
    }

    // --- Form Submission Logic ---
    const handleFormSubmit = async (formId) => {
        const form = document.getElementById(formId);
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText || submitBtn.textContent;
            
            // Disable button and show sending state
            submitBtn.disabled = true;
            submitBtn.innerText = window.currentLang === 'ar' ? 'جاري الإرسال...' : 'SENDING...';
            submitBtn.textContent = window.currentLang === 'ar' ? 'جاري الإرسال...' : 'SENDING...';

            const formData = new FormData(form);
            
            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success
                    const successOverlay = document.getElementById('success-overlay');
                    if (successOverlay) {
                        document.getElementById('success-title').textContent = window.currentLang === 'ar' ? 'تم الإرسال بنجاح' : 'Submission Successful';
                        document.getElementById('success-msg').textContent = window.currentLang === 'ar' ? 'شكرًا — تم استلام طلبك.' : 'Thanks — we received your request.';
                        successOverlay.classList.remove('hidden');
                    } else {
                        alert(window.currentLang === 'ar' ? 'شكرًا — تم استلام طلبك.' : 'Thanks — we received your request.');
                    }
                    form.reset();
                } else {
                    // Error
                    const data = await response.json();
                    if (data && data.errors) {
                        alert(data.errors.map(error => error.message).join(", "));
                    } else {
                        alert(window.currentLang === 'ar' ? 'حدث خطأ. حاول مرة أخرى.' : 'Something went wrong. Please try again.');
                    }
                }
            } catch (error) {
                alert(window.currentLang === 'ar' ? 'حدث خطأ. حاول مرة أخرى.' : 'Something went wrong. Please try again.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
                submitBtn.textContent = originalBtnText;
            }
        });
    };

    handleFormSubmit('quote-form');
    handleFormSubmit('contact-form');
    handleFormSubmit('demo-form');
    handleFormSubmit('config-form');
    handleFormSubmit('modal-quote-form');

    // --- Smooth Scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Hero Slider Logic ---
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroDots = document.querySelectorAll('.hero-dot');
    let currentSlide = 0;
    const slideInterval = 5000;

    const showSlide = (index) => {
        heroSlides.forEach(slide => slide.classList.remove('active'));
        heroDots.forEach(dot => dot.classList.remove('active'));
        
        if (heroSlides[index]) heroSlides[index].classList.add('active');
        if (heroDots[index]) heroDots[index].classList.add('active');
        currentSlide = index;
    };

    const nextSlide = () => {
        let next = (currentSlide + 1) % heroSlides.length;
        showSlide(next);
    };

    if (heroSlides.length > 0) {
        let autoSlide = setInterval(nextSlide, slideInterval);

        heroDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(autoSlide);
                showSlide(index);
                autoSlide = setInterval(nextSlide, slideInterval);
            });
        });
    }

    // --- AI Assistant Logic ---
    const aiButton = document.getElementById('whitemars-ai-button');
    const aiModal = document.getElementById('whitemars-ai-modal');
    const aiClose = document.getElementById('whitemars-ai-close');

    if (aiButton && aiModal) {
        aiButton.addEventListener('click', () => {
            aiModal.classList.toggle('active');
        });

        if (aiClose) {
            aiClose.addEventListener('click', (e) => {
                e.stopPropagation();
                aiModal.classList.remove('active');
            });
        }
    }

    // --- Bilingual Logic ---
    const langToggles = document.querySelectorAll('#lang-toggle, #mobile-lang-toggle');
    window.currentLang = localStorage.getItem('whitemars_lang') || 'en';

    const applyLanguage = (lang) => {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        
        document.querySelectorAll('[data-en][data-ar]').forEach(el => {
            el.textContent = el.getAttribute(`data-${lang}`);
        });
        
        localStorage.setItem('whitemars_lang', lang);

        // Re-render configurator if open to update dynamic translations
        if (currentConfig.model && !configModal.classList.contains('hidden')) {
            setupConfigurator(currentConfig.model.name);
        }
        
        // Update quote modal title if open
        if (!quoteModal.classList.contains('hidden')) {
            const quoteModelInput = document.getElementById('quote-model-input');
            if (quoteModelInput && quoteModelInput.value) {
                const quoteModelName = document.getElementById('quote-model-name');
                if (quoteModelName) quoteModelName.textContent = lang === 'ar' ? `الموديل: ${quoteModelInput.value}` : `Model: ${quoteModelInput.value}`;
            }
        }
    };

    langToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            window.currentLang = window.currentLang === 'en' ? 'ar' : 'en';
            applyLanguage(window.currentLang);
        });
    });

    // Apply initial language
    applyLanguage(window.currentLang);

});


