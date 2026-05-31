// ១. បញ្ជីទិន្នន័យផលិតផល (បងអាចថែមថយនៅទីនេះ)
const products = [
    { id: 1, name: "Semi Oversized Summer Rugby T-shirt_Black", category: "men-shirt", price: 15, img: "/PictureClothes/អាវ.jpg" },
    { id: 2, name: "H&M baggy light-wash jeans", category: "men-pant", price: 15, img: "/PictureClothes/ខោ.jpg" },
    { id: 3, name: "Fitted shirt", category: "women-shirt", price: 10, img: "/PictureClothes/អាវមនុស្សស្រី.jpg" },
    { id: 4, name: "Women's Loose Fit Washed Blue Wide Leg Denim Pants", category: "women-pant", price: 12, img: "/PictureClothes/ខោស្រី.jpg" },
    { id: 5, name: "Lobette Vegan Jacket", category: "men-shirt", price: 30, img: "/PictureClothes/អាវធំ.jpg" },
    { id: 6, name: "ខោកាប៊ូយ - Free Size", category: "men-pant", price: 15, img: "/PictureClothes/ខោ២.jpg" }
];

// ២. ការកំណត់ Telegram Bot (បងត្រូវប្តូរ Token និង ID របស់បង)
const telegramBotToken = '8814414193:AAE4eQQsxoHjQCWGK-6xcDMVl5GiNJW9few'; 
const telegramChatId = '-5235463983';

let cart = [];

// ៣. មុខងារបង្ហាញផលិតផលលើអេក្រង់
function renderProducts(data) {
    const displayArea = document.getElementById('product-display');
    if(data.length === 0) {
        displayArea.innerHTML = "<p style='text-align:center; grid-column:1/-1; padding:50px;'>រកមិនឃើញទំនិញដែលអ្នកចង់រកទេ!</p>";
        return;
    }
    displayArea.innerHTML = data.map(item => `
        <div class="card">
            <img src="${item.img}" alt="${item.name}">
            <div class="card-info">
                <h3>${item.name}</h3>
                <p class="price">$${item.price.toFixed(2)}</p>
            </div>
            <button class="buy-btn" onclick="addToCart(${item.id})">
                <i class="fas fa-cart-plus"></i> ដាក់ក្នុងកន្ត្រក
            </button>
        </div>
    `).join('');
}

// ៤. មុខងារស្វែងរកទំនិញ (Search)
function searchProduct() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(term));
    renderProducts(filtered);
}

// ៥. មុខងារបែងចែកប្រភេទ (Filter Men/Women/Shirt/Pant)
function filterProduct(category) {
    // ប្តូរ Class Active លើ Button
    const btns = document.querySelectorAll('.btn');
    btns.forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    
    if (category === 'all') {
        renderProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        renderProducts(filtered);
    }
}

// ៦. មុខងារគ្រប់គ្រងកន្ត្រកទំនិញ (Cart System)
function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateCartUI();
    // បើក Sidebar កន្ត្រកអូតូម៉ាទិកពេលរើសទំនិញរួច
    document.getElementById('cart-sidebar').classList.add('open');
}

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const cartItemsArea = document.getElementById('cart-items');
    let total = 0;

    cartItemsArea.innerHTML = cart.map((item, index) => {
        total += item.price;
        return `
            <div class="cart-item">
                <div>
                    <div style="font-weight:600;">${item.name}</div>
                    <div style="color:#666; font-size:14px;">$${item.price.toFixed(2)}</div>
                </div>
                <i class="fas fa-trash-alt" onclick="removeFromCart(${index})" style="color:#ff4757; cursor:pointer;"></i>
            </div>
        `;
    }).join('');

    document.getElementById('total-price').innerText = total.toFixed(2);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('open');
}

