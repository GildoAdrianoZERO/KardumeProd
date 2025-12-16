document.addEventListener('DOMContentLoaded', function() {

    // --- 1. CONFIGURAÇÃO DOS PRODUTOS ---
    const products = [
        // PRODUTO 1 - Camiseta
        { 
            id: 1, 
            name: "Camiseta KARDUME - Recostruir", 
            colors: ["Preta", "Branca"], 
            images: ["../src/produtos/prod1.png", "../src/produtos/prod2.png"],
            desc: "Camiseta 100% algodão com estampa exclusiva. Conforto e resistência.",
            variants: [
                { label: "P", price: 75.00 },
                { label: "M", price: 75.00 },
                { label: "G", price: 75.00 },
                { label: "GG", price: 75.00 }
            ]
        },
        // PRODUTO 2
        { 
            id: 2, 
            name: "Camiseta KARDUME - Linha Xilo (Mod 2)", 
            colors: ["Preta", "Cinza Mescla"], 
            images: ["../src/produtos/prod3.png", "../src/produtos/prod4.png"],
            desc: "Camiseta 100% algodão com estampa em xilogravura exclusiva.",
            variants: [
                { label: "P", price: 80.00 },
                { label: "M", price: 80.00 },
                { label: "G", price: 80.00 },
                { label: "GG", price: 80.00 }
            ]
        },
        // PRODUTO 3
        { 
            id: 3, 
            name: "Camiseta KARDUME - Linha Xilo (Mod 3)", 
            colors: ["Preta"], 
            images: ["../src/produtos/prod5.png", "../src/produtos/prod6.png", "../src/produtos/prod7.png"],
            desc: "Camiseta 100% algodão com estampa em xilogravura exclusiva.",
            variants: [
                { label: "P", price: 75.00 },
                { label: "M", price: 75.00 },
                { label: "G", price: 75.00 },
                { label: "GG", price: 75.00 }
            ]
        },
        // PRODUTO 4
        { 
            id: 4, 
            name: "Camiseta KARDUME - Linha Xilo (Mod 4)", 
            colors: ["Preta", "Branca"], 
            images: ["../src/produtos/prod8.png"],
            desc: "Camiseta 100% algodão com estampa em xilogravura exclusiva.",
            variants: [
                { label: "P", price: 75.00 },
                { label: "M", price: 75.00 },
                { label: "G", price: 75.00 },
                { label: "GG", price: 75.00 }
            ]
        },
        // PRODUTO 5
        { 
            id: 5, 
            name: "Camiseta KARDUME - Linha Xilo (Mod 5)", 
            colors: ["Preta"], 
            images: ["../src/produtos/prod9.png", "../src/produtos/prod10.png"],
            desc: "Camiseta 100% algodão com estampa em xilogravura exclusiva.",
            variants: [
                { label: "P", price: 75.00 },
                { label: "M", price: 75.00 },
                { label: "G", price: 75.00 },
                { label: "GG", price: 75.00 }
            ]
        },
        // PRODUTO 6
        { 
            id: 6, 
            name: "Camiseta KARDUME - Linha Xilo (Mod 6)", 
            colors: ["Preta", "Off-White"], 
            images: ["../src/produtos/prod10.png", "../src/produtos/prod11.png"],
            desc: "Camiseta 100% algodão com estampa em xilogravura exclusiva.",
            variants: [
                { label: "P", price: 75.00 },
                { label: "M", price: 75.00 },
                { label: "G", price: 75.00 },
                { label: "GG", price: 75.00 }
            ]
        },
        
        // --- PRODUTO 7: ARTE (Preços diferentes por tamanho) ---
        { 
            id: 7, 
            name: "Print Ilustração Exclusiva", 
            colors: null, 
            images: ["../src/produtos/prod1.png"], // <--- Use a imagem correta da arte
            desc: "Impressão Fine Art em papel couchê de alta gramatura.",
            variants: [
                { label: "A5 (15x21cm)", price: 15.00 },
                { label: "A4 (21x30cm)", price: 25.00 }, // Preço diferente
                { label: "A3 (30x42cm)", price: 40.00 }  // Preço diferente
            ]
        }
    ];

    // --- 2. VARIÁVEIS GLOBAIS ---
    const productGrid = document.getElementById('product-grid');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSubtotalElement = document.getElementById('cart-subtotal');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Elementos do Modal
    const productModal = document.getElementById('product-modal');
    const modalImg = document.getElementById('product-modal-img');
    const modalTitle = document.getElementById('product-modal-title');
    const modalDesc = document.getElementById('product-modal-desc');
    const modalPrice = document.getElementById('product-modal-price');
    const modalOptionsContainer = document.getElementById('modal-product-options');
    const modalAddBtn = document.getElementById('modal-add-btn');
    const closeModalBtn = document.querySelector('.close-product-modal');
    
    let cart = JSON.parse(localStorage.getItem('kardumeCart')) || [];
    let currentModalProduct = null;
    let currentModalImageIndex = 0;
    const cardImageIndices = {}; 
    
    // --- 3. RENDERIZAÇÃO DE PRODUTOS (VITRINE) ---
    function renderProducts() {
        if (!productGrid) return;
        
        productGrid.innerHTML = products.map(product => {
            const showArrows = product.images.length > 1 ? '' : 'style="display:none;"';
            const displayPrice = product.variants[0].price.toFixed(2).replace('.', ',');

            return `
            <div class="product-card" id="product-${product.id}">
                <div class="product-image-container">
                    <img src="${product.images[0]}" alt="${product.name}" class="product-main-img" onclick="openModal(${product.id})">
                    <button class="card-nav-btn prev" ${showArrows} onclick="changeCardImage(${product.id}, 'prev')">&#10094;</button>
                    <button class="card-nav-btn next" ${showArrows} onclick="changeCardImage(${product.id}, 'next')">&#10095;</button>
                </div>
                <div class="product-info">
                    <h4 onclick="openModal(${product.id})">${product.name}</h4>
                    <p class="price">A partir de R$ ${displayPrice}</p>
                    
                    <button class="add-to-cart-btn" onclick="openModal(${product.id})">
                        Ver Opções / Comprar
                    </button>
                </div>
            </div>
        `}).join('');
    }

    // --- 4. ABRIR MODAL E GERAR OPÇÕES ---
    window.openModal = function(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        currentModalProduct = product;
        currentModalImageIndex = 0; 
        
        // 1. Preenche dados básicos
        modalImg.src = product.images[0];
        modalTitle.innerText = product.name;
        modalDesc.innerText = product.desc;
        modalPrice.innerText = `R$ ${product.variants[0].price.toFixed(2).replace('.', ',')}`;
        
        // 2. Controla setas da imagem
        const modalArrows = document.querySelectorAll('.modal-nav-btn');
        modalArrows.forEach(btn => btn.style.display = product.images.length > 1 ? 'block' : 'none');

        // 3. GERA OS INPUTS DENTRO DO MODAL
        let htmlOptions = '';

        // Seletor de Cor
        if (product.colors && product.colors.length > 0) {
            htmlOptions += `
                <div class="option-group">
                    <label>Cor:</label>
                    <select id="modal-color-select" class="option-select">
                        ${product.colors.map(c => `<option value="${c}">${c}</option>`).join('')}
                    </select>
                </div>`;
        } else {
            htmlOptions += `<input type="hidden" id="modal-color-select" value="">`;
        }

        // Seletor de Tamanho (Com atualização de preço)
        if (product.variants && product.variants.length > 0) {
            htmlOptions += `
                <div class="option-group">
                    <label>Tamanho/Modelo:</label>
                    <select id="modal-variant-select" class="option-select" onchange="updateModalPrice()">
                        ${product.variants.map((v, index) => `<option value="${index}">${v.label}</option>`).join('')}
                    </select>
                </div>`;
        }

        modalOptionsContainer.innerHTML = htmlOptions;

        // 4. Configura o botão "Adicionar" do Modal
        modalAddBtn.onclick = function() {
            addToCartFromModal();
        };

        productModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    // --- 5. ATUALIZAR PREÇO NO MODAL (QUANDO MUDA TAMANHO) ---
    window.updateModalPrice = function() {
        if (!currentModalProduct) return;
        const select = document.getElementById('modal-variant-select');
        const index = select.value;
        const variant = currentModalProduct.variants[index];
        
        // Atualiza o preço grande no topo do modal
        modalPrice.innerText = `R$ ${variant.price.toFixed(2).replace('.', ',')}`;
    }

    // --- 6. ADICIONAR AO CARRINHO (DO MODAL) ---
    window.addToCartFromModal = function() {
        if (!currentModalProduct) return;

        // Pega valores selecionados dentro do modal
        const colorInput = document.getElementById('modal-color-select');
        const selectedColor = colorInput ? colorInput.value : null;

        const variantInput = document.getElementById('modal-variant-select');
        const variantIndex = variantInput ? variantInput.value : 0;
        const selectedVariant = currentModalProduct.variants[variantIndex];

        // Cria item
        let finalName = currentModalProduct.name;
        let details = "";
        if (selectedColor) details += `${selectedColor}`;
        if (selectedColor && selectedVariant) details += " / ";
        if (selectedVariant) details += `${selectedVariant.label}`;

        const uniqueId = `${currentModalProduct.id}-${selectedColor || 'sc'}-${selectedVariant.label}`;

        // Adiciona ao array
        const existingItem = cart.find(item => item.uniqueId === uniqueId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ 
                uniqueId: uniqueId,
                id: currentModalProduct.id, 
                name: finalName,
                details: details,
                price: selectedVariant.price, // Preço correto do tamanho escolhido
                quantity: 1 
            });
        }

        // Renderiza Carrinho e Fecha Modal
        renderCart();
        closeModal();
    };

    function closeModal() {
        productModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // --- 7. CARROSSEL DE IMAGENS ---
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
    
    window.changeModalImage = function(direction) {
        if (!currentModalProduct || currentModalProduct.images.length <= 1) return;
        if (direction === 'next') {
            currentModalImageIndex = (currentModalImageIndex + 1) % currentModalProduct.images.length;
        } else {
            currentModalImageIndex = (currentModalImageIndex - 1 + currentModalProduct.images.length) % currentModalProduct.images.length;
        }
        modalImg.src = currentModalProduct.images[currentModalImageIndex];
    };

    // --- 8. EVENTOS DE FECHAMENTO ---
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === productModal) closeModal();
    });

    // --- 9. CARRINHO (REMOVER/RENDERIZAR/FINALIZAR) ---
    window.removeFromCart = function(uniqueId) {
        const itemIndex = cart.findIndex(item => item.uniqueId === uniqueId);
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
                    <span class="item-details">${item.details}</span>
                    <br>
                    <span>${item.quantity}x @ R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                </div>
                <button class="remove-btn" onclick="removeFromCart('${item.uniqueId}')">&times;</button>
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
        if (cart.length === 0) return;
        const meuNumero = "5581984089550";
        let resumo = "*PEDIDO LOJA VIRTUAL KARDUME*\n\n";
        let total = 0;
        cart.forEach(item => {
            resumo += `*${item.quantity}x* ${item.name}`;
            if(item.details) resumo += ` (${item.details})`;
            resumo += ` - R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}\n`;
            total += item.price * item.quantity;
        });
        resumo += "\n---\n";
        resumo += `*TOTAL DO PEDIDO: R$ ${total.toFixed(2).replace('.', ',')}*\n`;
        resumo += "Frete e informações de pagamento a combinar.\n";
        resumo += "---\n\n";
        resumo += "Por favor, informe seu NOME COMPLETO e ENDEREÇO para combinarmos o envio:";
        
        const linkWhatsApp = `https://wa.me/${meuNumero}?text=${encodeURIComponent(resumo)}`;
        window.open(linkWhatsApp, '_blank');
    }

    renderProducts();
    renderCart();
});