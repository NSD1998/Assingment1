let currentPage = 1;
let reposPerPage = 10; // Default value

async function fetchRepos() {
    const username = document.getElementById('username').value;
    const repoList = document.getElementById('repoList');
    const reposPerPageInput = document.getElementById('reposPerPage');
    const searchInput = document.getElementById('search');
    const loadingIndicator = document.getElementById('loading');
    const selectedUsernameElement = document.getElementById('selectedUsername');

  
    reposPerPage = Math.min(Math.max(parseInt(reposPerPageInput.value), 1), 100);

    try {
        loadingIndicator.style.display = 'block'; 

        const response = await fetch(`https://api.github.com/users/${username}/repos?page=${currentPage}&per_page=${reposPerPage}`);
        const data = await response.json();

        if (response.ok) {
            repoList.innerHTML = ''; 

            data.filter(repo => repo.name.toLowerCase().includes(searchInput.value.toLowerCase()))
                .forEach(async repo => {
                    const repoItem = document.createElement('li');
                    repoItem.classList.add('repoItem');

                    
                    const topicsResponse = await fetch(`https://api.github.com/repos/${username}/${repo.name}/topics`);
                    const topicsData = await topicsResponse.json();
                    const topics = topicsData.names || [];

                    repoItem.innerHTML = `<strong>${repo.name}</strong>: ${repo.description || 'No description available'}<br>Topics: ${topics.join(', ')}`;
                    repoList.appendChild(repoItem);
                });

            // Display pagination buttons
            const totalPages = Math.ceil(data.length / reposPerPage);
            displayPagination(totalPages);

            // Display the GitHub username
            selectedUsernameElement.textContent = `Repositories for user: ${username}`;
        } else {
            repoList.innerHTML = `<li class="repoItem" style="color: red;">Error: ${data.message}</li>`;
        }
    } catch (error) {
        repoList.innerHTML = `<li class="repoItem" style="color: red;">An error occurred while fetching repositories</li>`;
    } finally {
        loadingIndicator.style.display = 'none'; // Hide loading indicator
    }
}

// Add a new function to fetch repositories by username
async function fetchReposByUsername() {
    const username = document.getElementById('username').value;
    const selectedUsernameElement = document.getElementById('selectedUsername');

    if (username.trim() !== '') {
        selectedUsernameElement.textContent = `Repositories for user: ${username}`;
        document.getElementById('search').value = ''; // Clear the search input
        fetchRepos();
    } else {
        selectedUsernameElement.textContent = ''; // Clear the username display
    }
}

// Add a new function to fetch user profile
async function fetchUserProfile() {
    const username = document.getElementById('username').value;
    const userProfileContainer = document.getElementById('userProfile');
    const selectedUsernameElement = document.getElementById('selectedUsername');

    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        const userData = await response.json();

        if (response.ok) {
            
            userProfileContainer.innerHTML = `
                <h3>${userData.name || 'No Name'}</h3>
                <p>${userData.bio || 'No bio available'}</p>
                <p>Followers: ${userData.followers || 0} | Following: ${userData.following || 0}</p>
                <p>Public Repositories: ${userData.public_repos || 0}</p>
            `;

    
            selectedUsernameElement.textContent = `Repositories for user: ${username}`;
        } else {
            userProfileContainer.innerHTML = `<p style="color: red;">Error fetching user profile</p>`;
            selectedUsernameElement.textContent = ''; 
        }
    } catch (error) {
        userProfileContainer.innerHTML = `<p style="color: red;">An error occurred while fetching user profile</p>`;
        selectedUsernameElement.textContent = ''; // Clear the username display
    }
}

function displayPagination(totalPages) {
    const paginationContainer = document.getElementById('pagination');

    if (!paginationContainer) {
        const appContainer = document.getElementById('app');
        const paginationDiv = document.createElement('div');
        paginationDiv.id = 'pagination';
        appContainer.appendChild(paginationDiv);
    }

    const paginationButtons = [];
    for (let i = 1; i <= totalPages; i++) {
        paginationButtons.push(`<button onclick="changePage(${i})">${i}</button>`);
    }

    paginationContainer.innerHTML = paginationButtons.join(' ');
}

function changePage(page) {
    currentPage = page;
    fetchRepos();
}

function filterRepositories() {
    fetchRepos();
}
