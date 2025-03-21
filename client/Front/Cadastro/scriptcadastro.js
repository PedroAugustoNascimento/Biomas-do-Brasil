document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registrationForm");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Impede o recarregamento da página

        const name = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("senha").value;

        // Validação no frontend antes de enviar os dados
        if (!nome || !email || !senha) {
            alert("Todos os campos são obrigatórios.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/usercreate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                alert("Usuário cadastrado com sucesso!");
            } else {
                const errorData = await response.json();
                alert(errorData.error || "Erro ao cadastrar usuário.");
            }
        } catch (error) {
            alert("Erro de conexão: " + error.message);
        }
    });
});  