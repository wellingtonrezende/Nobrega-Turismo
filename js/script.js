/* =========================================================
   NÓBREGA TURISMO
   FASE 14 — JAVASCRIPT COMPLETO
========================================================= */

"use strict";


/* =========================================================
   CONFIGURAÇÕES GERAIS
========================================================= */

const SITE_CONFIG = {

    whatsappNumber: "5500000000000",

    headerScrollOffset: 80,

    testimonialAutoplayTime: 6000,

    revealThreshold: 0.12,

    loaderDuration: 700

};


/* =========================================================
   FUNÇÕES AUXILIARES
========================================================= */

const select = (selector, context = document) =>
    context.querySelector(selector);


const selectAll = (selector, context = document) =>
    [...context.querySelectorAll(selector)];


const normalizeText = (value = "") =>
    value
        .toString()
        .trim()
        .replace(/\s+/g, " ");


const onlyNumbers = (value = "") =>
    value.replace(/\D/g, "");


const encodeWhatsAppMessage = (message) =>
    encodeURIComponent(message);


const openWhatsApp = (message) => {

    const number = SITE_CONFIG.whatsappNumber;

    if (!number || number === "5500000000000") {

        console.warn(
            "Atualize o número do WhatsApp em SITE_CONFIG.whatsappNumber."
        );

    }

    const url =
        `https://wa.me/${number}?text=${encodeWhatsAppMessage(message)}`;

    window.open(url, "_blank", "noopener,noreferrer");

};


const escapeHTML = (value = "") => {

    const element = document.createElement("div");

    element.textContent = value;

    return element.innerHTML;

};


const debounce = (callback, delay = 150) => {

    let timeout;

    return (...args) => {

        clearTimeout(timeout);

        timeout = setTimeout(() => {

            callback(...args);

        }, delay);

    };

};


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeLoader();

    initializeHeader();

    initializeMobileMenu();

    initializeSmoothScroll();

    initializeScrollReveal();

    initializeCounters();

    initializeDestinationFilters();

    initializeDestinationFavorites();

    initializeFAQ();

    initializeTestimonials();

    initializeTravelQuoteForm();

    initializeContactForm();

    initializeNewsletter();

    initializePhoneMasks();

    initializeBackToTop();

    initializeCurrentYear();

    initializeLazyImages();

    initializeParallax();

    initializeActiveNavigation();

});

/* =========================================================
   LOADER CORRIGIDO
========================================================= */

function initializeLoader() {

    const loader =
        select(".page-loader") ||
        select("#pageLoader") ||
        select("[data-loader]");


    const hideLoader = () => {

        document.body.classList.remove("is-loading");
        document.body.classList.add("page-loaded");


        if (!loader) {

            showRevealElements();

            return;

        }


        loader.classList.add("is-hidden");


        showRevealElements();


        setTimeout(() => {

            if (loader.parentNode) {

                loader.remove();

            }

        }, SITE_CONFIG.loaderDuration);

    };


    /*
     * Garante que os elementos animados não
     * permaneçam invisíveis caso ocorra algum erro.
     */

    const showRevealElements = () => {

        selectAll(
            ".reveal, .reveal-up, .reveal-left, .reveal-right, [data-reveal]"
        ).forEach((element) => {

            element.classList.add("is-visible");

        });

    };


    if (!loader) {

        hideLoader();

        return;

    }


    document.body.classList.add("is-loading");


    /*
     * Se a página já terminou de carregar.
     */

    if (document.readyState === "complete") {

        setTimeout(hideLoader, 400);

    } else {

        window.addEventListener(
            "load",
            () => {

                setTimeout(hideLoader, 400);

            },
            { once: true }
        );

    }


    /*
     * Segurança máxima:
     * libera o site mesmo se uma imagem, fonte
     * ou iframe não terminar de carregar.
     */

    setTimeout(hideLoader, 2500);

}


/* =========================================================
   HEADER FIXO
========================================================= */

function initializeHeader() {

    const header =
        select(".header") ||
        select("#header");

    if (!header) return;


    const updateHeader = () => {

        const isScrolled =
            window.scrollY > SITE_CONFIG.headerScrollOffset;

        header.classList.toggle("is-scrolled", isScrolled);

    };


    updateHeader();

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

}


/* =========================================================
   MENU MOBILE
========================================================= */

