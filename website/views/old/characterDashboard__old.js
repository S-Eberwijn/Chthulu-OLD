const MAXIMUM_DISPLAYED_CHARACTER_ITEMS = 10;

document.addEventListener("DOMContentLoaded", function () {
    let characterListItems = document.querySelectorAll('.characterItem');
    characterListItems[0].classList.add('selected');

    characterListItems.forEach(item => {
        item.addEventListener('click', function () {
            let characterCardStack = document.getElementById("characterCardStack");
            let children = characterCardStack.children,
                firstChild = children[0]

            let target = document.querySelector('.characterItem.selected');
            target.classList.remove('selected');
            this.classList.add('selected');

            let targetCharacterCardHolder = document.getElementById(`card-${this.id.split('-')[1]}`).parentNode;

            characterCardStack = document.getElementById("characterCardStack");
            characterCardStack.insertBefore(targetCharacterCardHolder, firstChild);

        })
    })

    characterListItems.forEach(item => { item.classList.add("notDisplayed"); })
    slice(characterListItems, 0, MAXIMUM_DISPLAYED_CHARACTER_ITEMS).forEach(item => { item.classList.remove("notDisplayed") })
})

function changeCharacterItems(element,index) {
    let characterListItems = document.querySelectorAll('.characterItem');
    characterListItems.forEach(item => { item.classList.add("notDisplayed"); })
    slice(characterListItems, index * MAXIMUM_DISPLAYED_CHARACTER_ITEMS, index * MAXIMUM_DISPLAYED_CHARACTER_ITEMS + MAXIMUM_DISPLAYED_CHARACTER_ITEMS).forEach(item => { item.classList.remove("notDisplayed") })

    updateCircleIcons(element)
}

function updateCircleIcons(element) {
    let circleIcons = document.querySelectorAll('.characterSelectionBox .paginationDiv i');
    circleIcons.forEach(item => { item.classList.remove("fas");item.classList.add("far") })
    element.classList.remove("far");
    element.classList.add("fas");
}

let slice = function (elements, start, end) {
    let sliced = Array.prototype.slice.call(elements, start, end);
    return sliced;
}