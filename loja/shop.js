document.addEventListener('DOMContentLoaded', function() {

    // --- 1. CONFIGURAÇÃO DOS PRODUTOS ---
    const products = [
        // PRODUTO 1 - Camiseta (Preços iguais)
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
        
        // --- EXEMPLO DE ARTE (Preços diferentes por tamanho) ---
        { 
            id: 7, 
            name: "Print Ilustração Exclusiva", 
            colors: null, 
            // Lembre-se de colocar a imagem correta aqui
            images: ["../src/produtos/prod10.png", "../src/produtos/prod11.png"],
            desc: "Impressão Fine Art em papel couchê de alta gramatura.",
            variants: [
                { label: "A5 (15x21cm)", price: 15.00 },
                { label: "A4 (21x30cm)", price: 25.00 },
                { label: "A3 (30x42cm)", price: 35.00 }
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
    const closeModalBtn = document.querySelector('.close-product-modal');
    
    let cart = JSON.parse(localStorage.getItem('kardumeCart')) || [];
    let currentModalProduct = null;
    let currentModalImageIndex = 0;
    const cardImageIndices = {}; 
    
    // --- 3. RENDERIZAÇÃO DE PRODUTOS ---
    function renderProducts() {
        if (!productGrid) return;
        
        productGrid.innerHTML = products.map(product => {
            const showArrows = product.images.length > 1 ? '' : 'style="display:none;"';
            
            // GERA O SELETOR DE CORES
            let colorHtml = '';
            if (product.colors && product.colors.length > 0) {
                colorHtml = `
                    <div class="option-group">
                        <label>Cor:</label>
                        <select id="color-select-${product.id}" class="option-select">
                            ${product.colors.map(c => `<option value="${c}">${c}</option>`).join('')}
                        </select>
                    </div>`;
            }

            // GERA O SELETOR DE TAMANHOS/VARIANTES (ALTERADO AQUI)
            let variantHtml = '';
            if (product.variants && product.variants.length > 0) {
                variantHtml = `
                    <div class="option-group">
                        <label>Tamanho/Modelo:</label>
                        <select id="variant-select-${product.id}" class="option-select" onchange="updatePriceDisplay(${product.id}, this.value)">
                            ${product.variants.map((v, index) => {
                                // REMOVI A PARTE QUE MOSTRAVA (+ R$ XX,XX). AGORA MOSTRA SÓ O LABEL.
                                return `<option value="${index}">${v.label}</option>`;
                            }).join('')}
                        </select>
                    </div>`;
            }

            return `
            <div class="product-card" id="product-${product.id}">
                <div class="product-image-container">
                    <img src="${product.images[0]}" alt="${product.name}" class="product-main-img" onclick="openModal(${product.id})">
                    
                    <button class="card-nav-btn prev" ${showArrows} onclick="changeCardImage(${product.id}, 'prev')">&#10094;</button>
                    <button class="card-nav-btn next" ${showArrows} onclick="changeCardImage(${product.id}, 'next')">&#10095;</button>
                </div>
                
                <div class="product-info">
                    <h4 onclick="openModal(${product.id})">${product.name}</h4>
                    
                    <p class="price" id="price-display-${product.id}">R$ ${product.variants[0].price.toFixed(2).replace('.', ',')}</p>
                    
                    <div class="product-options">
                        ${colorHtml}
                        ${variantHtml}
                    </div>

                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        `}).join('');
    }

    // --- 4. FUNÇÃO QUE ATUALIZA O PREÇO NA TELA ---
    window.updatePriceDisplay = function(productId, variantIndex) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        const selectedVariant = product.variants[variantIndex];
        const priceElement = document.getElementById(`price-display-${productId}`);
        
        if (priceElement && selectedVariant) {
            // Atualiza o texto do preço principal com o preço do tamanho escolhido
            priceElement.innerText = `R$ ${selectedVariant.price.toFixed(2).replace('.', ',')}`;
        }
    }

    // --- 5. LÓGICA DO CARROSSEL ---
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

    // --- 6. ADICIONAR AO CARRINHO ---
    window.addToCart = function(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const colorSelect = document.getElementById(`color-select-${productId}`);
        const selectedColor = colorSelect ? colorSelect.value : null;

        const variantSelect = document.getElementById(`variant-select-${productId}`);
        const variantIndex = variantSelect ? variantSelect.value : 0;
        const selectedVariant = product.variants[variantIndex];

        let finalName = product.name;
        let details = "";
        
        if (selectedColor) details += `${selectedColor}`;
        if (selectedColor && selectedVariant) details += " / ";
        if (selectedVariant) details += `${selectedVariant.label}`;

        const uniqueId = `${product.id}-${selectedColor || 'sc'}-${selectedVariant.label}`;

        const existingItem = cart.find(item => item.uniqueId === uniqueId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ 
                uniqueId: uniqueId,
                id: product.id, 
                name: finalName,
                details: details,
                price: selectedVariant.price,
                quantity: 1 
            });
        }
        renderCart();
        
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

    // --- 7. REMOVER DO CARRINHO ---
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

    // --- 8. MODAL ---
    window.openModal = function(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        currentModalProduct = product;
        currentModalImageIndex = 0; 
        
        modalImg.src = product.images[0];
        modalTitle.innerText = product.name;
        modalDesc.innerText = product.desc;
        // Mostra "A partir de"
        modalPrice.innerText = `A partir de R$ ${product.variants[0].price.toFixed(2).replace('.', ',')}`;
        
        const modalArrows = document.querySelectorAll('.modal-nav-btn');
        modalArrows.forEach(btn => btn.style.display = product.images.length > 1 ? 'block' : 'none');
        
        productModal.style.display = 'flex';
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
            document.body.style.overflow = 'auto';
        });
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === productModal) {
            productModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // --- 9. FINALIZAR PEDIDO ---
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