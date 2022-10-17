// TODO: BUG WHEN QUESTS ARE CREATED - CANNOT BE MOVED
// TODO: BUG WHEN QUESTS ARE CREATED OR EDITED - DOES NOT SHOW CREATION DATE
// TODO: BUG WHEN QUESTS DESCRIPTION IS BIG - OVERFLOW

const fadeAnimationDuration = 200;
let globalIDstorage;

let globalQuestID;
document.addEventListener('DOMContentLoaded', () => {
    //Edit to use multiple custom select boxes
    document.querySelectorAll('.modal .select-wrapper').forEach(element => {
        element.addEventListener('click', function () {
            this.querySelector('.select').classList.toggle('open');
        })
    })
    // document.querySelector('.modal[action="edit"] .select-wrapper').addEventListener('click', function () {
    //     this.querySelector('.select').classList.toggle('open');
    // })

    for (const option of document.querySelectorAll(".custom-option")) {
        option.addEventListener('click', function () {
            if (!this.classList.contains('selected')) {
                this.parentNode.querySelector('.custom-option.selected')?.classList.remove('selected');
                this.classList.add('selected');
                this.parentNode.parentNode.querySelector('.select_trigger span').textContent = this.textContent.replace('|', '').trim();
                checkIfFormIsReady(this, this.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('input[type="text"]'), this.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('textarea'));
            }
        })
    }

    window.addEventListener('click', function (e) {
        const select = document.querySelector('.select')
        if (!select.contains(e.target)) {
            select.classList.remove('open');
        }
    });

    document.getElementById('quest_description').addEventListener('input', () => {
        let text = document.getElementById('quest_description').value;
        document.getElementById('quest_description').value = text.charAt(0).toUpperCase() + text.slice(1);
    });

    //?? could these methods be moved outside the top-level method (upto line 160), not sure if posible that's why I didnt try yet
    function handleDragStart(e) {
        this.style.opacity = '0.4';

        document.getElementById("completedQuestsBox").style.pointerEvents = "all";
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', e.target.id);
        globalIDstorage = e.target.id;
        globalQuestID = e.target.id;
        // console.log(globalQuestID)
    }

    function handleDragEnd(e) {
        // Does not get executed right now, due to new modal showing
        // TODO add this to statusChangedQuest()
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        return false;
    }

    function handleDragEnter() {
        if (this !== document.getElementById("uncompletedQuestsBox")) {
            this.classList.add('over');
        }
    }

    function handleDragLeave() {
        if (this.classList.contains('over')) {
            this.classList.remove('over');
        }
    }
    function handleDrop(e) {
        e.stopPropagation();
        let draggedElement = document.getElementById(globalIDstorage)

        if (draggedElement !== this) {
            if (this === document.getElementById("uncompletedQuestsBox")) {
                // draggedElement.classList.add("quest")
                // this.insertBefore(draggedElement, document.getElementById("addNewQuestDiv"));
            } else {
                document.querySelector('input[action="status"]').checked = true;
            }
            questBoxes.forEach(function (item) {
                item.classList.remove('over');
            });
        }
        return false;
    }
    let quests = document.querySelectorAll('#uncompletedQuestsBox .questDiv.quest');
    quests.forEach(function (quest) {
        if (quest.querySelector('span.description')) {
            quest.classList.add('expandable');
            let currentHeight = quest.getBoundingClientRect().height - 4;
            if (quest.querySelector('span.description').offsetHeight > 23) {
                quest.querySelector('p.title').appendChild(createChevronIcon())
            }
            quest.addEventListener("mouseover", function (event) {
                if (quest.querySelector('i.fas.fa-chevron-up')) {
                    quest.style.minHeight = `${currentHeight + quest.querySelector('span.description').offsetHeight - 21}px`;
                    quest.querySelector('i.fas.fa-chevron-up').classList.add('rotateChevron')
                }
            }, false);
            quest.addEventListener("mouseleave", function (event) {
                if (quest.querySelector('i.fas.fa-chevron-up')) {
                    quest.style.minHeight = "50px";
                    quest.querySelector('i.fas.fa-chevron-up').classList.remove('rotateChevron')
                }
            }, false);

        } else {
            quest.classList.add('onlyTitle');
        }
        quest.setAttribute('draggable', 'true');
        quest.addEventListener('dragstart', handleDragStart);
        quest.addEventListener('dragend', handleDragEnd);
    });

    let questBoxes = document.querySelectorAll('.questBox');
    questBoxes.forEach(function (questBox) {
        questBox.addEventListener('dragover', handleDragOver);
        questBox.addEventListener('dragenter', handleDragEnter);
        questBox.addEventListener('dragleave', handleDragLeave);
        questBox.addEventListener('drop', handleDrop);
    });

    document.getElementById('sortingIcon').addEventListener('click', function () {

        let sortingIcon = document.getElementById('sortingIcon')
        sortingIcon.classList.toggle('desc');

        let correctQuestBox = sortingIcon.parentNode.parentNode.nextSibling;
        let questsToSort = correctQuestBox.querySelectorAll('.questDiv.quest');

        let questToSortArray = Array.prototype.slice.call(questsToSort, 0);


        // Remove Quests
        questsToSort.forEach(quest => {
            quest.style.animationName = 'fadeOut';
            setTimeout(() => {
                quest.remove();
            }, fadeAnimationDuration)

        });
        setTimeout(() => {
            questToSortArray.reverse();

            // Add Sorted Quests
            questToSortArray.forEach(quest => {
                correctQuestBox.insertBefore(quest, correctQuestBox.querySelector('.addNewQuest'))
            })
            correctQuestBox.querySelectorAll('.questDiv.quest').forEach(quest => {
                quest.style.animationName = 'fadeIn';
            })
        }, fadeAnimationDuration)

    })
});


