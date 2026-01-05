
const STORAGE_KEY = "fileStorageTrackerData";
const ACCOUNT_KEY = "fileStorageTrackerAccount";


async function loadFiles() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}


async function saveFiles(files) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
    console.log("✓ Files saved");
}


async function exportFiles() {
    const files = await loadFiles();
    const dataStr = JSON.stringify(files, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'file-storage-backup.json';
    link.click();
    URL.revokeObjectURL(url);
    alert("✓ Files exported! You can share this file or email it.");
}


async function importFiles() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        const text = await file.text();
        const importedFiles = JSON.parse(text);
        
      
        const existing = await loadFiles();
        const existingIds = new Set(existing.map(f => f.id));
        const newFiles = importedFiles.filter(f => !existingIds.has(f.id));
        
        const merged = [...existing, ...newFiles];
        await saveFiles(merged);
        
        alert(`✓ Imported ${newFiles.length} new files!`);
        const searchBar = document.getElementById("searchBar");
        if (searchBar) {
            displayAllFiles(searchBar.value);
        }
    };
    input.click();
}



function switchForm(form) {
    document.querySelectorAll(".form-section").forEach(el => el.classList.remove("active"));
    document.querySelectorAll(".nav-buttons button").forEach(el => el.classList.remove("active"));

    if (form === "add") {
        document.getElementById("addForm").classList.add("active");
    }

    
    const buttons = document.querySelectorAll(".nav-buttons button");
    buttons.forEach((btn, idx) => {
        if ((form === "add" && idx === 0) || (form === "view" && idx === 1)) {
            btn.classList.add("active");
        }
    });

    if (form === "view") {
        displayAllFiles();
    }
}


function showStatus(message, type = "success", containerId = "addStatus") {
    const statusDiv = document.getElementById(containerId);
    statusDiv.className = `status-message ${type}`;
    statusDiv.textContent = message;

    if (type === "success") {
        setTimeout(() => {
            statusDiv.innerHTML = "";
        }, 2500);
    }
}


async function addFile() {
    const title = document.getElementById("title").value.trim();
    const storage = document.getElementById("storage").value.trim();
    const info = document.getElementById("info").value.trim();

    if (!title || !storage) {
        showStatus("⚠️ Title and Location required!", "error");
        return;
    }

    const files = await loadFiles();
    files.push({
        id: Date.now(),
        title,
        storage,
        info,
        createdDate: new Date().toISOString()
    });

    await saveFiles(files);
    showStatus("✓ File added!", "success");
    clearForm();
}


function clearForm() {
    document.getElementById("title").value = "";
    document.getElementById("storage").value = "";
    document.getElementById("info").value = "";
}


function getYear(dateString) {
    return new Date(dateString).getFullYear();
}


function getMonthYear(dateString) {
    const date = new Date(dateString);
    const months = ["January", "February", "March", "April", "May", "June",
                   "July", "August", "September", "October", "November", "December"];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
}


async function displayAllFiles(searchQuery = "") {
    const files = await loadFiles();
    const resultsDiv = document.getElementById("results");
    const statusDiv = document.getElementById("statusMessage");

    
    if (!searchQuery) {
        resultsDiv.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <p>Searched Information will show here.</p>
            </div>
        `;
        statusDiv.innerHTML = "";
        return;
    }

    let filteredFiles = files;
    const query = searchQuery.toLowerCase();
    filteredFiles = files.filter(f =>
        f.title.toLowerCase().includes(query) ||
        f.storage.toLowerCase().includes(query) ||
        f.info.toLowerCase().includes(query)
    );

    if (filteredFiles.length === 0) {
        resultsDiv.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <p>No files found</p>
            </div>
        `;
        statusDiv.innerHTML = "";
        return;
    }

    filteredFiles.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

    const groupedByYear = {};
    filteredFiles.forEach(file => {
        const year = getYear(file.createdDate);
        const monthYear = getMonthYear(file.createdDate);

        if (!groupedByYear[year]) {
            groupedByYear[year] = {};
        }
        if (!groupedByYear[year][monthYear]) {
            groupedByYear[year][monthYear] = [];
        }
        groupedByYear[year][monthYear].push(file);
    });

    let html = "";
    const years = Object.keys(groupedByYear).sort((a, b) => b - a);

    years.forEach(year => {
        html += `<div class="year-section">
                        <div class="year-header"></div>`;

        const monthsInYear = Object.keys(groupedByYear[year]);
        monthsInYear.forEach(monthYear => {
            html += `<div class="month-section">
                            <div class="month-header"></div>`;

            groupedByYear[year][monthYear].forEach(file => {
                html += `
                    <div class="file-card">
                        <div class="file-info-left">
                            <div class="file-detail"><span class="label">Title:</span> ${escapeHtml(file.title)}</div>
                            <div class="file-detail"><span class="label">Location:</span> ${escapeHtml(file.storage)}</div>
                            ${file.info ? `<div class="file-detail"><span class="label">Other Info:</span> ${escapeHtml(file.info)}</div>` : ""}
                        </div>
                        <div class="file-actions">
                            <button class="edit" onclick="editFile(${file.id})">Edit</button>
                            <button class="delete" onclick="deleteFile(${file.id})">Delete</button>
                        </div>
                    </div>
                `;
            });

            html += `</div>`;
        });

        html += `</div>`;
    });

    resultsDiv.innerHTML = html;
    statusDiv.innerHTML = searchQuery ? `<div class="status-message success">Found ${filteredFiles.length} file(s)</div>` : "";
}