// ៧. មុខងារ Checkout & Payment Modal
function showCheckout() {
    if(cart.length === 0) return alert("កន្ត្រកទំនិញរបស់អ្នកនៅទំនេរឡើយ!");
    document.getElementById('checkout-modal').style.display = 'block';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

function goToPayment() {
    const name = document.getElementById('cust-name').value;
    const phone = document.getElementById('cust-phone').value;
    const address = document.getElementById('cust-address').value;

    if(!name || !phone || !address) return alert("សូមបំពេញព័ត៌មានឱ្យបានគ្រប់គ្រាន់!");
    
    document.getElementById('pay-amount').innerText = "$" + document.getElementById('total-price').innerText;
    closeModal('checkout-modal');
    document.getElementById('payment-modal').style.display = 'block';
}

// ៨. មុខងារផ្ញើសារទៅ Telegram និងបញ្ចប់ការកម្មង់
async function finishOrder() {
    const name = document.getElementById('cust-name').value;
    const phone = document.getElementById('cust-phone').value;
    const address = document.getElementById('cust-address').value;
    const total = document.getElementById('total-price').innerText;
    const itemsList = cart.map(item => `- ${item.name} ($${item.price})`).join('\n');

    const message = `
🛍️ **មានការកម្មង់ថ្មី!**
━━━━━━━━━━━━━━━━━━
👤 **អតិថិជន:** ${name}
📞 **លេខទូរស័ព្ទ:** ${phone}
📍 **អាសយដ្ឋាន:** ${address}
━━━━━━━━━━━━━━━━━━
📦 **បញ្ជីទំនិញ:**
${itemsList}

💰 **សរុបទឹកប្រាក់:** $${total}
━━━━━━━━━━━━━━━━━━
✅ *សូមត្រួតពិនិត្យការបង់ប្រាក់ក្នុង ABA មុននឹងដឹកជញ្ជូន!*
    `;

    // បង្ហាញ Loading លើប៊ូតុង
    const btn = document.querySelector('.confirm-btn');
    const originalText = btn.innerText;
    btn.innerText = "កំពុងផ្ញើទិន្នន័យ...";
    btn.disabled = true;

    try {
        const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: telegramChatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        if (response.ok) {
            alert("អរគុណសម្រាប់ការកម្មង់! ព័ត៌មានរបស់អ្នកត្រូវបានផ្ញើទៅកាន់ក្រុមការងារយើងរួចរាល់។");
            cart = [];
            updateCartUI();
            closeModal('payment-modal');
            toggleCart();
            // Clear Form
            document.getElementById('cust-name').value = '';
            document.getElementById('cust-phone').value = '';
            document.getElementById('cust-address').value = '';
        } else {
            alert("មានបញ្ហាក្នុងការផ្ញើសារ! សូមព្យាយាមម្តងទៀត។");
        }
    } catch (error) {
        alert("មិនអាចភ្ជាប់ទៅកាន់សេវាកម្មបានទេ!");
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

// បង្ហាញទំនិញទាំងអស់ពេលបើកដំបូង
window.onload = () => {
    renderProducts(products);
};
// ១. បង្កើតមុខងារគណនានាឡិកា
function startPromotionTimer(durationInSeconds) {
    let timer = durationInSeconds;
    let hours, minutes, seconds;

    // ឱ្យវារត់រៀងរាល់ ១ វិនាទី (1000ms)
    const countdown = setInterval(function () {
        // គណនា ម៉ោង នាទី និង វិនាទី
        hours = parseInt(timer / 3600, 10);
        minutes = parseInt((timer % 3600) / 60, 10);
        seconds = parseInt(timer % 60, 10);

        // បន្ថែមលេខ ០ នៅខាងមុខ បើលេខនោះតូចជាង ១០ (ឧទាហរណ៍៖ 09:05:01)
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        // បង្ហាញទៅកាន់ HTML ត្រង់ ID "timer"
        const timerDisplay = document.getElementById('timer');
        if (timerDisplay) {
            timerDisplay.textContent = hours + ":" + minutes + ":" + seconds;
        }

        // បើថយក្រោយដល់ ០ ឱ្យវាឈប់
        if (--timer < 0) {
            clearInterval(countdown);
            if (timerDisplay) {
                timerDisplay.textContent = "Promotion បានបញ្ចប់!";
            }
        }
    }, 1000);
}

// ២. ហៅឱ្យវាដើរនៅពេល Website បើកមក (Window Load)
// ចំណាំ៖ បើបងមាន window.onload ចាស់ បងគ្រាន់តែចម្លងផ្នែកខាងក្នុងទៅដាក់បន្ថែមបាន
window.addEventListener('load', function () {
    // កំណត់រយៈពេល Promotion (ឧទាហរណ៍៖ ២៤ ម៉ោង = 24 * 60 * 60 វិនាទី)
    const displayTime = 12 * 60 * 60; 
    startPromotionTimer(displayTime);
});
let wishlist = [];

// កែសម្រួល renderProducts ឱ្យមាន Wishlist Button
function renderProducts(data) {
    const displayArea = document.getElementById('product-display');
    displayArea.innerHTML = data.map(item => {
        const isLiked = wishlist.includes(item.id) ? 'active' : '';
        return `
        <div class="card">
            <button class="wishlist-btn ${isLiked}" onclick="toggleWishlist(${item.id})">
                <i class="fas fa-heart"></i>
            </button>
            <img src="${item.img}" alt="${item.name}">
            <div class="card-info">
                <h3>${item.name}</h3>
                <p class="price">$${item.price.toFixed(2)}</p>
            </div>
            <button class="buy-btn" onclick="addToCart(${item.id})">
                <i class="fas fa-cart-plus"></i> ដាក់ក្នុងកន្ត្រក
            </button>
        </div>
    `}).join('');
}

// មុខងារ Like/Unlike
function toggleWishlist(id) {
    const index = wishlist.indexOf(id);
    if (index === -1) {
        wishlist.push(id);
    } else {
        wishlist.splice(index, 1);
    }
    renderProducts(products); // បង្ហាញឡើងវិញដើម្បី Update ពណ៌បេះដូង
}