function initializeMobileMenu() {

    const menuButton =
        select(".header__toggle") ||
        select(".menu-toggle") ||
        select("[data-menu-toggle]");

    const navigation =
        select(".header__nav") ||
        select(".nav") ||
        select("[data-menu]");

    if (!menuButton || !navigation) return;


    const navigationLinks =
        selectAll("a[href^='#']", navigation);


    const openMenu = () => {

        menuButton.classList.add("is-active");

        navigation.classList.add("is-open");

        menuButton.setAttribute("aria-expanded", "true");

        document.body.classList.add("menu-open");

    };


    const closeMenu = () => {

        menuButton.classList.remove("is-active");

        navigation.classList.remove("is-open");

        menuButton.setAttribute("aria-expanded", "false");

        document.body.classList.remove("menu-open");

    };


    menuButton.addEventListener("click", () => {

        const menuIsOpen =
            navigation.classList.contains("is-open");

        menuIsOpen
            ? closeMenu()
            : openMenu();

    });


    navigationLinks.forEach((link) => {

        link.addEventListener("click", closeMenu);

    });


    document.addEventListener("click", (event) => {

        const clickedInsideMenu =
            navigation.contains(event.target);

        const clickedButton =
            menuButton.contains(event.target);

        if (
            navigation.classList.contains("is-open") &&
            !clickedInsideMenu &&
            !clickedButton
        ) {

            closeMenu();

        }

    });


    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            closeMenu();

        }

    });


    window.addEventListener(
        "resize",
        debounce(() => {

            if (window.innerWidth > 992) {

                closeMenu();

            }

        }, 150)
    );

}


/* =========================================================
   ROLAGEM SUAVE
========================================================= */

function initializeSmoothScroll() {

    const links = selectAll('a[href^="#"]');


    links.forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetID =
                link.getAttribute("href");

            if (
                !targetID ||
                targetID === "#" ||
                targetID.length < 2
            ) {

                return;

            }

            const target = select(targetID);

            if (!target) return;


            event.preventDefault();


            const header =
                select(".header") ||
                select("#header");

            const headerHeight =
                header
                    ? header.offsetHeight
                    : 0;

            const destination =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight -
                15;


            window.scrollTo({

                top: destination,

                behavior:
                    window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches
                        ? "auto"
                        : "smooth"

            });

        });

    });

}


/* =========================================================
   ANIMAÇÕES AO ROLAR
========================================================= */

function initializeScrollReveal() {

    const elements = selectAll(
        [
            ".reveal",
            ".reveal-up",
            ".reveal-left",
            ".reveal-right",
            "[data-reveal]"
        ].join(",")
    );

    if (!elements.length) return;


    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        elements.forEach((element) => {

            element.classList.add("is-visible");

        });

        return;

    }


    const observer = new IntersectionObserver(

        (entries, intersectionObserver) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) return;


                const element = entry.target;

                const delay =
                    Number(element.dataset.delay) || 0;


                setTimeout(() => {

                    element.classList.add("is-visible");

                }, delay);


                intersectionObserver.unobserve(element);

            });

        },

        {

            threshold: SITE_CONFIG.revealThreshold,

            rootMargin: "0px 0px -50px 0px"

        }

    );


    elements.forEach((element, index) => {

        if (!element.dataset.delay) {

            const group = element.parentElement;

            const siblings = group
                ? selectAll(
                    ".reveal, .reveal-up, .reveal-left, .reveal-right",
                    group
                )
                : [];

            if (siblings.length > 1) {

                const siblingIndex =
                    siblings.indexOf(element);

                element.dataset.delay =
                    Math.min(siblingIndex * 90, 450);

            }

        }

        observer.observe(element);

    });

}


/* =========================================================
   CONTADORES
========================================================= */

