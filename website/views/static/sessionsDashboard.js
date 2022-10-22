// TODO: funky stuff going on with embla carousel after "resetting" it after session is approved, or declined
// TODO: add validation for when DM tries to create a new session

const sections = ["requested", "planned", "past"];
document.addEventListener("DOMContentLoaded", async function () {
    document.querySelectorAll('.modal .select-wrapper').forEach(element => {
        element.addEventListener('click', function (e) {
            if (e.target.classList.contains('select_trigger') || e.target.parentNode.classList.contains('select_trigger')) element.querySelector('.select').classList.toggle('open');
        })
    })

    for (const option of document.querySelectorAll(".custom-option")) {
        option.addEventListener('click', function () {
            if (this.classList.contains('selected')) {
                this.classList.remove('selected');
                document.querySelector(`.userListBox .userDisplay[data-user-id="${this.getAttribute('data-value')}"]`).remove();
            } else {
                if (document.querySelectorAll(`.userListBox .userDisplay`).length >= 5) return
                this.classList.add('selected');
                let clickedUser = {
                    id: this.getAttribute('data-value'),
                    username: this.querySelector('span.text').textContent,
                    avatarURL: this.querySelector('.playerIcon img').src
                }
                let leftSide = document.querySelector('#players .userListBox .leftSide');
                let rightSide = document.querySelector('#players .userListBox .rightSide');

                rightSide.children.length >= leftSide.children.length ? leftSide.appendChild(createUserDisplayElement(clickedUser)) : rightSide.appendChild(createUserDisplayElement(clickedUser));
            }

            for (const node of document.querySelector('label#players').childNodes) {
                if (node.nodeName === '#text') {
                    node.textContent = `Players (${option.parentElement.querySelectorAll('.custom-option.selected').length}/5)`;
                }
            }



        })
    }

    window.addEventListener('click', function (e) {
        const select = document.querySelector('.select')
        if (!select.contains(e.target)) {
            select.classList.remove('open');
        }
    });

    for (const key in sections) {
        if (Object.hasOwnProperty.call(sections, key)) {
            const section = sections[key];
            await createCarousel(section);
        }
    }

    document.querySelector(`#createSessionRequest`).addEventListener("click", function (e) {
        e.preventDefault();
    });

    document.querySelectorAll(`.addPlayer`).forEach((element) => {
        element.addEventListener("click", function () {
            console.log(`Add Player`);
        });
    });
    const summaries = document.querySelectorAll("summary");
    summaries.forEach((summary) => {
        const detail = summary.parentNode;
        summary.addEventListener("click", function (e) {
            if (e.target.id === null || e.target.id === "") return;
            if (e.target.id === "createSessionRequest") {
                document.querySelector(`#createSessionModal`).checked = true;
                return
            }

            if (detail.hasAttribute("open")) {
                // since it's not closed yet, it's open!
                e.preventDefault(); // stop the default behavior, meaning - the hiding
                detail.classList.add("closing"); // add a class which apply the animation in CSS
                setTimeout(() => {
                    // only after the animation finishes, continue
                    detail.removeAttribute("open"); // close the element
                    detail.classList.remove("closing");
                }, 290);
            }
        });
    });
});

//listen for window resize event
window.addEventListener('resize', async function (event) {
    await resetEmbla();
});

// Carousel for section
async function createCarousel(sectionName) {
    const wrap = document.querySelector(`.embla[data-type="${sectionName}"]`);
    if (!wrap) return;
    const viewPort = wrap.querySelector(".embla__viewport");
    const container = viewPort.querySelector(".embla__container");
    const items = container.querySelectorAll(".embla__slide");
    if (items.length < 1) return;
    const dots = wrap.parentElement.querySelector(".embla__dots");

    let item = items[0];
    let itemWidth = item.getBoundingClientRect().width;
    let slidesToScrollAmount = viewPort.getBoundingClientRect().width / itemWidth < 1 ? 1 : Math.floor(viewPort.getBoundingClientRect().width / itemWidth);

    if (dots.childNodes.length === Math.ceil(items.length / slidesToScrollAmount)) return;
    // console.log(`Slides to scroll: ${Math.ceil(items.length/slidesToScrollAmount)}\nCurrent slides to scroll: ${dots.childNodes.length}`);

    let options = {
        align: "start",
        loop: false,
        skipSnaps: false,
        slidesToScroll: slidesToScrollAmount,
    };
    let plugins = [
        // EmblaCarouselAutoplay()
    ]; // Plugins

    let embla = EmblaCarousel(viewPort, options, plugins);
    const dotsArray = generateDotBtns(dots, embla);
    const setSelectedDotBtn = selectDotBtn(dotsArray, embla);
    setupDotBtns(dotsArray, embla);

    embla.on("select", setSelectedDotBtn);
    embla.on("init", setSelectedDotBtn);
}

const setupDotBtns = (dotsArray, embla) => {
    dotsArray.forEach((dotNode, i) => {
        dotNode.addEventListener("click", () => embla.scrollTo(i), false);
    });
};

