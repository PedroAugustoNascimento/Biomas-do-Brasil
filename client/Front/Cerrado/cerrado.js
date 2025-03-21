// get de conteúdo
document.addEventListener("DOMContentLoaded", () => {
  fetch('http://localhost:4441/biome/Cerrado')
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
  
  //get de comentários
  document.addEventListener("DOMContentLoaded", () => {
  fetch('http://localhost:4441/src/routes/CommentRoutes')
      .then(response => response.json())
      .then(data => {
          document.querySelector('.comments').innerHTML = `<p>${data.conteudo}</p>`;
      })
      .catch(error => console.error("Erro ao buscar dados:", error));
  });
  
  // get de posts
  document.addEventListener("DOMContentLoaded", async () => {
    const postsContainer = document.querySelector(".posts");
  
    try {
      const biomeId = "45dff285-ffc3-4e89-b8b6-34141eb5aeef"; // Exemplo de biomeId
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
  