function initializeCounters() {

    const counters = selectAll(
        "[data-counter], .counter"
    );

    if (!counters.length) return;


    const animateCounter = (element) => {

        const rawTarget =
            element.dataset.counter ||
            element.dataset.target ||
            element.textContent;

        const target =
            Number(
                rawTarget
                    .toString()
                    .replace(/\D/g, "")
            );

        if (!target) return;


        const prefix =
            element.dataset.prefix || "";

        const suffix =
            element.dataset.suffix ||
            (
                rawTarget.includes("+")
                    ? "+"
                    : rawTarget.includes("%")
                        ? "%"
                        : ""
            );

        const duration =
            Number(element.dataset.duration) || 1700;

        const startTime =
            performance.now();


        const update = (currentTime) => {

            const elapsed =
                currentTime - startTime;

            const progress =
                Math.min(elapsed / duration, 1);

            const easedProgress =
                1 - Math.pow(1 - progress, 4);

            const currentValue =
                Math.floor(target * easedProgress);


            element.textContent =
                `${prefix}${currentValue.toLocaleString("pt-BR")}${suffix}`;


            if (progress < 1) {

                requestAnimationFrame(update);

            }

        };


        requestAnimationFrame(update);

    };


    const observer = new IntersectionObserver(

        (entries, intersectionObserver) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) return;

                animateCounter(entry.target);

                intersectionObserver.unobserve(entry.target);

            });

        },

        {

            threshold: 0.5

        }

    );


    counters.forEach((counter) => {

        observer.observe(counter);

    });

}


/* =========================================================
   FILTROS DE DESTINOS
========================================================= */

function initializeDestinationFilters() {

    const filterButtons = selectAll(
        [
            "[data-filter]",
            "[data-destination-filter]",
            ".destinations__filter"
        ].join(",")
    );

    const destinationCards = selectAll(
        [
            "[data-destination-card]",
            ".destination-card"
        ].join(",")
    );

    if (
        !filterButtons.length ||
        !destinationCards.length
    ) {

        return;

    }


    filterButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const selectedFilter =
                button.dataset.filter ||
                button.dataset.destinationFilter ||
                "all";


            filterButtons.forEach((item) => {

                item.classList.remove("is-active");

                item.setAttribute(
                    "aria-selected",
                    "false"
                );

            });


            button.classList.add("is-active");

            button.setAttribute(
                "aria-selected",
                "true"
            );


            destinationCards.forEach((card) => {

                const category =
                    card.dataset.category ||
                    card.dataset.destinationCategory ||
                    "all";

                const categories =
    category
        .split(/[\s,]+/)
        .map((item) => item.trim())
        .filter(Boolean);


                const shouldShow =
                    selectedFilter === "all" ||
                    categories.includes(selectedFilter);


                if (shouldShow) {

                    card.classList.remove("is-hidden");

                    card.removeAttribute("hidden");

                    requestAnimationFrame(() => {

                        card.classList.add("is-visible");

                    });

                } else {

                    card.classList.remove("is-visible");

                    card.classList.add("is-hidden");

                    setTimeout(() => {

                        if (
                            card.classList.contains(
                                "is-hidden"
                            )
                        ) {

                            card.setAttribute(
                                "hidden",
                                ""
                            );

                        }

                    }, 250);

                }

            });

        });

    });

}


/* =========================================================
   FAVORITOS DOS DESTINOS
========================================================= */

function initializeDestinationFavorites() {

    const favoriteButtons = selectAll(
        [
            "[data-favorite]",
            ".destination-card__favorite"
        ].join(",")
    );

    if (!favoriteButtons.length) return;


    let favorites = [];

    try {

        favorites =
            JSON.parse(
                localStorage.getItem(
                    "nobrega-destination-favorites"
                )
            ) || [];

    } catch {

        favorites = [];

    }


    const saveFavorites = () => {

        localStorage.setItem(
            "nobrega-destination-favorites",
            JSON.stringify(favorites)
        );

    };


    favoriteButtons.forEach((button, index) => {

        const card =
            button.closest(
                "[data-destination-card], .destination-card"
            );

        const destinationID =
            button.dataset.favorite ||
            card?.dataset.destinationId ||
            card?.dataset.title ||
            card?.querySelector("h3")?.textContent ||
            `destination-${index + 1}`;

        const normalizedID =
            normalizeText(destinationID)
                .toLowerCase();


        const updateButton = () => {

            const isFavorite =
                favorites.includes(normalizedID);

            button.classList.toggle(
                "is-favorite",
                isFavorite
            );

            button.setAttribute(
                "aria-pressed",
                String(isFavorite)
            );

            button.setAttribute(
                "aria-label",
                isFavorite
                    ? "Remover destino dos favoritos"
                    : "Adicionar destino aos favoritos"
            );

        };


        updateButton();


        button.addEventListener("click", () => {

            if (favorites.includes(normalizedID)) {

                favorites =
                    favorites.filter(
                        (item) => item !== normalizedID
                    );

            } else {

                favorites.push(normalizedID);

            }


            saveFavorites();

            updateButton();

        });

    });

}


