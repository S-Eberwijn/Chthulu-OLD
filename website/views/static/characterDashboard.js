document.addEventListener("DOMContentLoaded", function () {
    let characterCardStackChildren = document.querySelector('.dashboardContent[characters] .cardStack').children;
    characterCardStackChildren[0].addEventListener('click', rotateCharacterCardsLeft);
    characterCardStackChildren[characterCardStackChildren.length - 2].addEventListener('click', rotateCharacterCardsRight);
    let characterListItems = document.querySelectorAll('.characterItem');
    characterListItems[0].classList.add('selected');

    characterListItems.forEach(item => {
        item.addEventListener('click', function (event) {
            let characterCardStack = document.getElementById("characterCardStack");
            var children = characterCardStack.children,
                firstChild = children[0],
                secondChild = children[1],
                almostLastChild = children[children.length - 2],
                thirdLastChild = children[children.length - 3],
                lastChild = children[children.length - 1];

            for (let index = 0; index < children.length; index++) {
                const child = children[index];
                child.style.transition = 'none'
            }

            firstChild.removeEventListener('click', rotateCharacterCardsLeft);
            almostLastChild.removeEventListener('click', rotateCharacterCardsRight);

            var target = document.querySelector('.characterItem.selected');
            target.classList.remove('selected');
            this.classList.add('selected');

            firstChild.classList.add('leftCardToBehindMiddle');
            secondChild.classList.add('leftCardToBehindMiddle');

            almostLastChild.classList.add('rightCardToBehindMiddle');
            thirdLastChild.classList.add('rightCardToBehindMiddle');

            lastChild.querySelector('.characterCard').classList.add('characterCardContentDarkened')


            setTimeout(() => {
                firstChild.classList.remove('leftCardToBehindMiddle');
                secondChild.classList.remove('leftCardToBehindMiddle');

                almostLastChild.classList.remove('rightCardToBehindMiddle');
                thirdLastChild.classList.remove('rightCardToBehindMiddle');

                lastChild.querySelector('.characterCard').classList.remove('characterCardContentDarkened')

                let targetCharacterCardHolder = document.getElementById(`card-${this.id.split('-')[1]}`).parentNode;
                let characterCardHolders = document.querySelectorAll('.characterCardHolder')
                // console.log(characterCardHolders)
                var targetIndex = Array.from(characterCardHolders).indexOf(targetCharacterCardHolder)
                // console.log(characterCardHolders[index])
                characterCardStack = document.getElementById("characterCardStack");

                // console.log(characterCardHolders.slice(index, characterCardHolders.length - 1))
                for (let index = targetIndex + 1; index < characterCardHolders.length; index++) {
                    const characterCardHolder = characterCardHolders[index];
                    characterCardStack.insertBefore(characterCardHolder, characterCardHolders[0]);
                }




                setTimeout(() => {
                    let children = document.querySelector('.dashboardContent[characters] .cardStack').children;
                    let first = children[0],
                        second = children[1],
                        last = children[children.length - 1],
                        secondLast = children[children.length - 2],
                        thirdLastChild = children[children.length - 3];

                    first.classList.add('behindMiddleCardToLeft');
                    second.classList.add('behindMiddleCardToLeft');
                    secondLast.classList.add('behindMiddleCardToRight');
                    thirdLastChild.classList.add('behindMiddleCardToRight');
                    // last.querySelector('.characterCard').classList.add('characterCardContentVisible')

                    first.style.transition = 'transform'
                    first.style.transitionDuration = '.75s'
                    first.style.transitionDelay = '.1s'

                    secondLast.style.transition = 'transform'
                    secondLast.style.transitionDuration = '.75s'
                    secondLast.style.transitionDelay = '.1s'
                    setTimeout(() => {
                        first.classList.remove('behindMiddleCardToLeft');
                        second.classList.remove('behindMiddleCardToLeft');

                        secondLast.classList.remove('behindMiddleCardToRight');
                        thirdLastChild.classList.remove('behindMiddleCardToRight');

                        // last.querySelector('.characterCard').classList.remove('characterCardContentVisible')


                    }, 500)
                }, 0)
                let characterCardStackChildren = document.querySelector('.dashboardContent[characters] .cardStack').children;
                characterCardStackChildren[0].addEventListener('click', rotateCharacterCardsLeft);
                characterCardStackChildren[characterCardStackChildren.length - 2].addEventListener('click', rotateCharacterCardsRight);

            }, 500);

        })
    })
})