const generateDotBtns = (dots, embla) => {
    const template = document.getElementById("embla-dot-template").innerHTML;
    dots.innerHTML = embla.scrollSnapList().reduce((acc) => acc + template, "");
    return [].slice.call(dots.querySelectorAll(".embla__dot"));
};

const selectDotBtn = (dotsArray, embla) => () => {
    const previous = embla.previousScrollSnap();
    const selected = embla.selectedScrollSnap();
    dotsArray[previous].classList.remove("is-selected");
    dotsArray[selected].classList.add("is-selected");
};

async function createGameSession(button) {
    let sessionObjectiveElement = document.querySelector('#session_objective')
    let sessionLocationElement = document.querySelector('#session_location')
    let sessionDateElement = document.querySelector('#session_date')
    let sessionPartyElements = document.querySelectorAll('span.custom-option.selected')

    setTimeout(() => {
        try {
            axios.post(`/dashboard/${guildID}/informational/sessions/create`, {
                session_objective: sessionObjectiveElement.value?.trim(),
                session_date_text: sessionDateElement.value?.trim(),
                session_location: sessionLocationElement.value?.trim(),
                session_party: Array.from(sessionPartyElements).map((element) => element.getAttribute('data-value')),
            }).then((response) => {
                if (response.status === 200) {
                    //Close the "Create Session" modal
                    toggleModal('create')

                    //Put the new element in the "Requested" section
                    getSectionCarousel("requested").appendChild(createElementFromHTML(response.data.HTMLElement))

                    //Unfold the section
                    getSectionSummary("requested").parentNode.open = true;

                    //Update the counter(s)
                    updateCounter(["requested"])

                    //Update the next session date per section
                    updateNextSessionDate();

                    //Notify the end-user
                    pushNotify("success", "Session created", response.data.message);
                }
            }).catch((error) => {
                pushNotify("error", "Session not created", error.response.data.message);
            });
        } catch (error) {
            console.log(error);
            console.log("error occured during creation of session: " + button);
        }
    }, 250);
}

async function approveGameSession(gameSessionElement) {
    setTimeout(() => {
        try {
            axios
                .put(`/dashboard/${guildID}/informational/sessions/approve`, {
                    gameSessionID: gameSessionElement.id,
                })
                .then((response) => {
                    if (response.status === 200) {
                        //Delete current element
                        gameSessionElement.parentNode.remove()

                        //Put the new element in the "Planned" section
                        getSectionCarousel("planned").appendChild(createElementFromHTML(response.data.HTMLElement));

                        //Update the counter(s)
                        updateCounter(["planned", "requested"])

                        //Reset Embla (Carousel)
                        resetEmbla();

                        //Update the next session date per section
                        updateNextSessionDate();

                        //Notify the end-user
                        pushNotify("success", "Session approved", response.data.message);
                    }
                }).catch((error) => {
                    pushNotify("error", "Session not approved", error.response.data.message);
                });
        } catch (error) {
            console.log(
                "error occured during edit of session: " + gameSessionElement.id
            );
        }
    }, 250);
}

async function declineGameSession(gameSessionElement) {
    setTimeout(() => {
        try {
            axios
                .put(`/dashboard/${guildID}/informational/sessions/decline`, {
                    gameSessionID: gameSessionElement.id,
                })
                .then((response) => {
                    if (response.status === 200) {
                        //Delete current element
                        gameSessionElement.parentNode.remove()

                        //Update the counter(s)
                        updateCounter(["requested"])

                        //Reset Embla (Carousel)
                        resetEmbla();

                        //Update the next session date per section
                        updateNextSessionDate();

                        //Notify the end-user
                        pushNotify("success", "Session declined", response.data.message);
                    }
                }).catch((error) => {
                    pushNotify("error", "Session not declined", error.response.data.message);
                });;
        } catch (error) {
            console.log(
                "error occured during decline of session: " + gameSessionElement.id
            );
        }
    }, 250);
}

async function joinGameSession(gameSessionElement, userID = null) {
    console.log(gameSessionElement);
    console.log(userID);

    setTimeout(() => {
        try {
            console.log(guildID);
            axios
                .put(`/dashboard/${guildID}/informational/sessions/join`, {
                    gameSessionID: gameSessionElement.id,
                    userID: userID,
                })
                .then((response) => {
                    console.log(response);
                    if (response.status === 200) {
                        // updateSessionRequestToPlannedSession(gameSessionElement, response.data)
                        // if (userID) {
                        //     const USER_LIST = gameSessionElement.querySelector("#userList");
                        //     let comma = document.createElement("span");
                        //     comma.textContent = ", ";
                        //     let user = document.createElement("span");
                        //     user.classList.add("user");
                        //     //TODO: Change later to use username
                        //     user.textContent = `@${response.data.session_party[
                        //         response.data.session_party.length - 1
                        //     ]
                        //         }`;

                        //     USER_LIST.parentNode.querySelector(
                        //         "h5"
                        //     ).textContent = `Players (${response.data.session_party.length}/5)`;

                        //     USER_LIST.insertBefore(comma, USER_LIST.lastChild);
                        //     USER_LIST.insertBefore(user, USER_LIST.lastChild);

                        //     // Remove 'Add Player' button
                        //     if (response.data.session_party.length >= 5) {
                        //         USER_LIST.removeChild(USER_LIST.lastChild);
                        //     }
                        // }

                        pushNotify("success", "Session join", response.data.message);
                    }
                }).catch((error) => {
                    pushNotify("error", "Session not joined", error.response.data.message);
                });;
        } catch (error) {
            console.log(
                "error occured during join of session: " + gameSessionElement.id
            );
        }
    }, 250);
}

