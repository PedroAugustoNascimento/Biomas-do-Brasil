document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (!form) {
    console.error("Elemento 'loginForm' não encontrado.");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Impede o recarregamento da página

    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");

    if (!emailInput || !senhaInput) {
      alert("Campos de email ou senha não encontrados.");
      return;
    }

    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();

    // Validação dos campos
    if (!email || !senha) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Por favor, insira um email válido.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login realizado com sucesso!");
        localStorage.setItem("user", JSON.stringify(data.user)); // Armazena os dados do usuário
        window.location.href = "../Main/index.html"; // Redireciona para a página principal
      } else {
        alert(data.error || "Erro ao realizar login.");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error.message || error);
      alert("Erro ao conectar ao servidor. Verifique o console para mais detalhes.");
    }
  });
});