function rotateCharacterCardsRight() {

    let characterCardStack = document.getElementById("characterCardStack");
    var children = characterCardStack.children,
        firstChild = children[0],
        secondChild = children[1],
        almostLastChild = children[children.length - 2],
        lastChild = children[children.length - 1];

    for (let index = 0; index < children.length; index++) {
        const child = children[index];
        child.style.transition = 'none'
    }

    firstChild.removeEventListener('click', rotateCharacterCardsLeft);
    almostLastChild.removeEventListener('click', rotateCharacterCardsRight);

    almostLastChild.classList.add('rightCardToTopMiddle')
    almostLastChild.querySelector('.characterCard').classList.add('characterCardContentVisible')

    lastChild.classList.add('middleCardToBehindLeft')
    lastChild.querySelector('.characterCard').classList.add('characterCardContentDarkened')

    firstChild.classList.add('leftCardToBehindMiddle');
    // secondChild.classList.add('leftCardToBehindMiddle');

    // Change the selected Character List Item
    let characterListItems = document.querySelectorAll('.characterItem');

    var targetCharacterListItem = document.querySelector('.characterItem.selected');
    var characterListItemIndex = Array.from(characterListItems).indexOf(targetCharacterListItem)
    targetCharacterListItem.classList.remove('selected');
    if (characterListItemIndex + 1 > characterListItems.length - 1) {
        characterListItems[0].classList.add('selected')
    } else {
        characterListItems[characterListItemIndex + 1].classList.add('selected')
    }

    setTimeout(() => {
        characterCardStack.insertBefore(lastChild, firstChild);

        almostLastChild.classList.remove('rightCardToTopMiddle')
        almostLastChild.querySelector('.characterCard').classList.remove('characterCardContentVisible')

        lastChild.classList.remove('middleCardToBehindLeft')
        lastChild.querySelector('.characterCard').classList.remove('characterCardContentDarkened')

        firstChild.classList.remove('leftCardToBehindMiddle')
        // secondChild.classList.remove('leftCardToBehindMiddle');

        //TODO: Hover add afterwards? So the cards dont jump after resorting the array
        //Improvements but not there yet
        //Change the transitions only to the first and second last child
        setTimeout(() => {
            let first = children[0];
            let secondLast = children[children.length - 2];
            first.style.transition = 'transform'
            first.style.transitionDuration = '.75s'
            first.style.transitionDelay = '.1s'

            secondLast.style.transition = 'transform'
            secondLast.style.transitionDuration = '.75s'
            secondLast.style.transitionDelay = '.1s'
        }, 0)



        characterCardStack = document.getElementById("characterCardStack");
        children = characterCardStack.children,
            firstChild = children[0],
            almostLastChild = children[children.length - 2],
            lastChild = children[children.length - 1];

        firstChild.addEventListener('click', rotateCharacterCardsLeft);
        almostLastChild.addEventListener('click', rotateCharacterCardsRight);
    }, 450)



}

