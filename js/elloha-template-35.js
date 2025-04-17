$(document).ready(function () {
    // Variables globales pour les sélecteurs
    const $navbarToggler = $('.navbar-toggler');
    const $description = $('.description');
    const $weatherImg = $('.weather-icon');
    const $weatherTrad = $('.weather-trad');

    // ****** Gestion de la navigation mobile
    function initMobileNav() {
        $navbarToggler.on('click', function (event) {
            event.stopPropagation();
            $('.navbar-toggler .btn-menu').toggleClass('d-none');

            // On bascule la classe active du menu mobile
            const $mobileNav = $('.mobile-nav');
            $mobileNav.toggleClass('mobile-nav-active');

            if ($mobileNav.hasClass('mobile-nav-active')) {
                // Si le menu devient visible, déplier les éléments du menu progressivement
                var $menuItems = $mobileNav.find('.menu > li');
                $menuItems.hide();

                // Déplier chaque élément du menu avec un délai progressif
                $menuItems.each(function (index, element) {
                    $(element)
                        .delay(index * 100)
                        .slideDown(300)
                        .animate({ opacity: 1 }, 300);
                });
            } else {
                // Si le menu est caché, on cache tous les éléments progressivement
                var $menuItems = $mobileNav.find('.menu > li');
                $menuItems.each(function (index, element) {
                    $(element)
                        .delay(index * 100)
                        .slideUp(300)
                        .animate({ opacity: 0 }, 300);
                });
            }
        });
    }

    // ****** Gestion des sous-menus mobiles avec ouverture fluide et apparition progressive des items
    function initSubMenu() {
        $('.clic-sub-menu').on('click', function () {
            var $subMenu = $(this).children('.sub-menu');
            var $link = $(this).children('a');
            var $subMenuItems = $subMenu.children('li');

            if ($subMenu.hasClass('sub-menu-active')) {
                // Si le sous-menu est déjà actif, on le referme avec une animation fluide
                $subMenu.removeClass('sub-menu-active').stop(true, true).animate({
                    height: '0',
                    opacity: 0
                }, 300, function () {
                    // Quand la fermeture est terminée, réinitialiser l'opacité des éléments du sous-menu
                    $subMenuItems.css('opacity', 0);
                });
            } else {
                // Si le sous-menu n'est pas actif, on l'ouvre avec une animation fluide
                $subMenu.addClass('sub-menu-active').stop(true, true).animate({
                    height: $subMenu.get(0).scrollHeight,
                    opacity: 1
                }, 300, function () {
                    // Quand l'animation d'ouverture est terminée, commencer l'apparition des items
                    $subMenuItems.each(function (index) {
                        $(this).delay(index * 150).animate({ // Animation entre les items
                            opacity: 1
                        }, 200); // Animation pour chaque item
                    });
                });
            }

            // Gestion de l'état du lien
            if ($link.hasClass('a-active')) {
                $link.removeClass('a-active');
            } else {
                $('.clic-sub-menu a').removeClass('a-active');
                $link.addClass('a-active');
            }
        });
    }

    // ****** Btn Menu visible ou non
    function trackBtnMenuVisibility() {
        const $btnMenuContain = $('.btn-menu-contain');
        const $window = $(window);

        function checkVisibility() {
            if ($btnMenuContain.length === 0) return;

            const rect = $btnMenuContain[0].getBoundingClientRect();
            const isVisible = rect.top >= 0 && rect.bottom <= $window.height();

            if (isVisible) {
                $btnMenuContain.addClass('btn-menu-visible');
                $('.nav-desktop').removeClass('nav-reached-footer');
            } else {
                $btnMenuContain.removeClass('btn-menu-visible');
            }
        }

        $window.on('scroll resize', checkVisibility);
        checkVisibility();
    }

    // ****** Gestion de la Nav Desktop et sa position par rapport au footer
    function initPositionNavDesktop() {
        const $navDesktop = $('.nav-desktop');
        const $footer = $('footer');
        const $navFooterPadding = $('.nav-footer-padding');
        const $window = $(window);

        function adjustNavPosition() {
            if ($navFooterPadding.length === 0) return;

            const footerTop = $footer.offset().top;
            const navFooterPaddingBottom = $navFooterPadding.offset().top + $navFooterPadding.outerHeight();
            const scrollTop = $window.scrollTop();
            const windowHeight = $window.height();

            // Vérifie si le bas de nav-footer-padding touche le footer en fonction du scroll
            if (scrollTop + windowHeight >= footerTop && navFooterPaddingBottom >= footerTop) {
                $navDesktop.addClass('nav-reached-footer');
            } else {
                $navDesktop.removeClass('nav-reached-footer');
            }
        }

        $window.on('scroll resize', adjustNavPosition);
        adjustNavPosition();
    }

    // ****** Texte présentation page Home
    function initDescriptionToggle() {
        if ($description.length) {
            const $seeMore2 = $('#seeMore2');
            const $seeLess2 = $('#seeLess2');

            // Vérifie hauteur description
            if ($description[0].scrollHeight <= $description.height()) {
                $seeMore2.hide();
                $seeLess2.hide();
            } else {
                $seeMore2.show();
                $seeLess2.hide();
            }

            // Voir plus
            $seeMore2.on('click', function (e) {
                e.preventDefault();
                $description.css('height', 'auto').addClass('expanded');
                $seeMore2.hide();
                $seeLess2.show();
            });

            // Voir moins
            $seeLess2.on('click', function (e) {
                e.preventDefault();
                $description.css('height', '').removeClass('expanded');
                $seeMore2.show();
                $seeLess2.hide();
            });
        }
    }

    // ****** Gestion des options SCEA
    function initSceaToggle() {
        const $optionsScea = $('.options-scea');
        const totalOptions = $optionsScea.length;

        // Afficher les 10 premiers éléments et cacher les autres
        $optionsScea.hide().slice(0, 10).show();

        // Si toutes les options sont déjà visibles, cacher le bouton "Voir plus"
        const visibleOptions = $optionsScea.filter(':visible').length;
        if (visibleOptions === totalOptions) {
            $('#seeMore1').hide(); // Cache le bouton si toutes les options sont visibles
        } else {
            $('#seeMore1').show(); // Affiche le bouton si ce n'est pas le cas
        }

        $('#seeMore1').on('click', function (e) {
            e.preventDefault();

            // Récupérer les éléments cachés (ceux qui doivent être affichés)
            const elementsToShow = $optionsScea.filter(':hidden').get();

            // Parcours des éléments par groupes de 5
            for (let i = 0; i < elementsToShow.length; i += 5) {
                const group = elementsToShow.slice(i, i + 5);
                group.forEach(function (element) {
                    $(element).delay(i * 5).slideDown(50);
                });
            }

            // Si toutes les options sont maintenant visibles, on cache le bouton "Voir plus"
            if ($optionsScea.filter(':hidden').length === 0) {
                $('#seeMore1').hide();
            }

            // Gestion des boutons
            $('#seeMore1').hide();
            $('#seeLess1').show();
        });

        $('#seeLess1').on('click', function (e) {
            e.preventDefault();

            // On récupère les éléments au-delà des 10 premiers, dans l'ordre inverse
            const elementsToHide = $optionsScea.not(':lt(10)').get().reverse();

            // Parcours des éléments par groupes de 5
            for (let i = 0; i < elementsToHide.length; i += 5) {
                const group = elementsToHide.slice(i, i + 5);
                group.forEach(function (element) {
                    $(element).delay(i * 5).slideUp(50);
                });
            }

            // Gestion des boutons
            $('#seeMore1').show();
            $('#seeLess1').hide();
        });
    }

    // ****** Slider Galerie
    function initSliderGallery() {
        const sliderGallery = document.querySelector(".slider-gallery");
        const slides = Array.from(sliderGallery.querySelectorAll(".slide-gallery"));
        const currentPhotoContainer = document.querySelector(".current-photo-container");
        const totalPhotosElement = document.querySelector(".total-photos");
        const totalPhotos = slides.length;
        // Maximum de slides visibles simultanément
        const maxVisibleSlides = 7;
        // Intervalle normal (3 secondes)
        const normalInterval = 3000;
        // Intervalle au survol (5 secondes)
        const hoverInterval = 5000;
        let currentIndex = 0;
        let autoPlayInterval;
        let isHovering = false;

        // Calculer la largeur optimale de l'image active
        function calculateActiveWidth() {
            // Largeur fixe pour les images inactives (2%)
            const inactiveWidth = 2;

            // Espace occupé par le gap (1% entre chaque slide)
            const gapSpace = (Math.min(totalPhotos, maxVisibleSlides) - 1) * 1;

            // Nombre d'images visibles inactives
            let visibleInactiveSlides = Math.min(totalPhotos - 1, maxVisibleSlides - 1);

            // Calcul de l'espace disponible pour l'image active
            const availableSpace = 100 - (visibleInactiveSlides * inactiveWidth) - gapSpace;

            // Au moins 50% pour l'image active
            return Math.max(availableSpace, 50);
        }

        // Définir la largeur active calculée comme variable CSS
        const activeWidth = calculateActiveWidth();
        sliderGallery.style.setProperty('--active-width', activeWidth + '%');
        sliderGallery.style.setProperty('--inactive-width', '2%');

        // Initialiser le total des photos
        totalPhotosElement.textContent = String(totalPhotos).padStart(2, "0");

        // Initialiser uniquement si nécessaire
        if (currentPhotoContainer && !currentPhotoContainer.querySelector('.slide-number')) {
            currentPhotoContainer.innerHTML = '<span class="slide-number current">01</span>';
        }

        // Fonction pour mettre à jour l'indicateur de slide avec animation
        function updateSlideIndicator(newIndex) {
            if (!currentPhotoContainer) return;
            // Récupérer le nombre actuel
            const currentNumber = currentPhotoContainer.querySelector('.slide-number.current');
            if (!currentNumber) return;
            // Nettoyer les anciens éléments
            currentPhotoContainer.querySelectorAll('.slide-number:not(.current)').forEach(el => el.remove());
            // Créer le nouveau nombre (indexé à partir de 1)
            const newNumber = document.createElement('span');
            newNumber.className = 'slide-number next';
            newNumber.textContent = String(newIndex + 1).padStart(2, "0");
            // Ajouter le nouveau nombre au conteneur
            currentPhotoContainer.appendChild(newNumber);
            // Déclencher le repaint pour assurer que la transition fonctionne
            void currentPhotoContainer.offsetWidth;
            // Animation
            currentNumber.classList.replace('current', 'prev');
            newNumber.classList.replace('next', 'current');
            // Nettoyer après l'animation
            setTimeout(() => currentNumber.remove(), 300);
        }

        // Fonction pour gérer la visibilité des slides
        function updateVisibility(newIndex) {
            // Si totalPhotos <= maxVisibleSlides, tous les slides sont visibles
            if (totalPhotos <= maxVisibleSlides) {
                slides.forEach(slide => {
                    slide.classList.remove("hidden");
                    slide.style.display = "";
                });
                return;
            }

            // Calculer les slides à afficher (centrés autour de l'actif)
            let visibleIndices = [];
            const halfVisible = Math.floor((maxVisibleSlides - 1) / 2);

            // Ajouter les slides avant l'actif
            for (let i = 1; i <= halfVisible; i++) {
                const prevIndex = (newIndex - i + totalPhotos) % totalPhotos;
                visibleIndices.push(prevIndex);
            }

            // Ajouter le slide actif
            visibleIndices.push(newIndex);

            // Ajouter les slides après l'actif
            for (let i = 1; i <= maxVisibleSlides - 1 - halfVisible; i++) {
                const nextIndex = (newIndex + i) % totalPhotos;
                visibleIndices.push(nextIndex);
            }

            // Mise à jour de la visibilité des slides
            slides.forEach((slide, index) => {
                if (visibleIndices.includes(index)) {
                    slide.classList.remove("hidden");
                    slide.style.display = "";
                }
                // Retiré du flux
                else {
                    slide.classList.add("hidden");
                    slide.style.display = "none";
                }
            });
        }

        // Fonction pour activer un slide spécifique
        function updateSlider(newIndex) {
            // Mise à jour de la visibilité des slides
            updateVisibility(newIndex);

            // Transition douce pour les slides
            slides.forEach(slide => slide.style.transition = "all 0.6s ease");

            // Réinitialiser toutes les images
            slides.forEach(slide => slide.classList.remove("active"));

            // Définir le nouveau slide actif
            slides[newIndex].classList.add("active");

            // Mettre à jour l'indicateur de slide avec animation
            updateSlideIndicator(newIndex);

            // Mettre à jour l'index courant
            currentIndex = newIndex;
        }

        // Réinitialiser l'intervalle en fonction de l'état de survol
        function resetInterval() {
            clearInterval(autoPlayInterval);
            const interval = isHovering ? hoverInterval : normalInterval;
            autoPlayInterval = setInterval(nextSlide, interval);
        }

        // Fonction pour passer au slide suivant
        function nextSlide() {
            updateSlider((currentIndex + 1) % totalPhotos);
        }

        // Ajouter les gestionnaires de clic
        slides.forEach((slide, index) => {
            slide.addEventListener("click", function () {
                updateSlider(index);

                // Réinitialiser l'intervalle de défilement automatique
                resetInterval();
            });
        });

        // Ajouter un gestionnaire de mouvement de souris global
        document.addEventListener('mousemove', function (e) {
            // Trouver le slide actif
            const activeSlide = document.querySelector('.slide-gallery.active');
            if (!activeSlide) return;

            // Vérifier si la souris est sur le slide actif
            const rect = activeSlide.getBoundingClientRect();
            const isMouseOverActive = (
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom
            );

            // Si l'état a changé, mettre à jour et réinitialiser l'intervalle
            if (isMouseOverActive !== isHovering) {
                isHovering = isMouseOverActive;

                resetInterval();
            }
        });

        // Initialiser la visibilité des slides
        updateVisibility(0);

        // Mettre le premier slide comme actif par défaut
        updateSlider(0);

        // Permettre les transitions après le chargement initial
        setTimeout(() => {
            slides.forEach(slide => slide.style.transition = "all 0.6s ease");
        }, 100);

        // Démarrer le défilement automatique
        autoPlayInterval = setInterval(nextSlide, normalInterval);
    }

    // ****** Gestion des icônes météo
    function initWeatherImg() {
        $weatherImg.each(function () {
            const $this = $(this);
            let weatherIcon = $this.attr('data') || 'clear-day';
            const $meteoImg = $this.closest('.weather-img-contain').find('.meteo-img');
            const baseUrl = $meteoImg.data('url');
            const iconPath = `${baseUrl}${weatherIcon}.jpeg`;

            $meteoImg
                .addClass(`weather-${weatherIcon}`)
                .css({
                    'background-image': `url(${iconPath})`,
                    'background-size': 'cover',
                });
        });
    }

    // ****** Traduction météo
    function initWeatherTranslation() {
        const weatherTranslations = {
            'clear-day': 'Clair',
            'Cloudy': 'Nuageux',
            'fog': 'Brouillard',
            'partly-cloudy-day': 'Mi-couvert',
            'rain': 'Pluie',
            'sleet': 'Verglas',
            'snow': 'Neige',
            'wind': 'Vent',
        };

        $weatherTrad.each(function () {
            const $this = $(this);
            const weatherTrad = $this.attr('data') || 'Undefined';
            const translation = weatherTranslations[weatherTrad] || 'Non defini';
            $this.text(translation);
        });
    }

    // ****** Size des cards au hover
    function sizeCardsChanged(carouselSelector) {
        $(`${carouselSelector} .card-size-changed`).hover(
            function () {
                $(this).addClass('hover');
                $(`${carouselSelector} .card-size-changed`).not(this).addClass('dimmed');

                var $parent = $(this).closest('.owl-item.active');
                $parent.addClass('hover-parent');
                $(`${carouselSelector} .card-size-changed`).not(this).closest('.owl-item.active').addClass('dimmed-parent');

                if (window.innerWidth >= 768 && window.innerWidth <= 1219) {
                    $parent.css({ 'width': '+=40px' });
                    $('.dimmed-parent').css({ 'width': '-=40px' });
                }

                if (window.innerWidth >= 1220 && window.innerWidth <= 1479) {
                    $parent.css({ 'width': '+=80px' });
                    $('.dimmed-parent').css({ 'width': '-=40px' });
                }

                if (window.innerWidth >= 1480) {
                    $parent.css({ 'width': '+=120px' });
                    $('.dimmed-parent').css({ 'width': '-=40px' });
                }
            },
            function () {
                if (window.innerWidth >= 768 && window.innerWidth <= 1219) {
                    $('.hover-parent').css({ 'width': '-=40px' });
                    $('.dimmed-parent').css({ 'width': '+=40px' });
                }

                if (window.innerWidth >= 1220 && window.innerWidth <= 1479) {
                    $('.hover-parent').css({ 'width': '-=80px' });
                    $('.dimmed-parent').css({ 'width': '+=40px' });
                }

                if (window.innerWidth >= 1480) {
                    $('.hover-parent').css({ 'width': '-=120px' });
                    $('.dimmed-parent').css({ 'width': '+=40px' });
                }

                $(`${carouselSelector} .card-size-changed`).removeClass('hover dimmed');
                $(`${carouselSelector} .owl-item.active`).removeClass('hover-parent dimmed-parent');
            }
        );
    }

    // ****** Slider des images dans Offers
    $('.slider-img-offers').owlCarousel({
        loop: true,
        rewind: false,
        autoplay: false,
        navText: ["<i class='las la-arrow-left'></i>", "<i class='las la-arrow-right'></i>"],
        responsiveClass: true,
        dots: true,
        nav: false,
        items: 1,
        responsive: {
            0: {
                touchDrag: true,
                mouseDrag: true,
            },
            1220: {
                touchDrag: false,
                mouseDrag: true,
            },
        }
    });

    // ****** Slider Options
    $('.slider-options').owlCarousel({
        loop: false,
        rewind: true,
        autoplay: true,
        autoplayHoverPause: true,
        navText: ["<i class='las la-arrow-left'></i>", "<i class='las la-arrow-right'></i>"],
        responsiveClass: true,
        dots: false,
        nav: false,
        responsive: {
            0: {
                margin: 16,
                items: 1,
                touchDrag: true,
                mouseDrag: true,
            },
            768: {
                margin: 16,
                items: 2,
                touchDrag: true,
                mouseDrag: true,
            },
            1024: {
                margin: 24,
                items: 2,
                touchDrag: true,
                mouseDrag: true,
            },
            1220: {
                margin: 24,
                items: 3,
                touchDrag: false,
                mouseDrag: true,
            },
            1480: {
                margin: 24,
                items: 4,
                touchDrag: false,
                mouseDrag: true,
            }
        }
    });

    // ****** Slider Giftcards
    $('.slider-giftcards').owlCarousel({
        loop: false,
        rewind: true,
        autoplay: true,
        autoplayHoverPause: true,
        navText: ["<i class='las la-arrow-left'></i>", "<i class='las la-arrow-right'></i>"],
        responsiveClass: true,
        dots: false,
        nav: false,
        responsive: {
            0: {
                margin: 16,
                items: 1,
                touchDrag: true,
                mouseDrag: true,
            },
            768: {
                margin: 16,
                items: 2,
                touchDrag: true,
                mouseDrag: true,
            },
            1024: {
                margin: 24,
                items: 2,
                touchDrag: true,
                mouseDrag: true,
            },
            1220: {
                margin: 24,
                items: 3,
                touchDrag: false,
                mouseDrag: true,
            },
            1480: {
                margin: 24,
                items: 4,
                touchDrag: false,
                mouseDrag: true,
            }
        }
    });

    // Clics sur les liens des prix chèques cadeaux
    $('.all-prices-vouchers a').on('click', function (event) {
        event.preventDefault();

        var targetId = $(this).attr('id');

        // Trouver l'élément correspondant dans le slider
        var targetElement = $(targetId);
        if (targetElement.length) {
            var index = $('.vouchers-slider').find('.owl-item').filter(function () {
                return $(this).find(targetId).length > 0;
            }).index();

            // Si un index valide est trouvé, déplacer le slider
            if (index !== -1) {
                $('.vouchers-slider').trigger('to.owl.carousel', [index, 600]);
            } else {
                console.error("Impossible de trouver l'index dans Owl Carousel pour :", targetId);
            }
        } else {
            console.error("Cible non trouvée pour :", targetId);
        }
    });

    // Détecter le changement dans Owl Carousel pour le .active
    $('.vouchers-slider').on('changed.owl.carousel', function (event) {
        var currentIndex = event.item.index;

        // Sélectionner l'élément actif dans le slider
        var activeSlide = $(event.target).find('.owl-item').eq(currentIndex).find('.presta-contain-gift');

        if (activeSlide.length) {
            var activeId = activeSlide.attr('id');
            console.log("Élément actif dans le slider :", activeId);

            $('.all-prices-vouchers a').removeClass('active');

            $('.all-prices-vouchers a[href="#' + activeId + '"]').addClass('active');

        }
    });

    $('.vouchers-slider').owlCarousel({
        loop: false,
        rewind: true,
        autoplay: false,
        navText: ["<i class='las la-angle-left'></i>", "<i class='las la-angle-right'></i>"],
        items: 1,
        autoHeight: true,
        responsiveClass: true,
        dots: false,
        nav: false,
        responsive: {
            0: {
                touchDrag: true,
                mouseDrag: true,
            },
            1220: {
                touchDrag: false,
                mouseDrag: true,
            },
        }
    });

    // ****** Slider autres prestations
    $('.slider-other-prestas').owlCarousel({
        loop: false,
        rewind: true,
        autoplay: true,
        autoplayHoverPause: true,
        navText: ["<i class='las la-arrow-left'></i>", "<i class='las la-arrow-right'></i>"],
        responsiveClass: true,
        dots: false,
        nav: false,
        responsive: {
            0: {
                margin: 16,
                items: 1,
                touchDrag: true,
                mouseDrag: true,
            },
            768: {
                margin: 16,
                items: 2,
                touchDrag: true,
                mouseDrag: true,
            },
            1024: {
                margin: 24,
                items: 2,
                touchDrag: true,
                mouseDrag: true,
            },
            1220: {
                margin: 24,
                items: 3,
                touchDrag: false,
                mouseDrag: true,
            },
            1480: {
                margin: 24,
                items: 4,
                touchDrag: false,
                mouseDrag: true,
            }
        }
    });

    // ****** Clic description AROUND
    function initDescriptionAroundToggle() {
        $(".seeMore4").on("click", function (e) {
        // Clic sur "Voir plus"
            e.preventDefault();
            var $container = $(this).closest(".descrip-around-contain");
            var $description = $container.find(".description-around");
            $description.addClass("expanded");
            $container.find(".seeMore4").hide();
            $container.find(".seeLess4").show();
        });

        // Clic sur "Voir moins"
        $(".seeLess4").on("click", function (e) {
            e.preventDefault();
            var $container = $(this).closest(".descrip-around-contain");
            var $description = $container.find(".description-around");
            $description.removeClass("expanded");
            $container.find(".seeMore4").show();
            $container.find(".seeLess4").hide();
        });
    }

    // ****** Slider météo sur Around
    $('.slider-meteo-2').owlCarousel({
        loop: false,
        rewind: true,
        autoplay: false,
        items: 1,
        navText: ["<i class='las la-arrow-left'></i>", "<i class='las la-arrow-right'></i>"],
        responsiveClass: true,
        dots: true,
        nav: false,
        responsive: {
            0: {
                margin: 0,
                touchDrag: true,
                mouseDrag: true,
            },
            768: {
                margin: 3,
                touchDrag: true,
                mouseDrag: true,
            },
            1024: {
                margin: 10,
                touchDrag: true,
                mouseDrag: true,
            },
            1220: {
                margin: 10,
                touchDrag: false,
                mouseDrag: true,
            },
        }
    });

    // ****** Slider page
    $('.slider-page-page').owlCarousel({
        loop: true,
        rewind: false,
        autoplay: true,
        autoplayHoverPause: true,
        items: 1,
        navText: ["<i class='las la-arrow-left'></i>", "<i class='las la-arrow-right'></i>"],
        responsiveClass: true,
        dots: true,
        nav: false,
        responsive: {
            0: {
                touchDrag: true,
                mouseDrag: true,
            },
            1220: {
                touchDrag: false,
                mouseDrag: true,
            },
        }
    });

    // ****** Initialisation des modules sur page précise
    if ($('main').hasClass('offers')) {
        sizeCardsChanged('.slider-options');
    }
    if ($('main').hasClass('detail')) {
        sizeCardsChanged('.slider-options');
        initWeatherImg();
        initWeatherTranslation();
    }
    if ($('main').hasClass('gifts')) {
        sizeCardsChanged('.slider-giftcards');
    }
    if ($('main').hasClass('around')) {
        initDescriptionAroundToggle();
        initWeatherImg();
        initWeatherTranslation();
    }
    // ****** Initialisation des modules toute page et/ou home
    initMobileNav();
    initSubMenu();
    trackBtnMenuVisibility();
    initPositionNavDesktop();
    initDescriptionToggle();
    initSceaToggle();
    initSliderGallery();
    initWeatherImg();
    initWeatherTranslation();
    sizeCardsChanged('.slider-news');
});