/* =========================================================
   FAQ
========================================================= */

function initializeFAQ() {

    const faqItems = selectAll("[data-faq-item]");

    const categoryButtons = selectAll(
        "[data-faq-category]"
    );

    if (!faqItems.length) return;


    const closeFAQ = (item) => {

        const button =
            select(".faq-item__question", item);

        const answer =
            select(".faq-item__answer", item);

        if (!button || !answer) return;


        item.classList.remove("is-open");

        button.setAttribute(
            "aria-expanded",
            "false"
        );

        answer.style.maxHeight =
            `${answer.scrollHeight}px`;


        requestAnimationFrame(() => {

            answer.style.maxHeight = "0px";

            answer.style.opacity = "0";

        });


        setTimeout(() => {

            if (
                !item.classList.contains("is-open")
            ) {

                answer.hidden = true;

            }

        }, 350);

    };


    const openFAQ = (item) => {

        const button =
            select(".faq-item__question", item);

        const answer =
            select(".faq-item__answer", item);

        if (!button || !answer) return;


        item.classList.add("is-open");

        button.setAttribute(
            "aria-expanded",
            "true"
        );

        answer.hidden = false;

        answer.style.maxHeight = "0px";

        answer.style.opacity = "0";


        requestAnimationFrame(() => {

            answer.style.maxHeight =
                `${answer.scrollHeight}px`;

            answer.style.opacity = "1";

        });


        setTimeout(() => {

            if (
                item.classList.contains("is-open")
            ) {

                answer.style.maxHeight = "none";

            }

        }, 350);

    };


    faqItems.forEach((item) => {

        const button =
            select(".faq-item__question", item);

        const answer =
            select(".faq-item__answer", item);

        if (!button || !answer) return;


        answer.style.overflow = "hidden";

        answer.style.transition =
            "max-height 0.35s ease, opacity 0.25s ease";


        if (item.classList.contains("is-open")) {

            answer.hidden = false;

            answer.style.maxHeight = "none";

            answer.style.opacity = "1";

        } else {

            answer.hidden = true;

            answer.style.maxHeight = "0px";

            answer.style.opacity = "0";

        }


        button.addEventListener("click", () => {

            const isOpen =
                item.classList.contains("is-open");


            faqItems.forEach((otherItem) => {

                if (
                    otherItem !== item &&
                    otherItem.classList.contains(
                        "is-open"
                    )
                ) {

                    closeFAQ(otherItem);

                }

            });


            isOpen
                ? closeFAQ(item)
                : openFAQ(item);

        });

    });


    categoryButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const selectedCategory =
                button.dataset.faqCategory || "all";


            categoryButtons.forEach((item) => {

                item.classList.remove("is-active");

                item.setAttribute(
                    "aria-selected",
                    "false"
                );

            });


            button.classList.add("is-active");

            button.setAttribute(
                "aria-selected",
                "true"
            );


            faqItems.forEach((item) => {

                const itemCategory =
                    item.dataset.category || "";

                const shouldShow =
                    selectedCategory === "all" ||
                    itemCategory === selectedCategory;


                item.classList.toggle(
                    "is-hidden",
                    !shouldShow
                );


                if (!shouldShow) {

                    closeFAQ(item);

                }

            });


            const firstVisibleItem =
                faqItems.find(
                    (item) =>
                        !item.classList.contains(
                            "is-hidden"
                        )
                );


            if (firstVisibleItem) {

                openFAQ(firstVisibleItem);

            }

        });

    });

}


/* =========================================================
   SLIDER DE DEPOIMENTOS
========================================================= */