function rotateCharacterCardsLeft() {
    let characterCardStack = document.getElementById("characterCardStack");
    var children = characterCardStack.children,
        firstChild = children[0],
        secondChild = children[1],
        almostLastChild = children[children.length - 2],
        lastChild = children[children.length - 1];

    for (let index = 0; index < children.length; index++) {
        const child = children[index];
        child.style.transition = 'none'
    }

    firstChild.removeEventListener('click', rotateCharacterCardsLeft);
    almostLastChild.removeEventListener('click', rotateCharacterCardsRight);

    // characterCardStackChildren[characterCardStackChildren.length - 2].addEventListener('click', rotateCharacterCardsRight);

    firstChild.classList.add('leftCardToTopMiddle')
    firstChild.querySelector('.characterCard').classList.add('characterCardContentVisible')

    lastChild.classList.add('middleCardToBehindRight')
    lastChild.querySelector('.characterCard').classList.add('characterCardContentDarkened')

    almostLastChild.classList.add('rightCardToBehindMiddle');
    // secondChild.classList.add('leftCardToBehindMiddle');

    // Change the selected Character List Item
    let characterListItems = document.querySelectorAll('.characterItem');

    var targetCharacterListItem = document.querySelector('.characterItem.selected');
    var characterListItemIndex = Array.from(characterListItems).indexOf(targetCharacterListItem)
    targetCharacterListItem.classList.remove('selected');

    if (characterListItemIndex - 1 < 0) {
        characterListItems[characterListItems.length - 1].classList.add('selected')
    } else {
        characterListItems[characterListItemIndex - 1].classList.add('selected')
    }

    setTimeout(() => {
        characterCardStack.insertBefore(firstChild, lastChild.nextSibling);

        // characterCardStack.insertBefore(lastChild, firstChild);
        firstChild.classList.remove('leftCardToTopMiddle')
        firstChild.querySelector('.characterCard').classList.remove('characterCardContentVisible')

        lastChild.classList.remove('middleCardToBehindRight')
        lastChild.querySelector('.characterCard').classList.remove('characterCardContentDarkened')

        almostLastChild.classList.remove('rightCardToBehindMiddle');
        // secondChild.classList.remove('leftCardToBehindMiddle');

        //TODO: Hover add afterwards? So the cards dont jump after resorting the array
        //Improvements but not there yet
        //Change the transitions only to the first and second last child
        setTimeout(() => {
            let first = children[0];
            let secondLast = children[children.length - 2];
            first.style.transition = 'transform'
            first.style.transitionDuration = '.75s'
            first.style.transitionDelay = '.1s'

            secondLast.style.transition = 'transform'
            secondLast.style.transitionDuration = '.75s'
            secondLast.style.transitionDelay = '.1s'
        }, 0)



        characterCardStack = document.getElementById("characterCardStack");
        children = characterCardStack.children,
            firstChild = children[0],
            almostLastChild = children[children.length - 2],
            lastChild = children[children.length - 1];

        firstChild.addEventListener('click', rotateCharacterCardsLeft);
        almostLastChild.addEventListener('click', rotateCharacterCardsRight);
    }, 450)
    // characterCardStack.insertBefore(firstChild, lastChild.nextSibling);

    // characterCardStack = document.getElementById("characterCardStack");
    // children = characterCardStack.children,
    //     firstChild = children[0],
    //     almostLastChild = children[children.length - 2],
    //     lastChild = children[children.length - 1];

    // firstChild.addEventListener('click', rotateCharacterCardsLeft);
    // almostLastChild.addEventListener('click', rotateCharacterCardsRight);


    // // TODO: FIX Out of Bounds
    // let characterListItems = document.querySelectorAll('.characterItem');

    // // the element you're looking for
    // var target = document.querySelector('.characterItem.selected');

    // // the collection you're looking in
    // // var nodes = document.querySelectorAll(".characterItem");

    // var index = Array.from(characterListItems).indexOf(target)
    // // console.log(index)

    // target.classList.remove('selected');
    // if (index - 1 < 0) {
    //     characterListItems[characterListItems.length - 1].classList.add('selected')
    // } else {
    //     characterListItems[index - 1].classList.add('selected')
    // }

    // for (let index = 0; index < children.length; index++) {
    //     const child = children[index];
    //     setTimeout(() => {
    //         child.style.transition = 'transform .75s'
    //     }, 50);
    //     // child.style.transition = 'transform .75s'


    // }
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