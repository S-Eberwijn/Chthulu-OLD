document.addEventListener('keydown', (e) => {
    if (e.key == 'Escape') return e.preventDefault();
});

document.addEventListener('DOMContentLoaded', () => {
    // Immediately invoked function to set the theme on initial load
    (function () {
        if (localStorage.getItem('menuState') === 'menuClosed') {
            setMenuState('menuClosed');
            document.querySelector('.extendMenu')?.querySelectorAll('.fa-chevron-right').forEach(chevron => { chevron.classList.remove('flip') })

        } else {

            setMenuState('menuIsExtended');
            document.querySelector('.extendMenu')?.querySelectorAll('.fa-chevron-right').forEach(chevron => { chevron.classList.add('flip') })

        }
    })();
    document.querySelectorAll('.sidebarContent a').forEach(element => {
        element.addEventListener('click', () => {
            showPageLoader();
        })
    })
    document.querySelectorAll('.menuCategory a').forEach(element => {
        element.addEventListener('click', () => {
            showPageLoader();
        })
    })
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

//!!this one can go I think
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
    const element = document.querySelector('.dashboard')

    if (element) element.classList = `dashboard ${menuState}`;
}

function profileMenuToggle() {
    const toggleProfileMenu = document.querySelector('.action .profileMenu');
    toggleProfileMenu.classList.toggle('active');
}

function showPageLoader() {
    document.getElementById('loader_modal').showModal();
}

