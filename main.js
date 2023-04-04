const categoryList = document.querySelector('.category-list');
const productList = document.querySelector('.product-list');
const openBtn = document.getElementById('sepet');
const closeBtn = document.querySelector('#close-btn');
const modal = document.getElementById('modal-wrapper');
const modalList = document.querySelector('.modal-list');
const toplamInfo = document.querySelector('#toplam');

// Verilerin ne zaman çekilceğini belirttik
document.addEventListener('DOMContentLoaded', () => {
  // callback > içerisinde farklı fonksiyonları çağıran fonk.
  fetchCategories();
  fetchProducts();
});

// Kategorileri çekme işlemi
const fetchCategories = () => {
  fetch('https://api.escuelajs.co/api/v1/categories')
    .then((res) => res.json())
    .then((data) =>
      // data dizindeki her bir eleman için ekrana kategori basma
      data.slice(0,4).forEach((category) => {
        // Her obje için div oluşturma
        const categoryDiv = document.createElement('div');
        // Dive class ekleme
        categoryDiv.classList.add('category');
        // dive içerik ekleme(resim / p)
        categoryDiv.innerHTML = `
            <img src="${category.image}" />
            <p>${category.name}</p>
        `;
        // oluşan elamanı listeye yönlendirme
        categoryList.appendChild(categoryDiv);
      })
    )
    .catch((err) => console.log(err));
};

// Ürünleri Çekme
const fetchProducts = () => {
  fetch('https://api.escuelajs.co/api/v1/products')
    .then((res) => res.json())
    .then((data) =>
      data.slice(1, 21).forEach((product) => {
        // her bir obje için div oluşturma
        const productDiv = document.createElement('div');
        // dive class ekleme
        productDiv.classList.add('card');
        // divin içeriğini belirliyelim
        productDiv.innerHTML = `
            <img
              src="${product.images[0]}"
            />
            <p>${product.title}</p>
            <p>${product.category.name}</p>
            <div class="card-footer">
              <span>${product.price} $</span>
              <button onclick='sepeteEkle({id:${product.id}, name:"${product.title}", price:${product.price}, img:"${product.images[0]}",amount:1})'>Sepete Ekle</button>
            </div>        
        `;
        // oluşan elemanı htmle aktarma
        productList.appendChild(productDiv);
      })
    );
};

// Sepete ekleme işlemi
let sepet = [];
let toplamFiyat = 0;

function listSepet() {
  sepet.forEach((eleman) => {
    const sepetItem = document.createElement('div');
    sepetItem.classList.add('item');
    //    İTEMİN İÇEREĞİ
    sepetItem.innerHTML = `
              <img
                src="${eleman.img}"
              />
              <h2 class="title">${eleman.name}</h2>
              <h2 class="price">${eleman.price} $</h2>  
              <div class="amount"><p>${eleman.amount}</p></div>      
        `;
    modalList.appendChild(sepetItem);
    toplamFiyat += eleman.price * eleman.amount;
  });
}

// Modal açma ve kapama
const toggleModal = () => {
  modal.classList.toggle('active');
};

openBtn.addEventListener('click', () => {
  // sepeti açma
  toggleModal();

  // sepetin içerine eleman ekleme
  listSepet();

  // toplamı güncelleme
  toplamInfo.innerText = toplamFiyat;
});

closeBtn.addEventListener('click', () => {
  // sepeti kaptma
  toggleModal();

  // listeyi temizleme
  modalList.innerHTML = ' ';
  // toplam fiyatı sıfırlama
  toplamFiyat = 0;
});

function sepeteEkle(param) {
  // sepette bu elemanın olup olmadığına bakma
  const foundItem = sepet.find((eleman) => eleman.id === param.id);

  if (foundItem) {
    //  eğer eleman var ise miktarını + 1
    foundItem.amount += 1;
  } else {
    //  eğer eleman yok ise ekleme
    sepet.push(param);
  }
}