async function editFile(id) {
    // Store the id for verification
    window.pendingActionId = id;
    window.pendingActionType = 'edit';
    
    // Show password verification modal
    document.getElementById('verify-modal-title').textContent = 'Verify Password to Edit';
    document.getElementById('password-verify-modal').style.display = 'flex';
    document.getElementById('verify-password').focus();
    document.getElementById('verify-password').value = '';
}

async function performEdit(id) {
    const files = await loadFiles();
    const fileIndex = files.findIndex(f => f.id === id);

    if (fileIndex === -1) return;

    const file = files[fileIndex];
    const newTitle = prompt("Edit Title:", file.title);

    if (newTitle === null) return;
    if (!newTitle.trim()) {
        alert("Title cannot be empty!");
        return;
    }

    const newStorage = prompt("Edit Location:", file.storage);
    if (newStorage === null) return;
    if (!newStorage.trim()) {
        alert("Location cannot be empty!");
        return;
    }

    const newInfo = prompt("Edit Information:", file.info);
    if (newInfo === null) return;

    files[fileIndex] = {
        ...file,
        title: newTitle.trim(),
        storage: newStorage.trim(),
        info: newInfo.trim(),
        updatedDate: new Date().toISOString()
    };

    await saveFiles(files);
    showStatus("✓ Updated!", "success", "statusMessage");
    await displayAllFiles(document.getElementById("searchBar").value);
}


async function deleteFile(id) {
    // Store the id for verification
    window.pendingActionId = id;
    window.pendingActionType = 'delete';
    
    // Show password verification modal
    document.getElementById('verify-modal-title').textContent = 'Verify Password to Delete';
    document.getElementById('password-verify-modal').style.display = 'flex';
    document.getElementById('verify-password').focus();
    document.getElementById('verify-password').value = '';
}

async function performDelete(id) {
    let files = await loadFiles();
    files = files.filter(f => f.id !== id);
    await saveFiles(files);

    showStatus("✓ Deleted!", "success", "statusMessage");
    await displayAllFiles(document.getElementById("searchBar").value);
}


function searchFiles() {
    const query = document.getElementById("searchBar").value;
    displayAllFiles(query);
}


function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}


document.addEventListener("DOMContentLoaded", function() {
    
    const searchBar = document.getElementById("searchBar");
    if (searchBar) {
        
        searchBar.addEventListener("input", () => { searchFiles(); });
        searchBar.addEventListener("keyup", (e) => { if (e.key === 'Enter') searchFiles(); });
    }

    
    const searchBarMain = document.getElementById("searchBar-main");
    if (searchBarMain) {
        searchBarMain.addEventListener("keyup", function(){
            
            document.getElementById('searchBar').value = searchBarMain.value;
            searchFiles();
        });
    }

    
    displayAllFiles();
});



const signinBtn = document.getElementById('signin-btn');
const modal = document.getElementById('modal');
const cancel = document.getElementById('cancel-login');
const submit = document.getElementById('submit-login');

signinBtn.addEventListener('click', ()=> { modal.style.display = 'flex'; document.getElementById('login-user').focus(); });
cancel.addEventListener('click', ()=> { modal.style.display = 'none'; document.getElementById('login-user').value = ''; document.getElementById('login-pass').value = ''; });
modal.addEventListener('click', (e)=> { if (e.target === modal) { modal.style.display = 'none'; document.getElementById('login-user').value = ''; document.getElementById('login-pass').value = ''; } });

submit.addEventListener('click', ()=> {
    const u = document.getElementById('login-user').value.trim();
    const p = document.getElementById('login-pass').value;
    
    // Get stored credentials or use defaults
    const storedAccount = JSON.parse(localStorage.getItem(ACCOUNT_KEY) || '{"username":"MPDC","password":"MPDC2026"}');
    
    if (u === storedAccount.username && p === storedAccount.password) {
        // hide modal
        if (modal) modal.style.display = 'none';

        
        const hero = document.getElementById('hero');
        const dashboard = document.getElementById('dashboard');
        if (hero) hero.classList.remove('active');
        if (dashboard) dashboard.classList.add('active');

        
        if (signinBtn) signinBtn.style.display = 'none';
        const changeAccountBtn = document.getElementById('change-account-btn');
        if (changeAccountBtn) changeAccountBtn.style.display = '';
        const signoutBtn = document.getElementById('signout-header-btn');
        if (signoutBtn) signoutBtn.style.display = '';

        
        document.getElementById('login-user').value = '';
        document.getElementById('login-pass').value = '';

        
        const firstInput = document.getElementById('title');
        if (firstInput) firstInput.focus();
    } else {
        alert('Invalid credentials');
    }
});