function initializeTestimonials() {

    const slider =
        select("[data-testimonial-slider]") ||
        select(".testimonials-slider") ||
        select(".testimonials__slider");

    if (!slider) return;


    const track =
        select(
            "[data-testimonial-track], .testimonials__track, .testimonials-slider__track",
            slider
        );

    const slides = selectAll(
        [
            "[data-testimonial-slide]",
            ".testimonial-slide",
            ".testimonials__slide",
            ".testimonial-card"
        ].join(","),
        slider
    );

    const previousButton =
        select(
            "[data-testimonial-prev], .testimonials__arrow--prev, .testimonials-slider__prev",
            slider
        ) ||
        select("[data-testimonial-prev]");

    const nextButton =
        select(
            "[data-testimonial-next], .testimonials__arrow--next, .testimonials-slider__next",
            slider
        ) ||
        select("[data-testimonial-next]");

    const dotsContainer =
        select(
            "[data-testimonial-dots], .testimonials__dots, .testimonials-slider__dots",
            slider
        ) ||
        select("[data-testimonial-dots]");


    if (!slides.length) return;


    let currentIndex = 0;

    let autoplayID = null;

    let startX = 0;

    let endX = 0;


    const createDots = () => {

        if (!dotsContainer) return;


        const existingDots =
            selectAll(
                "[data-testimonial-dot]",
                dotsContainer
            );

        if (existingDots.length === slides.length) {

            return;

        }


        dotsContainer.innerHTML = "";


        slides.forEach((_, index) => {

            const dot =
                document.createElement("button");

            dot.type = "button";

            dot.className =
                "testimonials__dot";

            dot.dataset.testimonialDot =
                index.toString();

            dot.setAttribute(
                "aria-label",
                `Ir para o depoimento ${index + 1}`
            );

            dotsContainer.appendChild(dot);

        });

    };


    createDots();


    const dots = dotsContainer
        ? selectAll(
            "[data-testimonial-dot], .testimonials__dot",
            dotsContainer
        )
        : [];


    const updateSlider = () => {

        slides.forEach((slide, index) => {

            const isActive =
                index === currentIndex;

            slide.classList.toggle(
                "is-active",
                isActive
            );

            slide.setAttribute(
                "aria-hidden",
                String(!isActive)
            );

        });


        if (track) {

            track.style.transform =
                `translateX(-${currentIndex * 100}%)`;

        }


        dots.forEach((dot, index) => {

            dot.classList.toggle(
                "is-active",
                index === currentIndex
            );

            dot.setAttribute(
                "aria-current",
                index === currentIndex
                    ? "true"
                    : "false"
            );

        });

    };


    const goToSlide = (index) => {

        currentIndex =
            (index + slides.length) %
            slides.length;

        updateSlider();

    };


    const nextSlide = () => {

        goToSlide(currentIndex + 1);

    };


    const previousSlide = () => {

        goToSlide(currentIndex - 1);

    };


    const stopAutoplay = () => {

        if (autoplayID) {

            clearInterval(autoplayID);

            autoplayID = null;

        }

    };


    const startAutoplay = () => {

        stopAutoplay();


        if (
            slides.length <= 1 ||
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
        ) {

            return;

        }


        autoplayID = setInterval(

            nextSlide,

            SITE_CONFIG.testimonialAutoplayTime

        );

    };


    previousButton?.addEventListener(
        "click",
        () => {

            previousSlide();

            startAutoplay();

        }
    );


    nextButton?.addEventListener(
        "click",
        () => {

            nextSlide();

            startAutoplay();

        }
    );


    dots.forEach((dot, index) => {

        dot.addEventListener("click", () => {

            goToSlide(index);

            startAutoplay();

        });

    });


    slider.addEventListener(
        "mouseenter",
        stopAutoplay
    );

    slider.addEventListener(
        "mouseleave",
        startAutoplay
    );

    slider.addEventListener(
        "focusin",
        stopAutoplay
    );

    slider.addEventListener(
        "focusout",
        startAutoplay
    );


    slider.addEventListener(
        "touchstart",
        (event) => {

            startX =
                event.changedTouches[0].screenX;

        },
        { passive: true }
    );


    slider.addEventListener(
        "touchend",
        (event) => {

            endX =
                event.changedTouches[0].screenX;

            const difference =
                startX - endX;


            if (Math.abs(difference) < 50) {

                return;

            }


            difference > 0
                ? nextSlide()
                : previousSlide();


            startAutoplay();

        },
        { passive: true }
    );


    document.addEventListener(
        "visibilitychange",
        () => {

            document.hidden
                ? stopAutoplay()
                : startAutoplay();

        }
    );


    updateSlider();

    startAutoplay();

}


/* =========================================================
   MÁSCARA DE TELEFONE
========================================================= */

