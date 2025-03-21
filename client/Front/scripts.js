const greetingElement = document.getElementById("greeting");

const currentHour = new Date().getHours();

const greetingMessage =
  currentHour >= 5 && currentHour < 12
    ? "Bom dia!"
    : currentHour >= 12 && currentHour < 18
    ? "Boa tarde!"
    : "Boa noite!";

greetingElement.textContent = greetingMessage;

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("menu-btn").addEventListener("click", () => {
        const menu = document.getElementById("dropdown-menu");
        menu.classList.toggle("hidden");
        menu.style.display = menu.style.display === "block" ? "none" : "block";
    });

    const biomas = {
        "biomaAmazonia.html": ["amazonia1.jpg", "amazonia2.jpg", "amazonia3.jpg"],
        "biomaCaatinga.html": ["caatinga1.jpg", "caatinga2.jpg", "caatinga3.jpg"],
        "biomaCerrado.html": ["cerrado1.jpg", "cerrado2.jpg", "cerrado3.jpg"],
        "biomaMatlantica.html": ["matatlantica1.jpg", "matatlantica2.jpg", "matatlantica3.jpg"],
        "biomaPantanal.html": ["pantanal1.jpg", "pantanal2.jpg", "pantanal3.jpg"],
        "biomaPampa.html": ["pampa1.jpg", "pampa2.jpg", "pampa3.jpg"]
    };

    const currentPage = window.location.pathname.split("/").pop();
    const carrosselContainer = document.getElementById("carrossel");

    if (biomas[currentPage] && carrosselContainer) {
        biomas[currentPage].forEach(img => {
            const imgElement = document.createElement("img");
            imgElement.src = `../img/${img}`;
            imgElement.alt = `Imagem do bioma ${currentPage.replace(".html", "")}`;
            carrosselContainer.appendChild(imgElement);
        });
    }

    const images = document.querySelectorAll('.carrossel img');
    const prevBtn = document.querySelector('.carrossel-btn.prev');
    const nextBtn = document.querySelector('.carrossel-btn.next');
    let currentIndex = 0;

    function showImage(index) {
        images.forEach(img => img.classList.remove('active'));
        images[index].classList.add('active');
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', nextImage);
        prevBtn.addEventListener('click', prevImage);
        showImage(currentIndex);
    }
});