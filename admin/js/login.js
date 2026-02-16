// Admin Login JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const errorText = document.getElementById('errorText');
    
    // Check if already logged in
    if (sessionStorage.getItem('adminAuthenticated') === 'true') {
        window.location.href = 'index.html';
        return;
    }
    
    // Handle login form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        
        // Show loading state
        const loginBtn = loginForm.querySelector('.login-btn');
        const originalBtnText = loginBtn.innerHTML;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
        loginBtn.disabled = true;
        
        try {
            // Simulate authentication (in production, this would be a real API call)
            const response = await authenticateUser(username, password);
            
            if (response.success) {
                // Store authentication state
                sessionStorage.setItem('adminAuthenticated', 'true');
                sessionStorage.setItem('adminUser', username);
                
                if (remember) {
                    localStorage.setItem('adminAuthenticated', 'true');
                    localStorage.setItem('adminUser', username);
                }
                
                // Redirect to admin panel
                showNotification('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
                
            } else {
                showError(response.message || 'Invalid username or password');
            }
            
        } catch (error) {
            showError('Login failed. Please try again.');
            console.error('Login error:', error);
        } finally {
            // Restore button state
            loginBtn.innerHTML = originalBtnText;
            loginBtn.disabled = false;
        }
    });
    
    // Handle forgot password link
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Please contact the administrator to reset your password.', 'info');
        });
    }
    
    // Authentication function (calls your backend API)
    async function authenticateUser(username, password) {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            return data;
            
        } catch (error) {
            console.error('Authentication error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        }
    }
    
    // Show error message
    function showError(message) {
        errorText.textContent = message;
        loginError.style.display = 'flex';
        
        // Hide error after 5 seconds
        setTimeout(() => {
            loginError.style.display = 'none';
        }, 5000);
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '10000',
            maxWidth: '300px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        // Set background color based on type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#3b82f6',
            warning: '#f59e0b'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Add input validation
    const inputs = loginForm.querySelectorAll('input[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.style.borderColor = 'var(--danger-color)';
            } else {
                this.style.borderColor = 'var(--border-color)';
            }
        });
        
        input.addEventListener('focus', function() {
            this.style.borderColor = 'var(--primary-color)';
        });
    });
    
    // Add enter key support for form submission
    loginForm.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
});