function initializePhoneMasks() {

    const phoneInputs = selectAll(
        'input[type="tel"]'
    );


    phoneInputs.forEach((input) => {

        input.addEventListener("input", () => {

            let value =
                onlyNumbers(input.value)
                    .slice(0, 11);


            if (value.length <= 2) {

                input.value =
                    value
                        ? `(${value}`
                        : "";

                return;

            }


            if (value.length <= 6) {

                input.value =
                    `(${value.slice(0, 2)}) ` +
                    value.slice(2);

                return;

            }


            if (value.length <= 10) {

                input.value =
                    `(${value.slice(0, 2)}) ` +
                    `${value.slice(2, 6)}-` +
                    value.slice(6);

                return;

            }


            input.value =
                `(${value.slice(0, 2)}) ` +
                `${value.slice(2, 7)}-` +
                value.slice(7);

        });

    });

}


/* =========================================================
   VALIDAÇÃO DE FORMULÁRIOS
========================================================= */

function setFieldError(
    input,
    message,
    form
) {

    const field =
        input.closest(
            ".conversion-form__field, .contact-form__field"
        );

    field?.classList.add("is-invalid");

    input.setAttribute(
        "aria-invalid",
        "true"
    );


    const errorElement =
        select(
            `[data-error-for="${input.id}"]`,
            form
        );

    if (errorElement) {

        errorElement.textContent =
            message;

    }

}


function clearFieldError(
    input,
    form
) {

    const field =
        input.closest(
            ".conversion-form__field, .contact-form__field"
        );

    field?.classList.remove("is-invalid");

    input.removeAttribute(
        "aria-invalid"
    );


    const errorElement =
        select(
            `[data-error-for="${input.id}"]`,
            form
        );

    if (errorElement) {

        errorElement.textContent = "";

    }

}


function validateEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
    );

}


function validatePhone(phone) {

    const numbers =
        onlyNumbers(phone);

    return (
        numbers.length === 10 ||
        numbers.length === 11
    );

}


function validateForm(form) {

    const requiredFields =
        selectAll("[required]", form);

    let isValid = true;

    let firstInvalidField = null;


    requiredFields.forEach((input) => {

        clearFieldError(input, form);


        if (
            input.type === "checkbox" &&
            !input.checked
        ) {

            setFieldError(
                input,
                "Você precisa aceitar para continuar.",
                form
            );

            isValid = false;

            firstInvalidField ||= input;

            return;

        }


        if (!normalizeText(input.value)) {

            setFieldError(
                input,
                "Preencha este campo.",
                form
            );

            isValid = false;

            firstInvalidField ||= input;

            return;

        }


        if (
            input.type === "email" &&
            !validateEmail(input.value)
        ) {

            setFieldError(
                input,
                "Digite um e-mail válido.",
                form
            );

            isValid = false;

            firstInvalidField ||= input;

            return;

        }


        if (
            input.type === "tel" &&
            !validatePhone(input.value)
        ) {

            setFieldError(
                input,
                "Digite um telefone válido.",
                form
            );

            isValid = false;

            firstInvalidField ||= input;

        }

    });


    const optionalEmail =
        select(
            'input[type="email"]:not([required])',
            form
        );

    if (
        optionalEmail &&
        normalizeText(optionalEmail.value) &&
        !validateEmail(optionalEmail.value)
    ) {

        setFieldError(
            optionalEmail,
            "Digite um e-mail válido.",
            form
        );

        isValid = false;

        firstInvalidField ||= optionalEmail;

    }


    if (firstInvalidField) {

        firstInvalidField.focus();

    }


    return isValid;

}


function initializeLiveValidation(form) {

    const fields = selectAll(
        "input, select, textarea",
        form
    );


    fields.forEach((input) => {

        const eventName =
            input.tagName === "SELECT" ||
            input.type === "checkbox"
                ? "change"
                : "input";


        input.addEventListener(
            eventName,
            () => {

                clearFieldError(
                    input,
                    form
                );

            }
        );

    });

}


/* =========================================================
   FORMULÁRIO DE ORÇAMENTO
========================================================= */