async function updateGameSessionStatus(gameSessionElement, status) {
    console.log(gameSessionElement.id);
    console.log(status);
    setTimeout(() => {
        try {
            axios
                .put(`/dashboard/${guildID}/informational/sessions/update`, {
                    gameSessionID: gameSessionElement.id,
                    sessionStatus: status,
                })
                .then((response) => {
                    if (response.status === 200) {
                        //Delete current element
                        gameSessionElement.parentNode.remove()

                        //Put the new element in the "Planned" section
                        getSectionCarousel("past").appendChild(createElementFromHTML(response.data.HTMLElement));

                        //Update the counter(s)
                        updateCounter(["planned", "past"])

                        //Reset Embla (Carousel)
                        resetEmbla();

                        //Update the next session date per section
                        updateNextSessionDate();

                        //Notify the end-user
                        pushNotify("success", "Session status updated", response.data.message);
                    }
                }).catch((error) => {
                    pushNotify("error", "Session status not updated", error.response.data.message);
                });
        } catch (error) {
            console.log(
                "error occured during edit of session: " + gameSessionElement.id
            );
        }
    }, 250);
}

function updateInput(input) {
    // let characterCountElement = input.parentNode.querySelector('p.characterCount');
    // // let maxCharacterCount = parseInt(input.parentNode.querySelector('p.maxCharacterCount').innerText);
    // characterCountElement.innerText = input.value.length;
    checkIfFormIsReady(
        input.parentNode.parentNode.querySelector("#session_objective"),
        input.parentNode.parentNode.querySelector("#session_location"),
        input.parentNode.parentNode.querySelector("#session_date")
    );
}

function checkIfFormIsReady(objectiveElement, locationElement, dateElement) {
    // let priority = priorityElement?.getAttribute('data-value');
    let date = dateElement.value?.trim();
    // let location = locationElement.value?.trim();
    let objective = objectiveElement.value?.trim();

    if (
        date != undefined && date != null && date !== "" && objective != undefined && objective != null && objective !== ""
    ) {
        objectiveElement.parentNode.parentNode.parentNode.parentNode.querySelector('.modal-footer input[type="button"]').removeAttribute("disabled");
    } else {
        objectiveElement.parentNode.parentNode.parentNode.parentNode.querySelector('.modal-footer input[type="button"]').setAttribute("disabled", "true");
    }
}



function createUserDisplayElement(user = { id: undefined, username: undefined, avatarURL: undefined }) {
    let userDisplay = document.createElement("div");
    userDisplay.classList.add("userDisplay");
    // userDisplay.classList.add("unlocked");
    userDisplay.setAttribute("data-user-id", user.id);
    let userAvatarWrapper = document.createElement("div");
    userAvatarWrapper.classList.add("userAvatarWrapper");
    userDisplay.appendChild(userAvatarWrapper);
    let userDisplayImage = document.createElement("img");
    userDisplayImage.alt = "User Avatar";
    userDisplayImage.src = user?.avatarURL || 'test';
    userAvatarWrapper.appendChild(userDisplayImage);
    let userDisplayName = document.createElement("p");
    userDisplayName.classList.add("userName");
    userDisplayName.textContent = user?.username || "User Name";
    userDisplay.appendChild(userDisplayName);
    return userDisplay;
}

function toggleModal(action) {
    const modal = document.querySelector(`input[action="${action}"]`);
    modal.checked = !modal.checked;
}

function getSectionCarousel(section = "") {
    return document.querySelector(`.embla[data-type="${section}"] .embla__container`);
}

function getSectionSummary(section = "") {
    return document.querySelector(`summary[data-type="${section}"]`);

}

function updateCounter(sections = ["requested", "planned", "past"]) {
    for (const section of sections) {
        let counterElement = document.querySelector(`summary[data-type="${section}"] span.count`);
        counterElement.textContent = getSectionCarousel(section).childElementCount;
    }
}

async function resetEmbla() {
    for (const key in sections) {
        if (Object.hasOwnProperty.call(sections, key)) {
            const section = sections[key];
            await createCarousel(section);
        }
    }
}

function updateNextSessionDate() {
    for (const key in sections) {
        if (Object.hasOwnProperty.call(sections, key)) {
            const section = sections[key];
            let nextDate = getSectionCarousel(section).firstElementChild.querySelector('code').textContent;
            getSectionSummary(section).setAttribute('data-session-date', nextDate ? nextDate : 'No data');
        }
    }
}