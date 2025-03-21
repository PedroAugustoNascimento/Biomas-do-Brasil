// get de posts
document.addEventListener("DOMContentLoaded", async () => {
  const postsContainer = document.querySelector(".posts");

  try {
    const biomeId = "c9a0a26f-32dd-43e4-8d13-e3c4d6cf2ecb"; // Exemplo de biomeId
    const response = await fetch(`http://localhost:4441/posts/${biomeId}`);
    const postsData = await response.json();
    console.log(postsData);

    // Verifica se há posts e pega o nome do bioma do primeiro post
    const biomeName = postsData.length > 0 ? postsData[0].biome.name : "Desconhecido";

    // Cria o título da página
    const pageTitle = document.createElement("h1");
    pageTitle.textContent = `Comentários do Bioma: ${biomeName}`;
    pageTitle.style.textAlign = "center"; // Centraliza o título
    pageTitle.style.marginBottom = "20px"; // Adiciona um espaço abaixo do título
    postsContainer.appendChild(pageTitle);

    // Percorre o array e exibe cada post como um comentário
    postsData.forEach(post => {
      const commentDiv = document.createElement("div");
      commentDiv.classList.add("comment");

      const author = document.createElement("p");
      author.classList.add("comment-author");
      author.textContent = post.author.name; // Acesse o nome do autor

      const title = document.createElement("h3");
      title.classList.add("comment-title");
      title.textContent = post.title;

      const content = document.createElement("p");
      content.classList.add("comment-content");
      content.textContent = post.content;

      const biome = document.createElement("p");
      biome.classList.add("comment-biome");
      biome.textContent = `Bioma: ${post.biome.name} (ID: ${post.biome.id})`; // Acesse o nome e ID do bioma

      commentDiv.appendChild(author);
      commentDiv.appendChild(title);
      commentDiv.appendChild(content);
      commentDiv.appendChild(biome);

      postsContainer.appendChild(commentDiv);
    });

  } catch (error) {
    console.error("Erro ao carregar posts:", error);
  }
});

  // get de conteúdo
  document.addEventListener("DOMContentLoaded", () => {
    fetch('http://localhost:4441/biome/Amazônia')
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



  //post de comentários
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
          // Atualize a lista de comentários na página (se necessário)
        } else {
          console.error("Erro ao criar comentário:", data.error);
          alert(`Erro ao enviar comentário: ${data.error}`);
        }
      } catch (error) {
        console.error("Erro ao enviar comentário:", error);
        alert("Erro ao enviar comentário. Tente novamente.");
      }
    });
  });