function initializeTravelQuoteForm() {

    const form =
        select("#travel-quote-form");

    if (!form) return;


    initializeLiveValidation(form);


    form.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            if (!validateForm(form)) {

                return;

            }


            const formData =
                new FormData(form);

            const name =
                normalizeText(
                    formData.get("name")
                );

            const phone =
                normalizeText(
                    formData.get("phone")
                );

            const destination =
                normalizeText(
                    formData.get("destination")
                );

            const passengers =
                normalizeText(
                    formData.get("passengers")
                );

            const date =
                normalizeText(
                    formData.get("date")
                );

            const travelType =
                normalizeText(
                    formData.get("travelType")
                );

            const budget =
                normalizeText(
                    formData.get("budget")
                );

            const details =
                normalizeText(
                    formData.get("message")
                );


            const formattedDate =
                formatTravelMonth(date);


            const message = [

                "Olá! Gostaria de solicitar uma proposta personalizada.",

                "",

                `Nome: ${name}`,

                `WhatsApp: ${phone}`,

                `Destino desejado: ${destination}`,

                `Passageiros: ${passengers}`,

                `Período da viagem: ${formattedDate}`,

                `Tipo de viagem: ${travelType}`,

                `Faixa de orçamento: ${budget || "Não informada"}`,

                `Observações: ${details || "Nenhuma observação adicional."}`

            ].join("\n");


            showFormSuccess(
                form,
                "Solicitação preparada. Abrindo o WhatsApp..."
            );


            openWhatsApp(message);

        }
    );

}


/* =========================================================
   FORMULÁRIO DE CONTATO
========================================================= */

function initializeContactForm() {

    const form =
        select("#contact-form");

    if (!form) return;


    initializeLiveValidation(form);


    form.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            if (!validateForm(form)) {

                return;

            }


            const formData =
                new FormData(form);

            const name =
                normalizeText(
                    formData.get("name")
                );

            const phone =
                normalizeText(
                    formData.get("phone")
                );

            const email =
                normalizeText(
                    formData.get("email")
                );

            const subject =
                normalizeText(
                    formData.get("subject")
                );

            const contactMessage =
                normalizeText(
                    formData.get("message")
                );


            const message = [

                "Olá! Entrei em contato pelo site da Nóbrega Turismo.",

                "",

                `Nome: ${name}`,

                `WhatsApp: ${phone}`,

                `E-mail: ${email || "Não informado"}`,

                `Assunto: ${subject}`,

                "",

                "Mensagem:",

                contactMessage

            ].join("\n");


            showFormSuccess(
                form,
                "Mensagem preparada. Abrindo o WhatsApp..."
            );


            openWhatsApp(message);

        }
    );

}


/* =========================================================
   FORMATAÇÃO DO MÊS
========================================================= */

function formatTravelMonth(value) {

    if (!value) {

        return "Não informado";

    }


    const [year, month] =
        value.split("-");

    const date =
        new Date(
            Number(year),
            Number(month) - 1,
            1
        );


    return new Intl.DateTimeFormat(
        "pt-BR",
        {

            month: "long",

            year: "numeric"

        }
    ).format(date);

}


/* =========================================================
   MENSAGEM DE SUCESSO
========================================================= */

function showFormSuccess(
    form,
    message
) {

    let feedback =
        select(".form-feedback", form);


    if (!feedback) {

        feedback =
            document.createElement("div");

        feedback.className =
            "form-feedback";

        feedback.setAttribute(
            "role",
            "status"
        );

        form.appendChild(feedback);

    }


    feedback.innerHTML = `
        <span aria-hidden="true">✓</span>
        <p>${escapeHTML(message)}</p>
    `;

    feedback.classList.add("is-visible");


    setTimeout(() => {

        feedback.classList.remove(
            "is-visible"
        );

    }, 5000);

}


/* =========================================================
   NEWSLETTER
========================================================= */

function initializeNewsletter() {

    const form =
        select("#newsletter-form");

    if (!form) return;


    const input =
        select(
            'input[type="email"]',
            form
        );

    if (!input) return;


    form.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const email =
                normalizeText(input.value);


            if (
                !email ||
                !validateEmail(email)
            ) {

                input.setAttribute(
                    "aria-invalid",
                    "true"
                );

                input.focus();

                return;

            }


            input.removeAttribute(
                "aria-invalid"
            );


            const savedEmails =
                getNewsletterEmails();


            if (!savedEmails.includes(email)) {

                savedEmails.push(email);

                localStorage.setItem(
                    "nobrega-newsletter",
                    JSON.stringify(savedEmails)
                );

            }


            showNewsletterSuccess(form);

            form.reset();

        }
    );

}


function getNewsletterEmails() {

    try {

        return (
            JSON.parse(
                localStorage.getItem(
                    "nobrega-newsletter"
                )
            ) || []
        );

    } catch {

        return [];

    }

}


