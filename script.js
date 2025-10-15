document.addEventListener('DOMContentLoaded', function() {
    
    // FUNCIONALIDADE DO MENU HAMBURGUER (MOBILE)
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    // FUNCIONALIDADE DAS ABAS (TABS)
    const tabs = document.querySelectorAll('.tab-item');
    const tabContents = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(item => item.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            tab.classList.add('active');
            const targetContent = document.getElementById(tab.dataset.tab);
            targetContent.classList.add('active');
        });
    });

    // ATIVAR LINK DO MENU CONFORME A ROLAGEM
    const sections = document.querySelectorAll('main > section'); // Seletor mais específico
    const navLinks = document.querySelectorAll('.nav-link');
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.6 };
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href').substring(1) === id);
                });
            }
        });
    }, observerOptions);
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- LÓGICA DO CARROSSEL 'SOBRE NÓS' COM DRAG-AND-SWIPE E PONTOS ---
    const aboutViewport = document.getElementById('about-viewport');
    const aboutSlide = document.getElementById('about-slide');
    const aboutImages = document.querySelectorAll('.clickable-carousel-img');
    const aboutPrevBtn = document.getElementById('about-prev');
    const aboutNextBtn = document.getElementById('about-next');
    const dotsContainer = document.getElementById('about-dots');

    if (aboutSlide) { // Verifica se o carrossel existe na página
        let aboutCurrentIndex = 0;
        const aboutTotalSlides = aboutImages.length;
        let isDragging = false, startPos = 0, currentTranslate = 0, prevTranslate = 0, animationID;

        // Criar os pontos de navegação
        for (let i = 0; i < aboutTotalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dotsContainer.appendChild(dot);
            dot.addEventListener('click', () => {
                aboutCurrentIndex = i;
                setPositionByIndex();
            });
        }
        const dots = dotsContainer.querySelectorAll('.dot');
        updateDots();

        function updateDots() {
            dots.forEach(dot => dot.classList.remove('active'));
            dots[aboutCurrentIndex].classList.add('active');
        }

        function setPositionByIndex() {
            currentTranslate = aboutCurrentIndex * -aboutViewport.offsetWidth;
            prevTranslate = currentTranslate;
            setSliderPosition();
            updateDots();
        }

        function setSliderPosition() {
            aboutSlide.style.transform = `translateX(${currentTranslate}px)`;
        }

        function dragStart(event) {
            isDragging = true;
            startPos = getPositionX(event);
            aboutSlide.classList.add('grabbing');
            animationID = requestAnimationFrame(animation);
            aboutSlide.style.transition = 'none';
        }

        function dragMove(event) {
            if (isDragging) {
                const currentPosition = getPositionX(event);
                currentTranslate = prevTranslate + currentPosition - startPos;
            }
        }

        function dragEnd(event) {
            cancelAnimationFrame(animationID);
            isDragging = false;
            const movedBy = currentTranslate - prevTranslate;

            if (movedBy < -100 && aboutCurrentIndex < aboutTotalSlides - 1) aboutCurrentIndex++;
            if (movedBy > 100 && aboutCurrentIndex > 0) aboutCurrentIndex--;
            
            if (Math.abs(movedBy) < 10) {
                // Procura o elemento da imagem clicada
                const clickedImg = event.target.closest('.clickable-carousel-img');
                if (clickedImg) {
                    openModal(clickedImg.dataset.imgSrc, clickedImg.dataset.name, clickedImg.dataset.desc);
                }
            }

            setPositionByIndex();
            aboutSlide.style.transition = 'transform 0.5s ease-out';
            aboutSlide.classList.remove('grabbing');
        }

        function getPositionX(event) {
            return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
        }

        function animation() {
            setSliderPosition();
            if(isDragging) requestAnimationFrame(animation);
        }

        aboutSlide.addEventListener('dragstart', (e) => e.preventDefault());
        aboutSlide.addEventListener('mousedown', dragStart);
        aboutSlide.addEventListener('mouseup', dragEnd);
        aboutSlide.addEventListener('mouseleave', dragEnd);
        aboutSlide.addEventListener('touchstart', dragStart, { passive: true });
        aboutSlide.addEventListener('touchend', dragEnd);
        aboutSlide.addEventListener('touchmove', dragMove, { passive: true });

        aboutNextBtn.addEventListener('click', () => {
            aboutCurrentIndex = (aboutCurrentIndex + 1) % aboutTotalSlides;
            setPositionByIndex();
        });
        aboutPrevBtn.addEventListener('click', () => {
            aboutCurrentIndex = (aboutCurrentIndex - 1 + aboutTotalSlides) % aboutTotalSlides;
            setPositionByIndex();
        });
    }


    // --- LÓGICA DO CARROSSEL DA EQUIPE ---
    const teamViewport = document.querySelector('.team-carousel-viewport');
    if(teamViewport) { // Verifica se o carrossel existe
        const teamSlide = document.getElementById('team-slide');
        const teamPrevBtn = document.getElementById('team-prev');
        const teamNextBtn = document.getElementById('team-next');
        const originalTeamCards = document.querySelectorAll('.team-card').length / 2;
        const cardWidth = 300;
        let teamCurrentIndex = 0;
        let teamAutoPlayInterval;

        function moveToTeamSlide(index, withTransition = true) {
            if (!withTransition) teamSlide.style.transition = 'none';
            teamSlide.style.transform = `translateX(-${index * cardWidth}px)`;
            if (!withTransition) setTimeout(() => { teamSlide.style.transition = 'transform 0.5s ease-in-out'; }, 50);
        }
        
        function startTeamAutoPlay() {
            stopTeamAutoPlay();
            teamAutoPlayInterval = setInterval(() => { handleNextClick(); }, 5000);
        }

        function stopTeamAutoPlay() {
            clearInterval(teamAutoPlayInterval);
        }

        function handleNextClick() {
            teamCurrentIndex++;
            moveToTeamSlide(teamCurrentIndex);
            if (teamCurrentIndex >= originalTeamCards) {
                setTimeout(() => {
                    teamCurrentIndex = 0;
                    moveToTeamSlide(teamCurrentIndex, false);
                }, 500);
            }
        }

        teamNextBtn.addEventListener('click', handleNextClick);
        teamPrevBtn.addEventListener('click', () => {
            if (teamCurrentIndex <= 0) {
                teamCurrentIndex = originalTeamCards;
                moveToTeamSlide(teamCurrentIndex, false);
            }
            setTimeout(() => {
                teamCurrentIndex--;
                moveToTeamSlide(teamCurrentIndex);
            }, 50);
        });
        
        teamViewport.addEventListener('mouseenter', stopTeamAutoPlay);
        teamViewport.addEventListener('mouseleave', startTeamAutoPlay);
        teamViewport.addEventListener('click', (event) => {
            if (event.target.closest('.team-card') || event.target.closest('.carousel-button')) return;
            handleNextClick();
        });
        
        startTeamAutoPlay();
    }


    // --- LÓGICA DO MODAL (POP-UP) ---
    const modal = document.getElementById('team-modal');
    if (modal) { // Verifica se o modal existe
        const allTeamCards = document.querySelectorAll('.team-card');
        const modalImg = document.getElementById('modal-img');
        const modalText = document.getElementById('modal-text');
        const closeButton = document.querySelector('.close-button');

        function openModal(imgSrc, name, desc) {
            modalImg.src = imgSrc;
            modalText.innerHTML = `<h5>${name}</h5><p>${desc}</p>`;
            modal.style.display = 'flex';
        }

        function closeModal() {
            modal.style.display = 'none';
            // Reinicia o auto-play da equipe apenas se a viewport existir
            if(document.querySelector('.team-carousel-viewport')) {
                startTeamAutoPlay();
            }
        }

        allTeamCards.forEach(card => {
            card.addEventListener('click', (e) => {
                stopTeamAutoPlay();
                openModal(card.dataset.imgSrc, card.dataset.name, card.dataset.desc);
            });
        });
        
        closeButton.addEventListener('click', closeModal);
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }
});