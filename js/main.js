// 1. Модальное окно
const orderDialog = document.getElementById('order-dialog');
const orderButtons = document.querySelectorAll('.product-card__button');
const closeDialogButton = document.getElementById('close-order-dialog');
const selectedProductInput = document.getElementById('selected-product');

if (orderButtons.length > 0) {
  orderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (selectedProductInput) selectedProductInput.value = button.dataset.product;
      if (orderDialog) orderDialog.showModal();
    });
  });
}

if (closeDialogButton && orderDialog) {
  closeDialogButton.addEventListener('click', () => orderDialog.close());
}

// 2. Обработка форм
const forms = document.querySelectorAll('form[id^="order-form"]');
forms.forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formElements = Array.from(form.elements);
    
    formElements.forEach((element) => {
      if (element.willValidate) element.removeAttribute('aria-invalid');
    });

    if (!form.checkValidity()) {
      formElements.forEach((element) => {
        if (element.willValidate && !element.checkValidity()) {
          element.setAttribute('aria-invalid', 'true');
        }
      });
      form.reportValidity();
      return;
    }

    let successMessage = document.getElementById('success-message');
    // Показываем сообщение об успешной отправке
    successMessage.hidden = false;

    // Автоматически скрываем через 4 секунды
    clearTimeout(successMessage._hideTimer);
    successMessage._hideTimer = setTimeout(() => {
      successMessage.hidden = true;
    }, 4000);

    form.reset();
    if (orderDialog) orderDialog.close();
  });
});

// 3. Кнопка "Наверх"
const backToTopButton = document.getElementById('back-to-top');
if (backToTopButton) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.add('is-visible');
    } else {
      backToTopButton.classList.remove('is-visible');
    }
  });

  backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// 4. Фильтрация товаров в каталоге
const filtersForm = document.getElementById('filters-form');
if (filtersForm) {
  filtersForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const categories = Array.from(filtersForm.querySelectorAll('input[name="category"]:checked'))
      .map(cb => cb.value);
    const priceFrom = parseFloat(document.getElementById('price-from').value) || 0;
    const priceTo = parseFloat(document.getElementById('price-to').value) || Infinity;
    
    const products = document.querySelectorAll('#products-grid .product-card');
    products.forEach(product => {
      const category = product.dataset.category;
      const price = parseFloat(product.dataset.price);
      
      const categoryMatch = categories.includes('all') || categories.includes(category);
      const priceMatch = price >= priceFrom && price <= priceTo;
      
      product.style.display = (categoryMatch && priceMatch) ? '' : 'none';
    });
  });
}