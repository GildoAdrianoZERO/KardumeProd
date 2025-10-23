document.addEventListener('DOMContentLoaded', function() {
    
    // --- LÓGICA DO MENU (VERSÃO SIMPLIFICADA PARA CSS HACK) ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const dropdownCheckbox = document.getElementById('dropdown-toggle-checkbox');

    // Função para fechar tudo
    const closeAllMenus = () => {
        if (hamburger) hamburger.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
        // Desmarca o checkbox para o CSS esconder o dropdown
        if (dropdownCheckbox) dropdownCheckbox.checked = false; 
    };

    if (hamburger && navMenu) {
        // Abre e fecha o menu principal
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            // Se fechar o menu, desmarca o checkbox
            if (!hamburger.classList.contains('active')) {
                if (dropdownCheckbox) dropdownCheckbox.checked = false;
            }
        });

        // Fecha o menu ao clicar em qualquer link <a>
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // Pequeno delay para garantir que a navegação ocorra antes de fechar
                setTimeout(closeAllMenus, 100); 
            });
        });
    }

    // O restante do seu JavaScript não precisa de alterações.
    // ...

    // As funções start/stopTeamAutoPlay precisam ser acessíveis globalmente
    let stopTeamAutoPlay = () => {};
    let startTeamAutoPlay = () => {};

    // FUNCIONALIDADE DAS ABAS (TABS)
    const tabs = document.querySelectorAll('.tab-item');
    const tabContents = document.querySelectorAll('.tab-content');
    if(tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(item => item.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                tab.classList.add('active');
                const targetContent = document.getElementById(tab.dataset.tab);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }
    
    // --- LÓGICA DO CARROSSEL 'SOBRE NÓS' (VERSÃO MODERNA) ---
    const aboutViewport = document.getElementById('about-viewport');
    if (aboutViewport) {
        const aboutSlide = document.getElementById('about-slide');
        const aboutCards = document.querySelectorAll('.about-card');
        const aboutPrevBtn = document.getElementById('about-prev');
        const aboutNextBtn = document.getElementById('about-next');

        if(aboutCards.length > 0) {
            let currentIndex = 0;
            const totalSlides = aboutCards.length;
            let isDragging = false, startPos = 0, currentTranslate = 0, prevTranslate = 0;

            function updateCarousel() {
                const viewportWidth = aboutViewport.offsetWidth;
                const cardWidth = aboutCards[0].offsetWidth;
                const gap = parseInt(window.getComputedStyle(aboutSlide).gap) || 30;

                const offset = (viewportWidth / 2) - (cardWidth / 2);
                const newLeft = offset - currentIndex * (cardWidth + gap);
                aboutSlide.style.left = `${newLeft}px`;

                aboutCards.forEach((card, index) => {
                    card.classList.toggle('active', index === currentIndex);
                });
            }

            function slideNext() {
                if (currentIndex < totalSlides - 1) {
                    currentIndex++;
                    updateCarousel();
                }
            }

            function slidePrev() {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            }

            function getPositionX(event) {
                return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
            }

            function dragStart(event) {
                isDragging = true;
                startPos = getPositionX(event);
                aboutSlide.classList.add('grabbing');
                aboutSlide.style.transition = 'none';
                prevTranslate = parseFloat(aboutSlide.style.left.replace('px', '')) || 0;
            }

            function dragMove(event) {
                if (isDragging) {
                    const currentPosition = getPositionX(event);
                    currentTranslate = prevTranslate + currentPosition - startPos;
                    aboutSlide.style.left = `${currentTranslate}px`;
                }
            }

            function dragEnd() {
                if (!isDragging) return;
                isDragging = false;
                aboutSlide.classList.remove('grabbing');
                aboutSlide.style.transition = 'left 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';

                const movedBy = (parseFloat(aboutSlide.style.left.replace('px', '')) || 0) - prevTranslate;

                if (movedBy < -75 && currentIndex < totalSlides - 1) {
                    currentIndex++;
                }
                if (movedBy > 75 && currentIndex > 0) {
                    currentIndex--;
                }
                updateCarousel();
            }

            aboutNextBtn.addEventListener('click', slideNext);
            aboutPrevBtn.addEventListener('click', slidePrev);
            aboutSlide.addEventListener('mousedown', dragStart);
            document.addEventListener('mouseup', dragEnd);
            document.addEventListener('mouseleave', dragEnd);
            document.addEventListener('mousemove', dragMove);
            aboutSlide.addEventListener('touchstart', dragStart, { passive: true });
            document.addEventListener('touchend', dragEnd);
            document.addEventListener('touchmove', dragMove, { passive: true });

            window.addEventListener('resize', updateCarousel);
            setTimeout(updateCarousel, 100);
        }
    }

    // --- LÓGICA DO CARROSSEL DA EQUIPE ---
    const teamViewport = document.querySelector('.team-carousel-viewport');
    if (teamViewport) {
        const teamSlide = document.getElementById('team-slide');
        const teamPrevBtn = document.getElementById('team-prev');
        const teamNextBtn = document.getElementById('team-next');
        const originalTeamCards = 4;
        const cardWidth = 260;
        let teamCurrentIndex = 0;
        let teamAutoPlayInterval;

        stopTeamAutoPlay = () => clearInterval(teamAutoPlayInterval);
        startTeamAutoPlay = () => {
            stopTeamAutoPlay();
            teamAutoPlayInterval = setInterval(handleNextClick, 5000);
        };

        let isDragging = false, startPos = 0, currentTranslate = 0, prevTranslate = 0, animationID;

        function moveToTeamSlide(index, withTransition = true) {
            if (!withTransition) teamSlide.style.transition = 'none';
            currentTranslate = -index * cardWidth;
            teamSlide.style.transform = `translateX(${currentTranslate}px)`;
            prevTranslate = currentTranslate;
            if (!withTransition) {
                setTimeout(() => {
                    teamSlide.style.transition = 'transform 0.5s ease-in-out';
                }, 50);
            }
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

        function handlePrevClick() {
            if (teamCurrentIndex <= 0) {
                teamCurrentIndex = originalTeamCards;
                moveToTeamSlide(teamCurrentIndex, false);
            }
            setTimeout(() => {
                teamCurrentIndex--;
                moveToTeamSlide(teamCurrentIndex);
            }, 50);
        }

        function getPositionX(event) {
            return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
        }

        function dragStart(event) {
            stopTeamAutoPlay();
            isDragging = true;
            startPos = getPositionX(event);
            teamSlide.classList.add('grabbing');
            animationID = requestAnimationFrame(animation);
            teamSlide.style.transition = 'none';
        }

        function dragMove(event) {
            if (isDragging) {
                const currentPosition = getPositionX(event);
                currentTranslate = prevTranslate + currentPosition - startPos;
            }
        }

        function dragEnd() {
            cancelAnimationFrame(animationID);
            isDragging = false;
            const movedBy = currentTranslate - prevTranslate;

            if (movedBy < -100 && teamCurrentIndex < (originalTeamCards * 2) - 1) {
                handleNextClick();
            } else if (movedBy > 100 && teamCurrentIndex > 0) {
                handlePrevClick();
            } else {
                moveToTeamSlide(teamCurrentIndex);
            }
            
            teamSlide.style.transition = 'transform 0.5s ease-in-out';
            teamSlide.classList.remove('grabbing');
            startTeamAutoPlay();
        }

        function animation() {
            teamSlide.style.transform = `translateX(${currentTranslate}px)`;
            if (isDragging) requestAnimationFrame(animation);
        }
        
        teamNextBtn.addEventListener('click', handleNextClick);
        teamPrevBtn.addEventListener('click', handlePrevClick);
        teamViewport.addEventListener('mouseenter', stopTeamAutoPlay);
        teamViewport.addEventListener('mouseleave', startTeamAutoPlay);
        teamSlide.addEventListener('dragstart', (e) => e.preventDefault());
        teamSlide.addEventListener('mousedown', dragStart);
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('mouseleave', dragEnd);
        document.addEventListener('touchmove', dragMove, { passive: true });
        teamSlide.addEventListener('touchstart', dragStart, { passive: true });
        document.addEventListener('touchend', dragEnd);

        startTeamAutoPlay();
    }

    // --- LÓGICA DO MODAL (POP-UP) DA EQUIPE ---
    const modal = document.getElementById('team-modal');
    if (modal) {
        const allTeamCards = document.querySelectorAll('.team-card');
        const modalImg = document.getElementById('modal-img');
        const modalText = document.getElementById('modal-text');
        const closeButton = modal.querySelector('.close-button');

        function openModal(imgSrc, name, desc) {
            stopTeamAutoPlay();
            modalImg.src = imgSrc;
            modalText.innerHTML = `<h5>${name}</h5><p>${desc}</p>`;
            modal.style.display = 'flex';
        }

        function closeModal() {
            modal.style.display = 'none';
            startTeamAutoPlay();
        }

        allTeamCards.forEach(card => {
            card.addEventListener('click', () => {
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