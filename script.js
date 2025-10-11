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
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.6
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href').substring(1) === entry.target.id);
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- LÓGICA DO CARROSSEL 'SOBRE NÓS' COM BOTÕES ---
    const aboutSlide = document.getElementById('about-slide');
    const aboutPrevBtn = document.getElementById('about-prev');
    const aboutNextBtn = document.getElementById('about-next');
    const aboutImages = document.querySelectorAll('.clickable-carousel-img');
    
    let aboutCurrentIndex = 0;
    const aboutTotalSlides = aboutImages.length;

    function moveToAboutSlide(index) {
        const offsetPercentage = 100 / aboutTotalSlides;
        const offset = index * -offsetPercentage;
        aboutSlide.style.transform = `translateX(${offset}%)`;
    }

    aboutNextBtn.addEventListener('click', () => {
        aboutCurrentIndex = (aboutCurrentIndex + 1) % aboutTotalSlides;
        moveToAboutSlide(aboutCurrentIndex);
    });

    aboutPrevBtn.addEventListener('click', () => {
        aboutCurrentIndex = (aboutCurrentIndex - 1 + aboutTotalSlides) % aboutTotalSlides;
        moveToAboutSlide(aboutCurrentIndex);
    });

    // --- LÓGICA DO CARROSSEL DA EQUIPE COM BOTÕES E AUTO-PLAY ---
    const teamViewport = document.querySelector('.team-carousel-viewport');
    const teamSlide = document.getElementById('team-slide');
    const teamPrevBtn = document.getElementById('team-prev');
    const teamNextBtn = document.getElementById('team-next');
    
    const originalTeamCards = document.querySelectorAll('.team-card').length / 2; // 5
    const cardWidth = 300; // Largura do card definida no CSS
    let teamCurrentIndex = 0;
    let teamAutoPlayInterval;

    function moveToTeamSlide(index, withTransition = true) {
        if (!withTransition) {
            teamSlide.style.transition = 'none';
        }
        teamSlide.style.transform = `translateX(-${index * cardWidth}px)`;
        if (!withTransition) {
            // Força o navegador a aplicar o estilo antes de reativar a transição
            setTimeout(() => {
                teamSlide.style.transition = 'transform 0.5s ease-in-out';
            }, 50);
        }
    }
    
    function startTeamAutoPlay() {
        teamAutoPlayInterval = setInterval(() => {
            handleNextClick();
        }, 4000); // Muda a cada 3 segundos
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
            }, 500); // Deve ser igual à duração da transição no CSS
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
    
    startTeamAutoPlay(); // Inicia o carrossel


    // --- LÓGICA DO MODAL (POP-UP) ---
    const allTeamCards = document.querySelectorAll('.team-card');
    const modal = document.getElementById('team-modal');
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
        startTeamAutoPlay(); // Reinicia o auto-play da equipe ao fechar
    }

    // Event listeners para os cards da EQUIPE
    allTeamCards.forEach(card => {
        card.addEventListener('click', () => {
            stopTeamAutoPlay(); // Pausa ao abrir o modal
            openModal(card.dataset.imgSrc, card.dataset.name, card.dataset.desc);
        });
    });
    
    // Event listeners para as imagens do carrossel SOBRE NÓS
    aboutImages.forEach(img => {
        img.addEventListener('click', () => {
            openModal(img.dataset.imgSrc, img.dataset.name, img.dataset.desc);
        });
    });


    // Event listener para fechar o modal
    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
});