function createChevronIcon() {
    // <i class="far fa-clock"></i>
    let chevronIcon = document.createElement("i");
    chevronIcon.classList = 'fas fa-chevron-up';
    return chevronIcon;
}

function sortingChanged(sortingSelector) {
    //TODO: Apply same thing as with sortingIcon (fadeIn and Out)
    let sortingMethod = sortingSelector.value;

    let correctQuestBox = sortingSelector.parentNode.parentNode.nextSibling;
    let questsToSort = correctQuestBox.querySelectorAll('.questDiv.quest');

    let questToSortArray = Array.prototype.slice.call(questsToSort, 0);

    if (sortingMethod === "importance") {
        //Importance Value
        questToSortArray.sort(function (a, b) {
            a = a.attributes[2].nodeValue.valueOf()
            b = b.attributes[2].nodeValue.valueOf()
            return a - b;
        })
    } else if (sortingMethod === "started") {
        //Start Date Value
        questToSortArray.sort(function (a, b) {
            a = new Date(a.attributes[3].nodeValue).valueOf()
            b = new Date(b.attributes[3].nodeValue).valueOf()
            return a - b;
        })
    } else if (sortingMethod === "alphabetical") {
        //Start Date Value
        questToSortArray.sort(function (a, b) {
            if (a.querySelector('p.title').childNodes[0].textContent.trim() < b.querySelector('p.title').childNodes[0].textContent.trim()) { return -1; }
            if (a.querySelector('p.title').childNodes[0].textContent.trim() > b.querySelector('p.title').childNodes[0].textContent.trim()) { return 1; }
            return 0;
        })
    }



    if (document.getElementById('sortingIcon').classList.contains('desc')) {
        questToSortArray.reverse();
    }



    // Remove Quests
    questsToSort.forEach(quest => {
        quest.style.animationName = 'fadeOut';
        setTimeout(() => {
            quest.remove();
        }, fadeAnimationDuration)

    });
    setTimeout(() => {
        questToSortArray.reverse();

        // Add Sorted Quests
        questToSortArray.forEach(quest => {
            correctQuestBox.insertBefore(quest, correctQuestBox.querySelector('.addNewQuest'))
        })
        correctQuestBox.querySelectorAll('.questDiv.quest').forEach(quest => {
            quest.style.animationName = 'fadeIn';
        })
    }, fadeAnimationDuration)
}

function searchQuest(searchBar) {
    let searchValue = searchBar.value.toLowerCase();
    let correctQuestBox = searchBar.parentNode.nextSibling;
    let questsToSort = correctQuestBox.querySelectorAll('.questDiv.quest');

    let filteredQuests = Array.prototype.slice.call(questsToSort).filter(quest => quest.querySelector('p.title').childNodes[0].textContent.trim().toLowerCase().includes(searchValue) || quest.querySelector('span.description')?.innerHTML.toLowerCase().includes(searchValue));

    // Hide Other Quests
    questsToSort.forEach(quest => {
        quest.style.display = 'none';
        if (filteredQuests.includes(quest)) {
            quest.style.display = 'flex';
        }
    })
}

