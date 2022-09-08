const sections = ["requested", "planned", "past"];

document.addEventListener("DOMContentLoaded", async function () {
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
        element.addEventListener("click", function (e) {
            // e.preventDefault();
            console.log(`Add Player`);
        });
    });

    // const details = document.querySelectorAll("details");
    const summaries = document.querySelectorAll("summary");
    summaries.forEach((summary) => {
        const detail = summary.parentNode;
        summary.addEventListener("click", function (e) {
            if (e.target.id === null || e.target.id === "") return;
            if (e.target.id === "createSessionRequest")
                return (document.querySelector(`#createSessionModal`).checked = true);

            console.log("test");
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

// Carousel for section
async function createCarousel(sectionName) {
    const wrap = document.querySelector(`.embla[data-type="${sectionName}"]`);
    if (!wrap) return;

    const viewPort = wrap.querySelector(".embla__viewport");
    const container = viewPort.querySelector(".embla__container");
    const items = container.querySelectorAll(".embla__slide");
    if (!(items.length >= 1)) return;
    const dots = wrap.parentElement.querySelector(".embla__dots");

    var options = {
        align: "start",
        loop: false,
        skipSnaps: false,
        slidesToScroll: 5,
    };
    var plugins = [
        // EmblaCarouselAutoplay()
    ]; // Plugins

    var embla = EmblaCarousel(viewPort, options, plugins);
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

function addUsernamesToElement(users, element) {
    for (const user of users) {
        if (users.length > 1) {
            const COMMA = document.createElement("span");
            COMMA.textContent = ", ";
            element.insertBefore(COMMA, element.lastChild);
        }
        const USERNAME = document.createElement("span");
        USERNAME.classList.add("user");
        USERNAME.textContent = `@${user.username}`;

        element.insertBefore(USERNAME, element.lastChild);
    }
}

async function createGameSession(button) {
    let sessionObjectiveElement = document.querySelector('#session_objective')
    let sessionLocationElement = document.querySelector('#session_location')
    let sessionDateElement = document.querySelector('#session_date')

    // const USER_ARRAY = [{ username: "test" }, { username: "test2" }, { username: "test3" }];

    // let clonedElement = document.querySelector(`.embla[data-type="requested"] .embla__slide`)?.cloneNode(true);
    // console.log(clonedElement);

    // let requestedSessionsContainer = document.querySelector(`.embla[data-type="requested"] .embla__container`)
    // clonedElement.querySelector('.slideItem').id = "Test"
    // clonedElement.querySelector('.addPlayer').setAttribute("onclick", `joinGameSession(Test, '241273372892200963')`)
    // clonedElement.querySelector('#userList').parentNode.querySelector('h5').textContent = `Players (${USER_ARRAY.length}/5)`
    // addUsernamesToElement(USER_ARRAY, clonedElement.querySelector('#userList'))
    // addUsernamesToElement([USER_ARRAY[0]], clonedElement.querySelector('.sessionCommander'))
    // requestedSessionsContainer.append(clonedElement);

    setTimeout(() => {
        try {
            axios.post(`/dashboard/${guildID}/informational/sessions/create`, {
                session_objective: sessionObjectiveElement.value?.trim(),
                session_date_text: sessionDateElement.value?.trim(),
                session_location: sessionLocationElement.value?.trim(),
            }).then((response) => {
                if (response.status === 200) {
                    console.log(response);

                    let requestedSessionCounter = document.querySelector(`summary[data-type="requested"] span.count`);
                    requestedSessionCounter.textContent = parseInt(requestedSessionCounter.textContent) + 1;

                    // Add embed, close modal

                    pushNotify("success", "Session created", response.data.message);
                }
            }).catch((error) => {
                pushNotify("error", "Session not created", error.response.data);
            });
        } catch (error) {
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
                        updateSessionRequestToPlannedSession(
                            gameSessionElement,
                            response.data
                        );
                        pushNotify("success", "Session approved", response.data.message);
                    }
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
                        gameSessionElement.parentNode.removeChild(gameSessionElement);
                        let countElement = document.querySelector(
                            `summary[data-type="requested"] span.count`
                        );
                        let count = parseInt(countElement.textContent) - 1;
                        countElement.textContent = count;
                        pushNotify("success", "Session declined", response.data.message);
                    }
                });
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
                        if (userID) {
                            const USER_LIST = gameSessionElement.querySelector("#userList");
                            let comma = document.createElement("span");
                            comma.textContent = ", ";
                            let user = document.createElement("span");
                            user.classList.add("user");
                            //TODO: Change later to use username
                            user.textContent = `@${response.data.session_party[
                                response.data.session_party.length - 1
                            ]
                                }`;

                            USER_LIST.parentNode.querySelector(
                                "h5"
                            ).textContent = `Players (${response.data.session_party.length}/5)`;

                            USER_LIST.insertBefore(comma, USER_LIST.lastChild);
                            USER_LIST.insertBefore(user, USER_LIST.lastChild);

                            // Remove 'Add Player' button
                            if (response.data.session_party.length >= 5) {
                                USER_LIST.removeChild(USER_LIST.lastChild);
                            }
                        }

                        pushNotify("success", "Session join", response.data.message);
                    }
                })
                .catch((error) => {
                    pushNotify("error", "Session join", error.response.data);
                });
        } catch (error) {
            console.log(
                "error occured during join of session: " + gameSessionElement.id
            );
        }
    }, 250);
}

function updateSessionRequestToPlannedSession(
    gameSessionElement,
    gameSessionData
) {
    const PLANNED_SESSION_CONTAINER = document.querySelector(
        `.embla[data-type="planned"] .embla__container`
    );
    let dungeonMasterField = gameSessionElement.querySelector(
        `p.embedFieldValue[data-attribute="DM"]`
    );
    dungeonMasterField.classList.remove("italic");
    dungeonMasterField.textContent = "";
    let dungeonMasterEl = document.createElement("span");
    dungeonMasterEl.classList.add("user");
    dungeonMasterEl.textContent = `@${gameSessionData.dungeon_master_id_discord.nickname}`;
    dungeonMasterField.appendChild(dungeonMasterEl);

    gameSessionElement.querySelector(
        `h4`
    ).textContent = `Session ${gameSessionData.session_number}`;

    PLANNED_SESSION_CONTAINER.appendChild(gameSessionElement.parentNode);
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
    // console.log()
    // let priority = priorityElement?.getAttribute('data-value');
    let date = dateElement.value?.trim();
    // let location = locationElement.value?.trim();
    let objective = objectiveElement.value?.trim();

    // console.log(objective, location, date)

    if (
        date != undefined && date != null && date !== "" && objective != undefined && objective != null && objective !== ""
    ) {
        objectiveElement.parentNode.parentNode.querySelector('input[type="button"]').removeAttribute("disabled");
    } else {
        objectiveElement.parentNode.parentNode.querySelector('input[type="button"]').setAttribute("disabled", "true");
    }
}