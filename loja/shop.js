document.addEventListener('DOMContentLoaded', function() {

    // --- 1. CONFIGURAÇÃO DOS PRODUTOS ---
    const products = [
        { 
            id: 1, 
            name: "Camiseta KARDUME - Recostruir", 
            price: 75.00, 
            images: [
                "../src/produtos/prod1.png", 
                "../src/produtos/prod2.png" 
            ],
            size: "P, M, G, GG",
            desc: "Camiseta 100% algodão com estampa exclusiva. Conforto e resistência."
        },
        { 
            id: 2, 
            name: "Camiseta KARDUME - Linha Xilo", 
            price: 80.00, 
            images: [
                "../src/produtos/prod3.png", 
                "../src/produtos/prod4.png" 
            ],
            size: "P, M, G, GG",
            desc: "Camiseta 100% algodão com estampa em xilogravura exclusiva. Conforto e resistência."
        },
        { 
            id: 3, 
            name: "Camiseta KARDUME - Linha Xilo", 
            price: 75.00, 
            images: [
                "../src/produtos/prod5.png", 
                "../src/produtos/prod6.png",
                "../src/produtos/prod7.png"
            ],
            size: "P, M, G, GG",
            desc: "Camiseta 100% algodão com estampa em xilogravura exclusiva. Conforto e resistência."
        },
        { 
            id: 4, 
            name: "Camiseta KARDUME - Linha Xilo", 
            price: 75.00, 
            images: [
                "../src/produtos/prod8.png" 
            ],
            size: "P, M, G, GG",
            desc: "Camiseta 100% algodão com estampa em xilogravura exclusiva. Conforto e resistência."
        },{ 
            id: 5, 
            name: "Camiseta KARDUME - Linha Xilo", 
            price: 75.00, 
            images: [
                "../src/produtos/prod9.png", 
                "../src/produtos/prod10.png" 
            ],
            size: "P, M, G, GG",
            desc: "Camiseta 100% algodão com estampa em xilogravura exclusiva. Conforto e resistência."
        },{ 
            id: 6, 
            name: "Camiseta KARDUME - Linha Xilo", 
            price: 75.00, 
            images: [
                "../src/produtos/prod10.png", 
                "../src/produtos/prod11.png" 
            ],
            size: "P, M, G, GG",
            desc: "Camiseta 100% algodão com estampa em xilogravura exclusiva. Conforto e resistência."
        },
        
    ];

    // --- 2. VARIÁVEIS GLOBAIS ---
    const productGrid = document.getElementById('product-grid');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSubtotalElement = document.getElementById('cart-subtotal');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Variáveis do Modal
    const productModal = document.getElementById('product-modal');
    const modalImg = document.getElementById('product-modal-img');
    const modalTitle = document.getElementById('product-modal-title');
    const modalDesc = document.getElementById('product-modal-desc');
    const modalPrice = document.getElementById('product-modal-price');
    const closeModalBtn = document.querySelector('.close-product-modal');
    
    // Carrinho e Estado
    let cart = JSON.parse(localStorage.getItem('kardumeCart')) || [];
    let currentModalProduct = null;
    let currentModalImageIndex = 0;
    const cardImageIndices = {}; 
    
    // --- 3. RENDERIZAÇÃO DE PRODUTOS ---
    function renderProducts() {
        if (!productGrid) return;
        
        productGrid.innerHTML = products.map(product => {
            const showArrows = product.images.length > 1 ? '' : 'style="display:none;"';
            
            return `
            <div class="product-card" id="product-${product.id}">
                <div class="product-image-container">
                    <img src="${product.images[0]}" alt="${product.name}" class="product-main-img" onclick="openModal(${product.id})">
                    
                    <button class="card-nav-btn prev" ${showArrows} onclick="changeCardImage(${product.id}, 'prev')">&#10094;</button>
                    <button class="card-nav-btn next" ${showArrows} onclick="changeCardImage(${product.id}, 'next')">&#10095;</button>
                </div>
                
                <div class="product-info">
                    <h4 onclick="openModal(${product.id})">${product.name}</h4>
                    <p>Tamanhos: ${product.size}</p>
                    <p class="price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        `}).join('');
    }

    // --- 4. LÓGICA DO CARROSSEL NO CARD ---
    window.changeCardImage = function(productId, direction) {
        const product = products.find(p => p.id === productId);
        if (!product || product.images.length <= 1) return;

        if (cardImageIndices[productId] === undefined) cardImageIndices[productId] = 0;

        if (direction === 'next') {
            cardImageIndices[productId] = (cardImageIndices[productId] + 1) % product.images.length;
        } else {
            cardImageIndices[productId] = (cardImageIndices[productId] - 1 + product.images.length) % product.images.length;
        }

        const imgElement = document.querySelector(`#product-${productId} .product-main-img`);
        if (imgElement) imgElement.src = product.images[cardImageIndices[productId]];
    };

    // --- 5. LÓGICA DO MODAL DE ZOOM ---
    window.openModal = function(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        currentModalProduct = product;
        currentModalImageIndex = 0; 

        // Preenche modal
        modalImg.src = product.images[0];
        modalTitle.innerText = product.name;
        modalDesc.innerText = product.desc;
        modalPrice.innerText = `R$ ${product.price.toFixed(2).replace('.', ',')}`;

        // Controla exibição das setas do modal
        const modalArrows = document.querySelectorAll('.modal-nav-btn');
        modalArrows.forEach(btn => btn.style.display = product.images.length > 1 ? 'block' : 'none');

        productModal.style.display = 'flex';
        // Bloqueia rolagem do fundo
        document.body.style.overflow = 'hidden';
    };

    window.changeModalImage = function(direction) {
        if (!currentModalProduct || currentModalProduct.images.length <= 1) return;

        if (direction === 'next') {
            currentModalImageIndex = (currentModalImageIndex + 1) % currentModalProduct.images.length;
        } else {
            currentModalImageIndex = (currentModalImageIndex - 1 + currentModalProduct.images.length) % currentModalProduct.images.length;
        }
        modalImg.src = currentModalProduct.images[currentModalImageIndex];
    };

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            productModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Libera rolagem
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === productModal) {
            productModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // --- 6. CARRINHO E CHECKOUT ---
    window.addToCart = function(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            const nameWithSize = `${product.name} (Tam: ${product.size})`;
            cart.push({ 
                id: product.id, 
                name: nameWithSize, 
                price: product.price, 
                quantity: 1 
            });
        }
        renderCart();
        
        // Efeito visual no botão
        const btn = document.querySelector(`#product-${productId} .add-to-cart-btn`);
        if(btn) {
            const originalText = btn.innerText;
            btn.innerText = "Adicionado!";
            btn.style.backgroundColor = "#28a745";
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = ""; 
            }, 1000);
        }
    }

    window.removeFromCart = function(id) {
        const itemIndex = cart.findIndex(item => item.id === id);
        if (itemIndex > -1) {
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity -= 1;
            } else {
                cart.splice(itemIndex, 1);
            }
        }
        renderCart();
    }

    function renderCart() {
        if (!cartItemsContainer) return;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-empty-message">O carrinho está vazio.</p>';
            checkoutBtn.disabled = true;
            cartSubtotalElement.textContent = 'R$ 0,00';
            localStorage.removeItem('kardumeCart');
            return;
        }

        checkoutBtn.disabled = false;
        
        const cartHtml = cart.map(item => `
            <div class="cart-item">
                <div class="item-info">
                    <span class="item-name">${item.name}</span>
                    <br>
                    <span>${item.quantity}x @ R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">&times;</button>
            </div>
        `).join('');
        
        cartItemsContainer.innerHTML = cartHtml;
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        cartSubtotalElement.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        localStorage.setItem('kardumeCart', JSON.stringify(cart));
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', finalizeOrder);
    }
    
    function finalizeOrder() {
        if (cart.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }
        const meuNumero = "5581984089550";
        let resumo = "*PEDIDO LOJA VIRTUAL KARDUME*\n\n";
        let total = 0;
        cart.forEach(item => {
            resumo += `*${item.quantity}x* ${item.name} (R$ ${item.price.toFixed(2).replace('.', ',')})\n`;
            total += item.price * item.quantity;
        });
        resumo += "\n---\n";
        resumo += `*SUBTOTAL DO PEDIDO: R$ ${total.toFixed(2).replace('.', ',')}*\n`;
        resumo += "Frete e informações de pagamento a combinar.\n";
        resumo += "---\n\n";
        resumo += "Por favor, informe seu NOME COMPLETO e ENDEREÇO para combinarmos o envio:";
        
        const linkWhatsApp = `https://wa.me/${meuNumero}?text=${encodeURIComponent(resumo)}`;
        window.open(linkWhatsApp, '_blank');
    }

    // Inicialização
    renderProducts();
    renderCart();
});