// ****** Tous les Owl Carousel
$(document).ready(function () {
    $('.slider-prestas').owlCarousel({
        loop: false,
        rewind: true,
        autoplay: true,
        autoplayHoverPause: true,
        navText: ["<i class='las la-arrow-left'></i>", "<i class='las la-arrow-right'></i>"],
        responsiveClass: true,
        dots: false,
        nav: false,
        responsive: {
            0: {
                margin: 16,
                items: 1,
                touchDrag: true,
                mouseDrag: true,
            },
            768: {
                margin: 16,
                items: 2,
                touchDrag: true,
                mouseDrag: true,
            },
            1024: {
                margin: 24,
                items: 2,
                touchDrag: true,
                mouseDrag: true,
            },
            1220: {
                margin: 24,
                items: 3,
                touchDrag: false,
                mouseDrag: true,
            },
            1480: {
                margin: 24,
                items: 4,
                touchDrag: false,
                mouseDrag: true,
            }
        }
    });
    $('.slider-img-prestas').owlCarousel({
        loop: true,
        rewind: false,
        autoplay: false,
        navText: ["<i class='las la-arrow-left'></i>", "<i class='las la-arrow-right'></i>"],
        responsiveClass: true,
        dots: true,
        nav: false,
        items: 1,
        responsive: {
            0: {
                touchDrag: true,
                mouseDrag: true,
            },
            1220: {
                touchDrag: false,
                mouseDrag: true,
            },
        }
    });
    $('.slider-meteo').owlCarousel({
        loop: false,
        rewind: true,
        autoplay: false,
        items: 1,
        navText: ["<i class='las la-arrow-left'></i>", "<i class='las la-arrow-right'></i>"],
        responsiveClass: true,
        dots: true,
        nav: false,     
        responsive: {
            0: {
                margin: 0,
                touchDrag: true,
                mouseDrag: true,
            },
            768: {
                margin: 3,
                touchDrag: true,
                mouseDrag: true,
            },
            1024: {
                margin: 10,
                touchDrag: true,
                mouseDrag: true,
            },
            1220: {
                margin: 10,
                touchDrag: false,
                mouseDrag: true,
            },
        }
    });
    $('.avis-slider').owlCarousel({
        loop: true,
        rewind: false,
        autoplay: false,
        navText: ["<i class='las la-arrow-left'></i>", "<i class='las la-arrow-right'></i>"],
        responsiveClass: true,
        dots: true,
        nav: false,
        items: 1,
        margin: 20,
        responsive: {
            0: {
                touchDrag: true,
                mouseDrag: true,
            },
            1220: {
                touchDrag: false,
                mouseDrag: true,
            },
        }
    });
    $('.slider-news').owlCarousel({
        loop: false,
        rewind: true,
        autoplay: true,
        autoplayHoverPause: true,
        navText: ["<i class='las la-arrow-left'></i>", "<i class='las la-arrow-right'></i>"],
        responsiveClass: true,
        dots: false,
        nav: false,
        responsive: {
            0: {
                margin: 16,
                items: 1,
                touchDrag: true,
                mouseDrag: true,
            },
            768: {
                margin: 16,
                items: 2,
                touchDrag: true,
                mouseDrag: true,
            },
            1024: {
                margin: 24,
                items: 2,
                touchDrag: true,
                mouseDrag: true,
            },
            1220: {
                margin: 24,
                items: 3,
                touchDrag: false,
                mouseDrag: true,
            },
            1480: {
                margin: 24,
                items: 4,
                touchDrag: false,
                mouseDrag: true,
            }
        }
    });
});