function showNewsletterSuccess(form) {

    const button =
        select("button", form);

    if (!button) return;


    const originalContent =
        button.innerHTML;


    button.innerHTML =
        `<span aria-hidden="true">✓</span> Cadastrado`;

    button.classList.add("is-success");

    button.disabled = true;


    setTimeout(() => {

        button.innerHTML =
            originalContent;

        button.classList.remove(
            "is-success"
        );

        button.disabled = false;

    }, 3500);

}


/* =========================================================
   BOTÃO VOLTAR AO TOPO
========================================================= */

function initializeBackToTop() {

    const button =
        select("#back-to-top") ||
        select(".back-to-top");

    if (!button) return;


    const updateButton = () => {

        button.classList.toggle(
            "is-visible",
            window.scrollY > 600
        );

    };


    updateButton();


    window.addEventListener(
        "scroll",
        updateButton,
        { passive: true }
    );


    button.addEventListener(
        "click",
        () => {

            window.scrollTo({

                top: 0,

                behavior:
                    window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches
                        ? "auto"
                        : "smooth"

            });

        }
    );

}


/* =========================================================
   ANO ATUAL
========================================================= */

function initializeCurrentYear() {

    const yearElement =
        select("#current-year");

    if (!yearElement) return;


    yearElement.textContent =
        new Date().getFullYear();

}


/* =========================================================
   LAZY LOADING
========================================================= */

function initializeLazyImages() {

    const images =
        selectAll("img");


    images.forEach((image) => {

        if (
            !image.hasAttribute("loading")
        ) {

            image.setAttribute(
                "loading",
                "lazy"
            );

        }


        image.addEventListener(
            "load",
            () => {

                image.classList.add(
                    "is-loaded"
                );

            }
        );


        image.addEventListener(
            "error",
            () => {

                image.classList.add(
                    "has-error"
                );

                image.alt =
                    image.alt ||
                    "Imagem indisponível";

            }
        );


        if (image.complete) {

            image.classList.add(
                "is-loaded"
            );

        }

    });

}


/* =========================================================
   PARALLAX
========================================================= */

function initializeParallax() {

    const elements =
        selectAll("[data-parallax]");

    if (
        !elements.length ||
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        return;

    }


    let ticking = false;


    const updateParallax = () => {

        const scrollPosition =
            window.scrollY;


        elements.forEach((element) => {

            const speed =
                Number(
                    element.dataset.parallax
                ) || 0.08;

            const rect =
                element.getBoundingClientRect();

            const elementPosition =
                scrollPosition +
                rect.top;

            const distance =
                scrollPosition -
                elementPosition;

            element.style.transform =
                `translate3d(0, ${distance * speed}px, 0)`;

        });


        ticking = false;

    };


    window.addEventListener(
        "scroll",
        () => {

            if (!ticking) {

                requestAnimationFrame(
                    updateParallax
                );

                ticking = true;

            }

        },
        { passive: true }
    );

}


/* =========================================================
   NAVEGAÇÃO ATIVA
========================================================= */

function initializeActiveNavigation() {

    const sections =
        selectAll("main section[id], section[id]");

    const navigationLinks =
        selectAll(
            [
                ".header__nav a[href^='#']",
                ".nav a[href^='#']",
                "[data-menu] a[href^='#']"
            ].join(",")
        );


    if (
        !sections.length ||
        !navigationLinks.length
    ) {

        return;

    }


    const updateActiveLink = () => {

        const scrollPosition =
            window.scrollY + 180;

        let activeSectionID = "";


        sections.forEach((section) => {

            const sectionTop =
                section.offsetTop;

            const sectionBottom =
                sectionTop +
                section.offsetHeight;


            if (
                scrollPosition >= sectionTop &&
                scrollPosition < sectionBottom
            ) {

                activeSectionID =
                    section.id;

            }

        });


        navigationLinks.forEach((link) => {

            const linkTarget =
                link.getAttribute("href")
                    ?.replace("#", "");

            const isActive =
                linkTarget === activeSectionID;


            link.classList.toggle(
                "is-active",
                isActive
            );


            if (isActive) {

                link.setAttribute(
                    "aria-current",
                    "page"
                );

            } else {

                link.removeAttribute(
                    "aria-current"
                );

            }

        });

    };


    updateActiveLink();


    window.addEventListener(
        "scroll",
        debounce(
            updateActiveLink,
            70
        ),
        { passive: true }
    );

}