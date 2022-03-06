document.addEventListener('DOMContentLoaded', (event) => {
    // Immediately invoked function to set the theme on initial load
    (function () {
        if (localStorage.getItem('menuState') === 'menuIsExtended') {
            setMenuState('menuIsExtended');
            document.querySelector('.extendMenu')?.querySelectorAll('.fa-chevron-right').forEach(chevron => { chevron.classList.add('flip') })

        } else {
            setMenuState('menuClosed');
            document.querySelector('.extendMenu')?.querySelectorAll('.fa-chevron-right').forEach(chevron => { chevron.classList.remove('flip') })

        }
    })();


    setTimeout(function () {
        document.body.className = "";
    }, 500);
});

let currentTheme = '';
let currentShowMenu = '';
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

// TOGGLE MENU


// function toggleMenu() {
//     document.querySelector('.dashboard').classList.toggle('menuIsExtended')
//     document.querySelector('.dashboard').classList.toggle('menuClosed')
// }

// function to toggle between light and dark theme
function toggleMenu() {
    if (localStorage.getItem('menuState') === 'menuIsExtended') {
        setMenuState('menuClosed');
        document.querySelector('.extendMenu').querySelectorAll('.fa-chevron-right').forEach(chevron => { chevron.classList.remove('flip') })
    } else {
        setMenuState('menuIsExtended');
        document.querySelector('.extendMenu').querySelectorAll('.fa-chevron-right').forEach(chevron => { chevron.classList.add('flip') })

    }
}

function toggleMenuSwitch() {
    document.querySelector('.dashboard').classList.toggle('menuIsExtended')
    document.querySelector('.dashboard').classList.toggle('menuClosed')
}

// function to set a given theme/color-scheme
function setMenuState(menuState) {
    currentShowMenu = menuState;
    try {
        toggleMenuSwitch()
    } catch (error) { }
    localStorage.setItem('menuState', menuState);
    document.querySelector('.dashboard').classList = `dashboard ${menuState}`;
    // document.documentElement.className = menuState;
}