function updateInput(input) {
    checkIfFormIsReady(
        input.parentNode.parentNode.querySelector('.custom-option.selected'),
        input.parentNode.parentNode.querySelector('input[type="text"]'),
        input.parentNode.parentNode.querySelector('textarea')
    );
}


function checkIfFormIsReady(priorityElement, titleElement, descriptionElement) {
    let priority = priorityElement?.getAttribute('data-value');
    let title = titleElement.value?.trim();

    if ((priority != undefined && priority != null) && (title != undefined && title != null && title !== '')) {
        titleElement.parentNode.parentNode.parentNode.parentNode.querySelector('.modal-footer input[type="button"]').removeAttribute('disabled');
    } else {
        titleElement.parentNode.parentNode.parentNode.parentNode.querySelector('.modal-footer input[type="button"]').setAttribute('disabled', 'true');
    }
}

function createQuest(buttonElement) {
    let priority = document.querySelector('.modal .custom-option.selected')?.getAttribute('data-value');
    let title = document.getElementById('quest_title')?.value?.trim();
    let description = document.getElementById('quest_description')?.value?.trim();

    buttonElement.value = '';
    buttonElement.parentNode.querySelector(`i.fa-spinner`).classList.add('active')
    buttonElement.setAttribute('disabled', 'true')

    setTimeout(() => {
        try {
            axios.post(`/dashboard/${guildID}/informational/quests`, {
                "priority": priority,
                "title": title,
                "description": description,
            }).then(response => {
                if (response.status === 200) {
                    toggleModal("create")
                    // Reset createQuestModal
                    let selectDiv = document.querySelector(`#addNewQuestDiv .select`)
                    selectDiv.querySelector(`.custom-option.selected`).classList.remove('selected');
                    selectDiv.querySelector(`#quest_priority`).textContent = 'Select a priority';

                    document.querySelector(`#quest_title`).value = '';
                    updateInput(document.querySelector(`#quest_title`))

                    document.querySelector(`#quest_description`).value = '';
                    updateInput(document.querySelector(`#quest_description`))

                    
                    let uncompletedQuestsBox = document.querySelector('.questBox[id="uncompletedQuestsBox"]');
                    uncompletedQuestsBox.insertBefore(createElementFromHTML(response.data.HTMLElement), uncompletedQuestsBox.childNodes[uncompletedQuestsBox.childNodes.length - 1])

                    let uncompletedQuestCountElement = document.querySelector(`#uncompletedQuestsCount`);
                    uncompletedQuestCountElement.textContent = parseInt(uncompletedQuestCountElement.textContent) + 1;

                    pushNotify('success', 'Quest created', 'The quest has been successfully created.');
                } else {
                    console.log("Something went wrong!; ERROR STATUS: " + response.status);
                }
            })
        } catch (error) {
            console.log("error occured during create");
        }
        buttonElement.value = 'Create';
        buttonElement.parentNode.querySelector(`i.fa-spinner`).classList.remove('active')
        buttonElement.removeAttribute('disabled')

    }, 250);

}

function editQuest(buttonElement) {
    let questElement = document.querySelector(`.quest[id="${globalQuestID}"]`);

    let priority = document.querySelector('.modal[action="edit"] .custom-option.selected')?.getAttribute('data-value');
    let title = document.getElementById('edit_quest_title')?.value?.trim();
    let description = document.getElementById('edit_quest_description')?.value?.trim();

    buttonElement.value = '';
    buttonElement.parentNode.querySelector(`i.fa-spinner`).classList.add('active')
    buttonElement.setAttribute('disabled', 'true')

    setTimeout(() => {
        try {
            axios.put(`/dashboard/${guildID}/informational/quests`, {
                "quest_id": questElement.getAttribute('id'),
                "priority": priority,
                "title": title,
                "description": description
            }).then(response => {
                if (response.status === 201 || response.status === 200) {
                    let uncompletedQuestsBox = document.querySelector('.questBox[id="uncompletedQuestsBox"]');
                    uncompletedQuestsBox.insertBefore(createElementFromHTML(response.data.HTMLElement), questElement)
                    questElement.remove();
                    toggleModal('edit');
                    pushNotify('success', 'Quest edited', 'The quest has been edited successfully.');
                }
            }).catch((err) => {
                console.log(err)
                pushNotify('error', 'Quest edited', 'Something went wrong!')

            })
        } catch (error) {
            console.log("error occured during edit of quest: " + globalQuestID);
        }
        buttonElement.parentNode.querySelector(`i.fa-spinner`).classList.remove('active')
        buttonElement.removeAttribute('disabled')
        buttonElement.value = 'Edit';

    }, 250);
}

