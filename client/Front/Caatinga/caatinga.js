// get de conteúdo
document.addEventListener("DOMContentLoaded", () => {
  fetch('http://localhost:4441/biome/Caatinga')
      .then(response => response.json())
      .then(data => {
          // Exibe os resultados no HTML com estrutura de caixas alternadas
          document.querySelector('.content').innerHTML = `
              <div class="info-box left">
                  <h2>${data.name}</h2>
                  <p class="introduction">${data.introduction}</p>
              </div>
              <div class="info-box right">
                  <h3>Características Gerais</h3>
                  <p>${data.generalCharacteristics}</p>
              </div>
              <div class="info-box left">
                  <h3>Problemas Ambientais</h3>
                  <p>${data.environmentalProblems}</p>
              </div>
              <div class="info-box right">
                  <h3>Recursos Naturais</h3>
                  <p>${data.naturalResources}</p>
              </div>
              <div class="info-box left">
                  <h3>Conservação</h3>
                  <p>${data.conservation}</p>
              </div>
          `;
          console.log(data);
      })
      .catch(error => console.error("Erro ao buscar dados:", error));
});

//post de comentários de comentários
document.addEventListener("DOMContentLoaded", () => {
fetch('http://localhost:4441/coments')
    .then(response => response.json())
    .then(data => {
       
        console.log(data)
    })
    .catch(error => console.error("Erro ao buscar dados:", error));
});

// get de posts
document.addEventListener("DOMContentLoaded", () => {
    const commentInput = document.getElementById("commentInput"); // Campo de texto do comentário
    const submitButton = document.getElementById("submitComment"); // Botão de enviar
  
    submitButton.addEventListener("click", async () => {
      const content = commentInput.value.trim(); // Conteúdo do comentário
      const postId = "1f54be2e-a391-4705-b6eb-fc3cf3bfef6b"; // Substitua pelo ID do post atual
      const authorId = "19b9f7d9-9be4-4b83-86b5-98b7a805acc5"; // Substitua pelo ID do autor (pode vir de uma sessão ou contexto)
      const parentCommentId = null; // Use null para comentários principais ou o ID do comentário pai para respostas
  
      if (!content) {
        alert("O conteúdo do comentário é obrigatório!");
        return;
      }
  
      try {
        // Dados a serem enviados no corpo da requisição
        const dataToSend = {
          content,
          postId,
          authorId,
          parentCommentId,
        };
  
        // Requisição POST para criar o comentário
        const response = await fetch("http://localhost:4441/commentcreate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend), // Converte o objeto para JSON
        });
  
        const data = await response.json(); // Resposta do servidor
  
        if (response.ok) {
          console.log("Comentário criado com sucesso:", data);
          alert("Comentário enviado com sucesso!");
          commentInput.value = ""; // Limpa o campo de texto
  
          // Recarrega os posts para exibir o novo comentário
          await loadPosts();
        } else {
          console.error("Erro ao criar comentário:", data.error);
          alert(`Erro ao enviar comentário: ${data.error}`);
        }
      } catch (error) {
        console.error("Erro ao enviar comentário:", error);
        alert("Erro ao enviar comentário. Tente novamente.");
      }
    });
  
    // Carrega os posts ao carregar a página
    loadPosts();
  });
