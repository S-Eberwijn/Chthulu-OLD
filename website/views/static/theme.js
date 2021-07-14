let currentTheme = '';
// function to set a given theme/color-scheme
function setTheme(themeName) {
    currentTheme = themeName;
    try {
        // toggleSwitch()
    } catch (error) { }
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}
// function to toggle between light and dark theme
function toggleTheme() {
    if (localStorage.getItem('theme') === 'theme-dark') {
        setTheme('theme-light');
    } else {
        setTheme('theme-dark');
    }
}
// Immediately invoked function to set the theme on initial load
(function () {
    if (localStorage.getItem('theme') === 'theme-light') {
        setTheme('theme-light');
    } else {
        setTheme('theme-dark');
    }
})();

window.onload = function () {
    // toggleSwitch()
}

function toggleSwitch() {
    if (currentTheme.includes('dark')) {
        document.getElementById('toggleSwitch').classList.remove('dark')
    } else {
        document.getElementById('toggleSwitch').classList.add('dark')
    }
}