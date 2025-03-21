document.addEventListener("DOMContentLoaded", async () => {
  const biomeId = "ID_DO_BIOMA_AQUI"; // Substitua pelo ID real do bioma
  const biomeContainer = document.querySelector(".biome-info");
  const postsContainer = document.getElementById("posts-container");

  // Função para buscar dados da API
  async function fetchBiomeData() {
      try {
          const response = await fetch(`/localhost:8080/biome/${biomeId}`);
          const biome = await response.json();

          // Preenche a seção de informações do bioma
          biomeContainer.querySelector(".description").innerHTML += `<p>${biome.introduction}</p>`;
          biomeContainer.querySelector(".location").innerHTML += `<p>${biome.generalCharacteristics}</p>`;
          biomeContainer.querySelector(".climate").innerHTML += `<p>${biome.naturalResources}</p>`;
          biomeContainer.querySelector(".fauna").innerHTML += `<p>${biome.environmentalProblems}</p>`;
          biomeContainer.querySelector(".flora").innerHTML += `<p>${biome.conservation}</p>`;

          // Carregar posts
          fetchPosts(biome.posts);
      } catch (error) {
          console.error("Erro ao buscar dados do bioma:", error);
      }
  }

  // Função para exibir posts e comentários
  function fetchPosts(posts) {
      postsContainer.innerHTML = "";
      posts.forEach(post => {
          const postElement = document.createElement("div");
          postElement.classList.add("post");
          postElement.innerHTML = `
              <h3>${post.title}</h3>
              <p>${post.content}</p>
              <small>Por ${post.author.name} - ${new Date(post.createdAt).toLocaleDateString()}</small>

              <div class="comments-container">
                  ${renderComments(post.comments)}
              </div>

              <div class="reply-box">
                  <textarea class="reply-input" placeholder="Responda este post..." rows="1"></textarea>
                  <button class="reply-button" onclick="replyToPost('${post.id}', this)">Responder</button>
              </div>
          `;
          postsContainer.appendChild(postElement);
      });
  }

  // Função para renderizar comentários aninhados
  function renderComments(comments, level = 0) {
      if (!comments.length) return "";
      return comments.map(comment => `
          <div class="comment" style="margin-left: ${level * 20}px;">
              <p><strong>${comment.author.name}</strong>: ${comment.content}</p>
              <small>${new Date(comment.createdAt).toLocaleDateString()}</small>

              <div class="reply-box">
                  <textarea class="reply-input" placeholder="Responder este comentário..." rows="1"></textarea>
                  <button class="reply-button" onclick="replyToComment('${comment.id}', this)">Responder</button>
              </div>

              <div class="nested-comments">
                  ${renderComments(comment.replies, level + 1)}
              </div>
          </div>
      `).join("");
  }

  // Função para responder a um post
  async function replyToPost(postId, button) {
      const content = button.previousElementSibling.value.trim();
      if (!content) return;

      try {
          const response = await fetch(`/localhost:8080/commentcreate/${postId}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ content })
          });

          if (response.ok) {
              location.reload(); // Recarrega a página para atualizar os comentários
          }
      } catch (error) {
          console.error("Erro ao responder ao post:", error);
      }
  }

  // Função para responder a um comentário
  async function replyToComment(commentId, button) {
      const content = button.previousElementSibling.value.trim();
      if (!content) return;

      try {
          const response = await fetch(`/localhost:8080/commentcreate/`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ content })
          });

          if (response.ok) {
              location.reload();
          }
      } catch (error) {
          console.error("Erro ao responder ao comentário:", error);
      }
  }

  // Carregar dados ao iniciar a página
  fetchBiomeData();
});