const signoutHeaderBtn = document.getElementById('signout-header-btn');
if (signoutHeaderBtn) {
    signoutHeaderBtn.addEventListener('click', ()=> {
    const hero = document.getElementById('hero');
    const dashboard = document.getElementById('dashboard');

    if (hero) hero.classList.add('active');
    if (dashboard) dashboard.classList.remove('active');

    
    if (signinBtn) signinBtn.style.display = '';
    const changeAccountBtn = document.getElementById('change-account-btn');
    if (changeAccountBtn) changeAccountBtn.style.display = 'none';
    signoutHeaderBtn.style.display = 'none';

    
    const sb = document.getElementById('searchBar');
    if (sb) {
        sb.value = '';
        sb.focus();
    }
    displayAllFiles();

    
    document.getElementById('login-user').value = '';
    document.getElementById('login-pass').value = '';
});
}

// Change Account functionality
const changeAccountBtn = document.getElementById('change-account-btn');
const changeAccountModal = document.getElementById('change-account-modal');
const cancelChangeBtn = document.getElementById('cancel-change');
const submitChangeBtn = document.getElementById('submit-change');

if (changeAccountBtn) {
    changeAccountBtn.addEventListener('click', () => {
        changeAccountModal.style.display = 'flex';
        document.getElementById('change-user').focus();
    });
}

if (cancelChangeBtn) {
    cancelChangeBtn.addEventListener('click', () => {
        changeAccountModal.style.display = 'none';
        document.getElementById('change-user').value = '';
        document.getElementById('change-pass').value = '';
        document.getElementById('change-pass-confirm').value = '';
    });
}

if (changeAccountModal) {
    changeAccountModal.addEventListener('click', (e) => {
        if (e.target === changeAccountModal) {
            changeAccountModal.style.display = 'none';
            document.getElementById('change-user').value = '';
            document.getElementById('change-pass').value = '';
            document.getElementById('change-pass-confirm').value = '';
        }
    });
}

if (submitChangeBtn) {
    submitChangeBtn.addEventListener('click', () => {
        const newUsername = document.getElementById('change-user').value.trim();
        const newPassword = document.getElementById('change-pass').value;
        const confirmPassword = document.getElementById('change-pass-confirm').value;
        
        if (!newUsername || !newPassword) {
            alert('⚠️ Username and Password are required!');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            alert('⚠️ Passwords do not match!');
            return;
        }
        
        if (newPassword.length < 4) {
            alert('⚠️ Password must be at least 4 characters!');
            return;
        }
        
        // Save new credentials
        const newAccount = {
            username: newUsername,
            password: newPassword
        };
        localStorage.setItem(ACCOUNT_KEY, JSON.stringify(newAccount));
        
        alert('✓ Account updated successfully!');
        
        // Close modal and clear inputs
        changeAccountModal.style.display = 'none';
        document.getElementById('change-user').value = '';
        document.getElementById('change-pass').value = '';
        document.getElementById('change-pass-confirm').value = '';
    });
}

// Password verification for Edit/Delete
const passwordVerifyModal = document.getElementById('password-verify-modal');
const cancelVerifyBtn = document.getElementById('cancel-verify');
const submitVerifyBtn = document.getElementById('submit-verify');

if (cancelVerifyBtn) {
    cancelVerifyBtn.addEventListener('click', () => {
        passwordVerifyModal.style.display = 'none';
        document.getElementById('verify-password').value = '';
        window.pendingActionId = null;
        window.pendingActionType = null;
    });
}

if (passwordVerifyModal) {
    passwordVerifyModal.addEventListener('click', (e) => {
        if (e.target === passwordVerifyModal) {
            passwordVerifyModal.style.display = 'none';
            document.getElementById('verify-password').value = '';
            window.pendingActionId = null;
            window.pendingActionType = null;
        }
    });
}

if (submitVerifyBtn) {
    submitVerifyBtn.addEventListener('click', async () => {
        const enteredPassword = document.getElementById('verify-password').value;
        const storedAccount = JSON.parse(localStorage.getItem(ACCOUNT_KEY) || '{"username":"MPDC","password":"MPDC2026"}');
        
        if (enteredPassword === storedAccount.password) {
            // Password correct, proceed with action
            const actionId = window.pendingActionId;
            const actionType = window.pendingActionType;
            
            // Close modal
            passwordVerifyModal.style.display = 'none';
            document.getElementById('verify-password').value = '';
            window.pendingActionId = null;
            window.pendingActionType = null;
            
            // Perform the action
            if (actionType === 'edit') {
                await performEdit(actionId);
            } else if (actionType === 'delete') {
                if (confirm('Are you sure you want to delete this file?')) {
                    await performDelete(actionId);
                }
            }
        } else {
            alert('❌ Incorrect password!');
            document.getElementById('verify-password').value = '';
        }
    });
}

// Allow Enter key to submit password verification
document.getElementById('verify-password').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && document.getElementById('password-verify-modal').style.display === 'flex') {
        submitVerifyBtn.click();
    }
});
