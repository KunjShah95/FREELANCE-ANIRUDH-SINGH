// Newsboard MVP - Expert SaaS JS
const authSection = document.getElementById('auth-section');
const postSection = document.getElementById('post-section');
const feedSection = document.getElementById('feed-section');

function getUser() {
    return localStorage.getItem('newsboard_user');
}

function setUser(username) {
    localStorage.setItem('newsboard_user', username);
}

function logout() {
    localStorage.removeItem('newsboard_user');
    renderAuth();
    renderFeed();
}

function getPosts() {
    return JSON.parse(localStorage.getItem('newsboard_posts') || '[]');
}

function addPost(post) {
    const posts = getPosts();
    posts.unshift(post);
    localStorage.setItem('newsboard_posts', JSON.stringify(posts));
}

function renderAuth() {
    const user = getUser();
    if (user) {
        authSection.innerHTML = `<div class="flex justify-between items-center news-card p-4">
      <span>Welcome, <b>${user}</b></span>
      <button class="btn btn-danger px-4 py-2" onclick="logout()">Logout</button>
    </div>`;
        postSection.classList.remove('hidden');
        renderPostForm();
    } else {
        authSection.innerHTML = `<form id="login-form" class="news-card flex flex-col gap-3">
      <label for="username" class="font-semibold mb-1">Username</label>
      <input type="text" id="username" placeholder="Enter username" autocomplete="username" required />
      <button class="btn btn-primary px-4 py-2 mt-2" type="submit">Login / Sign Up</button>
    </form>`;
        postSection.classList.add('hidden');
        document.getElementById('login-form').onsubmit = function (e) {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            if (username.length < 3) {
                alert('Username must be at least 3 characters.');
                return;
            }
            setUser(username);
            renderAuth();
            renderFeed();
        };
    }
}

function renderPostForm() {
    postSection.innerHTML = `<form id="post-form" class="news-card flex flex-col gap-3">
    <label for="post-title" class="font-semibold mb-1">Title</label>
    <input type="text" id="post-title" placeholder="Title" maxlength="80" required />
    <label for="post-content" class="font-semibold mb-1">News Content</label>
    <textarea id="post-content" placeholder="What's the news?" maxlength="500" required></textarea>
    <button class="btn btn-accent px-4 py-2 mt-2" type="submit">Post News</button>
  </form>`;
    document.getElementById('post-form').onsubmit = function (e) {
        e.preventDefault();
        const title = document.getElementById('post-title').value.trim();
        const content = document.getElementById('post-content').value.trim();
        if (title.length < 3) {
            alert('Title must be at least 3 characters.');
            return;
        }
        if (content.length < 5) {
            alert('Content must be at least 5 characters.');
            return;
        }
        addPost({
            title,
            content,
            user: getUser(),
            time: new Date().toLocaleString()
        });
        renderFeed();
        document.getElementById('post-form').reset();
    };
}

function renderFeed() {
    const posts = getPosts();
    if (posts.length === 0) {
        feedSection.innerHTML = `<div class="text-center text-gray-500">No news yet. Be the first to post!</div>`;
        return;
    }
    feedSection.innerHTML = posts.map(post => `
    <div class="news-card">
      <div class="font-bold mb-1">${escapeHTML(post.title)}</div>
      <div class="text-gray-700 mb-2">${escapeHTML(post.content)}</div>
      <div class="text-xs flex justify-between">
        <span>By ${escapeHTML(post.user)}</span>
        <span>${escapeHTML(post.time)}</span>
      </div>
    </div>
  `).join('');
}

// Prevent XSS by escaping HTML
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, function (tag) {
        const chars = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        };
        return chars[tag] || tag;
    });
}

// Initial render
renderAuth();
renderFeed();
