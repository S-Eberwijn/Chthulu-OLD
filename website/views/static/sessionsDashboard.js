const sections = ["requested", "planned", "past"]



document.addEventListener("DOMContentLoaded", async function () {
    for (const key in sections) {
        if (Object.hasOwnProperty.call(sections, key)) {
            const section = sections[key];
            await createCarousel(section);
        }
    }

    // const details = document.querySelectorAll("details");
    const summaries = document.querySelectorAll("summary");
    summaries.forEach(summary => {
        const detail = summary.parentNode;
        summary.addEventListener("click", function (e) {
            if (detail.hasAttribute("open")) { // since it's not closed yet, it's open!
                e.preventDefault(); // stop the default behavior, meaning - the hiding
                detail.classList.add("closing"); // add a class which apply the animation in CSS
                setTimeout(() => { // only after the animation finishes, continue
                    detail.removeAttribute("open"); // close the element
                    detail.classList.remove("closing");
                }, 300);
            }
        });
    })
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

    var options = { align: "start", loop: false, skipSnaps: false, slidesToScroll: 5 }
    var plugins = [
        // EmblaCarouselAutoplay()
    ] // Plugins

    var embla = EmblaCarousel(viewPort, options, plugins)
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
    dots.innerHTML = embla.scrollSnapList().reduce(acc => acc + template, "");
    return [].slice.call(dots.querySelectorAll(".embla__dot"));
};

const selectDotBtn = (dotsArray, embla) => () => {
    const previous = embla.previousScrollSnap();
    const selected = embla.selectedScrollSnap();
    dotsArray[previous].classList.remove("is-selected");
    dotsArray[selected].classList.add("is-selected");
};

async function approveGameSession(gameSessionElement) {

    setTimeout(() => {
        try {
            axios.put(`/dashboard/${guildID}/informational/sessions`, {
                "gameSessionID": gameSessionElement.id,
            }).then(response => {
                if (response.status === 200) {
                    updateSessionRequestToPlannedSession(gameSessionElement, response.data)
                    pushNotify('success', 'Session approved', response.data.message);
                    //TODO: Move & Edit gameSessionElement to 'Planned' section
                }
            })
        } catch (error) {
            console.log("error occured during edit of session: " + gameSessionElement.id);
        };

    }, 250);
}

function updateSessionRequestToPlannedSession(gameSessionElement, gameSessionData) {
    const PLANNED_SESSION_CONTAINER = document.querySelector(`.embla[data-type="planned"] .embla__container`);
    let dungeonMasterField = gameSessionElement.querySelector(`p.embedFieldValue[data-attribute="DM"]`)
    dungeonMasterField.classList.remove("italic")
    dungeonMasterField.textContent = '';
    let dungeonMasterEl = document.createElement("span")
    dungeonMasterEl.classList.add("user")
    dungeonMasterEl.textContent = `@${gameSessionData.dungeon_master_id_discord.nickname}`;
    dungeonMasterField.appendChild(dungeonMasterEl);

    gameSessionElement.querySelector(`h4`).textContent = `Session ${gameSessionData.session_number}`;

    PLANNED_SESSION_CONTAINER.appendChild(gameSessionElement.parentNode);
}

