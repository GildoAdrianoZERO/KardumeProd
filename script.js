document.addEventListener('DOMContentLoaded', function() {
    
    // As funções start/stopTeamAutoPlay precisam ser acessíveis globalmente
    // para que o modal possa chamá-las. Vamos declará-las fora do escopo do carrossel.
    let stopTeamAutoPlay = () => {};
    let startTeamAutoPlay = () => {};

    // --- INÍCIO DAS ALTERAÇÕES NO MENU ---

    // FUNCIONALIDADE DO MENU HAMBURGUER (MOBILE)
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownContent = document.querySelector('.dropdown-content');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        // Garante que o dropdown feche se o menu principal fechar
        if (!navMenu.classList.contains('active') && dropdownContent.classList.contains('show')) {
            dropdownContent.classList.remove('show');
        }
    });

    // NOVA LÓGICA PARA CONTROLAR O CLIQUE NO DROPDOWN "EVENTOS"
    dropdownToggle.addEventListener('click', function(e) {
        // Apenas executa esta lógica em telas mobile
        if (window.innerWidth <= 768) {
            e.preventDefault(); // Impede a navegação do link href="#"
            dropdownContent.classList.toggle('show'); // Mostra ou esconde o submenu
        }
    });

    // LÓGICA DE FECHAMENTO DO MENU AJUSTADA
    document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', (e) => {
        // NÃO fechar o menu se o clique for no próprio botão do dropdown
        // pois ele tem sua própria lógica para abrir/fechar o submenu
        if (e.target.classList.contains('dropdown-toggle')) {
            return;
        }

        // Se for qualquer outro link (inclusive os de dentro do dropdown), fecha tudo.
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');

        // Garante que o submenu também seja fechado
        if (dropdownContent.classList.contains('show')) {
            dropdownContent.classList.remove('show');
        }
    }));

    // --- FIM DAS ALTERAÇÕES NO MENU ---


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
    const sections = document.querySelectorAll('main > section');
    const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle)'); // Exclui o 'Eventos' da marcação
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.6 };
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href) {
                        // Limpa o href para comparar com o ID da seção
                        const cleanHref = href.split('#').pop();
                        link.classList.toggle('active', cleanHref === id);
                    }
                });
            }
        });
    }, observerOptions);
    sections.forEach(section => {
        if (section && section.id) sectionObserver.observe(section);
    });

    // --- LÓGICA DO CARROSSEL 'SOBRE NÓS' (VERSÃO MODERNA) ---
    const aboutViewport = document.getElementById('about-viewport');
    if (aboutViewport) { // Verifica se o carrossel existe na página
        const aboutSlide = document.getElementById('about-slide');
        const aboutCards = document.querySelectorAll('.about-card');
        const aboutPrevBtn = document.getElementById('about-prev');
        const aboutNextBtn = document.getElementById('about-next');

        let currentIndex = 0;
        const totalSlides = aboutCards.length;
        let isDragging = false, startPos = 0, currentTranslate = 0, prevTranslate = 0;

        function updateCarousel() {
            if (!aboutCards.length) return;
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

        // Atribuir as funções para as variáveis globais
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

    // --- LÓGICA DO MODAL (POP-UP) ---
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