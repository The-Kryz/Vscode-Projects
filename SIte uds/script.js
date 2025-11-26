// Carrossel de Serviços
const carousel = document.querySelector('.services-carousel');
const indicators = document.querySelectorAll('.indicator');
const cards = document.querySelectorAll('.service-card');
let currentIndex = 0;
let autoScrollInterval = null;
let isCarouselHovered = false;

function getCardWidth() {
    if (cards.length === 0) return 0;
    const cardStyle = window.getComputedStyle(cards[0]);
    const cardWidth = cards[0].offsetWidth;
    const gap = parseInt(cardStyle.marginRight) || 32; // gap padrão 2rem = 32px
    return cardWidth + gap;
}

function scrollToCard(index) {
    if (carousel && cards.length > 0) {
        // Garante que o índice está dentro do limite
        if (index < 0) index = cards.length - 1;
        if (index >= cards.length) index = 0;
        
        currentIndex = index;
        const targetCard = cards[currentIndex];

        // CÁLCULO MANUAL (Para não pular a página):
        // 1. Pega a posição do card dentro do carrossel
        // 2. Subtrai metade da largura da tela (para centralizar)
        // 3. Adiciona metade da largura do card (ajuste fino)
        const scrollPosition = targetCard.offsetLeft - (carousel.clientWidth / 2) + (targetCard.clientWidth / 2);

        // Aplica o scroll apenas no container do carrossel
        carousel.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });

        updateIndicators(currentIndex);
    }
}

function updateIndicators(index) {
    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
    });
    
    // Atualiza a classe active dos cards
    cards.forEach((card, i) => {
        card.classList.toggle('active', i === index);
    });
}

function nextCard() {
    currentIndex = (currentIndex + 1) % cards.length;
    scrollToCard(currentIndex);
}

function stopAutoScroll() {
    if (autoScrollInterval !== null) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
    }
}

function startAutoScroll() {
    stopAutoScroll(); // Garante que não há duplicação
    autoScrollInterval = setInterval(nextCard, 7000);
}

// Inicializa o auto-scroll
startAutoScroll();

// Pausa ao hover no carrossel
const carouselContainer = document.querySelector('.services-carousel-container');
if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => {
        isCarouselHovered = true;
        stopAutoScroll();
    });
    carouselContainer.addEventListener('mouseleave', () => {
        isCarouselHovered = false;
        startAutoScroll();
    });
}

// Click nos indicadores
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        stopAutoScroll();
        scrollToCard(index);
        startAutoScroll();
    });
});

// Click nas setas de navegação
const arrowLeft = document.getElementById('arrowLeft');
const arrowRight = document.getElementById('arrowRight');

if (arrowLeft) {
    arrowLeft.addEventListener('click', () => {
        stopAutoScroll();
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        scrollToCard(currentIndex);
        startAutoScroll();
    });
}

if (arrowRight) {
    arrowRight.addEventListener('click', () => {
        stopAutoScroll();
        currentIndex = (currentIndex + 1) % cards.length;
        scrollToCard(currentIndex);
        startAutoScroll();
    });
}

cards.forEach((card, index) => {
    card.addEventListener('click', () => {
        stopAutoScroll(); // Para o timer
        scrollToCard(index); // Centraliza e ativa o card clicado
        startAutoScroll(); // Retoma o timer
    });
});

updateIndicators(0);

// Validação e submissão do formulário de contato
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Pega os valores do formulário
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;

        // Validação básica
        if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        // Simula o envio da mensagem
        console.log('Mensagem enviada:', {
            name: name,
            email: email,
            message: message
        });

        // Mostra mensagem de sucesso
        alert(`Obrigado, ${name}! Sua mensagem foi recebida. Entraremos em contato em breve.`);

        // Limpa o formulário
        this.reset();
    });
}

// Animação no scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observa os cards de serviço
document.querySelectorAll('.service-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

// Ativa o link de navegação ativo baseado no scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Log de inicialização
console.log('Site carregado com sucesso!');
