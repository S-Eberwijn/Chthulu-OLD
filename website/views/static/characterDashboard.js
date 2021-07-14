document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('leftArrow').addEventListener('click', rotateCharacterCardsLeft);
    document.getElementById('rightArrow').addEventListener('click', rotateCharacterCardsRight);

})
function rotateCharacterCardsRight() {
    let characterCardStack = document.getElementById("characterCardStack");
    var children = characterCardStack.children,
        firstChild = children[0],
        lastChild = children[children.length - 1];
    characterCardStack.insertBefore(lastChild, firstChild);

}

function rotateCharacterCardsLeft() {
    let characterCardStack = document.getElementById("characterCardStack");
    var children = characterCardStack.children,
        firstChild = children[0],
        lastChild = children[children.length - 1];
    characterCardStack.insertBefore(firstChild, lastChild.nextSibling);
}

function updateInput(value) {
    // console.log(value);
    let characterCardStackEl = document.getElementById("characterCardStack");
    let characterCardStack = characterCardStackEl.children;
    for (let index = 0; index < characterCardStack.length; index++) {
        const cardHolder = characterCardStack[index];
        let characterName = cardHolder.firstChild.firstChild.innerHTML
        if (characterName.toLowerCase().includes(value.toLowerCase())) characterCardStackEl.insertBefore(characterCardStack[characterCardStack.length - 1], cardHolder);
    }
    // characters.forEach(character => {
    //     if (character.name.includes(value)) console.log(character)
    // });
}