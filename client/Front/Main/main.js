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
    });
});