function deleteQuest(buttonElement) {
    let questElement = document.querySelector(`.quest[id="${globalQuestID}"]`);

    buttonElement.value = '';
    buttonElement.parentNode.querySelector(`i.fa-spinner`).classList.add('active')
    buttonElement.setAttribute('disabled', 'true')
    setTimeout(() => {
        try {
            axios.delete(`/dashboard/${guildID}/informational/quests`, { data: { 'quest_id': globalQuestID } }).then(response => {
                if (response.status === 200) {
                    toggleModal("delete");
                    questElement.remove();

                    let uncompletedQuestCountElement = document.querySelector(`#uncompletedQuestsCount`);
                    uncompletedQuestCountElement.innerText = uncompletedQuestCountElement.innerText - 1;
                    pushNotify('success', 'Quest removed', 'The quest has been removed successfully.');
                }
            })
        } catch (error) {
            console.log("error occured during delete");
        }
        buttonElement.value = 'Delete';
        buttonElement.parentNode.querySelector(`i.fa-spinner`).classList.remove('active')
        buttonElement.removeAttribute('disabled')
    }, 250);
}

async function statusChangeQuest(buttonValue) {
    let possibleOutcomes = ["done", "expired", "failed"]
    if (!possibleOutcomes.includes(buttonValue.toLowerCase())) console.log("Not in here");

    let questElement = document.querySelector(`.quest[id="${globalQuestID}"]`);

    setTimeout(() => {
        try {
            axios.put(`/dashboard/${guildID}/informational/quests`, { 'quest_id': globalQuestID, 'status': buttonValue.toUpperCase() }).then(response => {
                if (response.status === 200) {
                    toggleModal("status");
                    let completedQuestsBox = document.querySelector('.questBox[id="completedQuestsBox"]');
                    completedQuestsBox.appendChild(createElementFromHTML(response.data.HTMLElement))
                    questElement.remove();

                    let uncompletedQuestCountElement = document.querySelector(`#uncompletedQuestsCount`);
                    uncompletedQuestCountElement.textContent = parseInt(uncompletedQuestCountElement.textContent) - 1;

                    let completedQuestsCountElement = document.querySelector(`#completedQuestsCount`);
                    completedQuestsCountElement.textContent = parseInt(completedQuestsCountElement.textContent) + 1;
                }
            })
        } catch (error) {
            console.log(error)
            console.log("error occured during status update");
        }
    }, 250);
}

async function updateGlobalQuestId(iconElement) {
    let questElement = iconElement.parentNode.parentNode;
    globalQuestID = questElement.getAttribute('id');
    let quest_title = document.querySelector(`.quest[id="${globalQuestID}"] .questTitleDiv p.title`).childNodes[0].nodeValue;
    let quest_description = document.querySelector(`.quest[id="${globalQuestID}"] .questTitleDiv span.description`)?.textContent || '';
    if (iconElement.className.includes('trash')) {
        // console.log(`Delete "${document.querySelector(`.quest[id="${globalQuestID}"] .questTitleDiv p.title`).textContent.split('started')[0]}"?`)
        document.querySelector('p.questDeleteTitle').textContent = `Delete "${quest_title}"?`;
    } else if (iconElement.className.includes('edit')) {
        document.querySelector('input[id="edit_quest_title"]').value = quest_title;
        document.querySelector('textarea[id="edit_quest_description"]').value = quest_description;
        document.querySelector(`.modal[action="edit"] .custom-option[data-value="${document.querySelector(`.quest[id="${globalQuestID}"]`).getAttribute("quest_importance_value")}"]`).classList.add('selected')
        document.querySelector('.modal[action="edit"] .select_trigger span').textContent = document.querySelector(`.modal[action="edit"] .custom-option[data-value="${document.querySelector(`.quest[id="${globalQuestID}"]`).getAttribute("quest_importance_value")}"]`).textContent.replace('|', '').trim();

        // console.log(document.querySelector('input[id="edit_quest_title"]'))
    }
}


function toggleModal(action) {
    const modal = document.querySelector(`input[action="${action}"]`);
    modal.checked = !modal.checked;
    // modal.checked === true ? modal.checked = false : modal.checked = true;
}
 