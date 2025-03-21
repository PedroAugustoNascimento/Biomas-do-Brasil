document.addEventListener('DOMContentLoaded', async () => {
     try {
         // Get user ID from localStorage (assuming it was stored during login)
         //const userId = localStorage.getItem('userId');
         //if (!userId) {
           //  window.location.href = '../Login/login.html';
         //    return;
       //  }
 
         // Fetch user data
         const response = await fetch(`http://localhost:8080/user/${userId}`, {
             method: 'GET',
         });
 
         if (!response.ok) {
             throw new Error('Failed to fetch user data');
         }
 
         const userData = await response.json();
 
         // Update profile image
         const profileImg = document.querySelector('#FotoPerfil img');
         if (userData.profileImage) {
             profileImg.src = `../../public/img/${userData.profileImage}`;
         } else {
             profileImg.src = '../../img/default-profile.png';
         }
         profileImg.alt = `${userData.name}'s profile picture`;
 
         // Update user data
         const dadosPerfil = document.querySelector('#DadosPerfil');
         dadosPerfil.innerHTML = `
             <p>Nome: ${userData.name}</p>
             <p>Email: ${userData.email}</p>
             ${userData.bio ? `<p>Bio: ${userData.bio}</p>` : ''}
         `;
 
         // Update greeting in navbar
         const greeting = document.querySelector('#greeting p');
         greeting.textContent = `Olá, ${userData.name}!`;
 
     } catch (error) {
         console.error('Error fetching user data:', error);
         alert('Erro ao carregar dados do usuário');
     }
 });