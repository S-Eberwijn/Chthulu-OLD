document.addEventListener('DOMContentLoaded', (event) => {

    document.querySelector('.select-wrapper').addEventListener('click', function () {
        this.querySelector('.select').classList.toggle('open');
    })

    for (const option of document.querySelectorAll(".custom-option")) {
        option.addEventListener('click', function () {
            if (!this.classList.contains('selected')) {
                this.parentNode.querySelector('.custom-option.selected')?.classList.remove('selected');
                this.classList.add('selected');
                this.parentNode.parentNode.querySelector('.select_trigger span').textContent = this.textContent.replace('|', '').trim();

                checkIfFormIsReady(this, document.getElementById('quest_title'), document.getElementById('quest_description'));
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
        text = document.getElementById('quest_description').value;
        document.getElementById('quest_description').value = text.charAt(0).toUpperCase() + text.slice(1);
    });







    let globalIDstorage;

    // TESTING PURPOSES
    let count = 0;


    function handleDragStart(e) {
        this.style.opacity = '0.4';
        let quests = document.querySelectorAll('.questBox .questDiv.quest');
        quests.forEach(quest => {
            if (this != quest) {
                quest.style.pointerEvents = "none";
            }
        })
        document.getElementById("completedQuestsBox").style.pointerEvents = "all";
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', e.target.id);
        globalIDstorage = e.target.id;
    }

    function handleDragEnd(e) {
        this.style.opacity = '1';
        if (this.parentNode === document.getElementById("completedQuestsBox")) {
            this.style.pointerEvents = "none";
            let optionsElement = this.querySelector('.options');
            while (optionsElement.firstChild) {
                optionsElement.firstChild.remove()
            }

            // TESTING PURPOSES
            if (count % 3 === 0) {
                optionsElement.appendChild(createCompleteIcon())

            } else if (count % 3 === 1) {
                optionsElement.appendChild(createFailedIcon())

            } else {
                optionsElement.appendChild(createExpiredIcon())
            }
            count++;
        }

        let quests = document.querySelectorAll('#uncompletedQuestsBox .questDiv.quest');
        quests.forEach(quest => {
            quest.style.pointerEvents = "all";
        })

        questBoxes.forEach(function (item) {
            item.classList.remove('over');
        });
        document.getElementById("completedQuestsBox").style.pointerEvents = "none";
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        return false;
    }

    function handleDragEnter(e) {
        if (this !== document.getElementById("uncompletedQuestsBox")) {
            this.classList.add('over');
        }
    }

    function handleDragLeave(e) {
        if (this.classList.contains('over')) {
            this.classList.remove('over');
        }
    }
    function handleDrop(e) {
        e.stopPropagation();
        let draggedElement = document.getElementById(globalIDstorage)

        if (draggedElement !== this) {
            if (this === document.getElementById("uncompletedQuestsBox")) {
                draggedElement.classList.add("quest")
                this.insertBefore(draggedElement, document.getElementById("addNewQuestDiv"));
            } else {
                document.getElementById('uncompletedQuestsCount').innerHTML = `${parseInt(document.getElementById('uncompletedQuestsCount').innerHTML) - 1}`;
                document.getElementById('completedQuestsCount').innerHTML = `${parseInt(document.getElementById('completedQuestsCount').innerHTML) + 1}`;

                // draggedElement.classList.remove("quest")
                this.appendChild(draggedElement);
                // draggedElement.style.pointerEvents = "none";
            }
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

    document.getElementById('sortingIcon').addEventListener('click', function (e) {
        let sortingIcon = document.getElementById('sortingIcon')
        sortingIcon.classList.toggle('desc');

        let correctQuestBox = sortingIcon.parentNode.parentNode.nextSibling;
        let questsToSort = correctQuestBox.querySelectorAll('.questDiv.quest');

        let questToSortArray = Array.prototype.slice.call(questsToSort, 0);


        // Remove Quests
        questsToSort.forEach(quest => {
            quest.remove();
        });

        questToSortArray.reverse();

        // Add Sorted Quests
        questToSortArray.forEach(quest => {
            correctQuestBox.insertBefore(quest, correctQuestBox.querySelector('.addNewQuest'))
        })
    })
});

function createCompleteIcon() {
    // <i class="far fa-check-circle"></i>
    let completedIcon = document.createElement("i");
    completedIcon.classList = 'far fa-check-circle';
    completedIcon.style.color = "lightgreen";
    completedIcon.style.width = "16px";
    completedIcon.style.height = "16px";
    return completedIcon;
}

function createFailedIcon() {
    // <i class="fas fa-times"></i>
    let failedIcon = document.createElement("i");
    failedIcon.classList = 'fas fa-times';
    failedIcon.style.color = "red";
    failedIcon.style.width = "16px";
    failedIcon.style.height = "16px";
    return failedIcon;
}

function createExpiredIcon() {
    // <i class="far fa-clock"></i>
    let expiredIcon = document.createElement("i");
    expiredIcon.classList = 'far fa-clock';
    expiredIcon.style.color = "orange";
    expiredIcon.style.width = "16px";
    expiredIcon.style.height = "16px";
    return expiredIcon;
}

function createChevronIcon() {
    // <i class="far fa-clock"></i>
    let chevronIcon = document.createElement("i");
    chevronIcon.classList = 'fas fa-chevron-up';
    return chevronIcon;
}

function sortingChanged(sortingSelector) {
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

    // Remove Quests
    questsToSort.forEach(quest => {
        quest.remove();
    });

    if (document.getElementById('sortingIcon').classList.contains('desc')) {
        questToSortArray.reverse();
    }

    // Add Sorted Quests
    questToSortArray.forEach(quest => {
        correctQuestBox.insertBefore(quest, correctQuestBox.querySelector('.addNewQuest'))
    })
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
    let characterCountElement = input.parentNode.querySelector('p.characterCount');
    // let maxCharacterCount = parseInt(input.parentNode.querySelector('p.maxCharacterCount').innerText);

    characterCountElement.innerText = input.value.length;

    checkIfFormIsReady(input.parentNode.parentNode.querySelector('.custom-option.selected'), document.getElementById('quest_title'), document.getElementById('quest_description'));

}


function checkIfFormIsReady(priorityElement, titleElement, descriptionElement) {
    let priority = priorityElement?.getAttribute('data-value');
    let title = titleElement.value?.trim();
    let description = descriptionElement.value?.trim();

    if ((priority != undefined && priority != null) && (title != undefined && title != null && title !== '')) {
        document.getElementById('create_quest').removeAttribute('disabled');
    } else {
        document.getElementById('create_quest').setAttribute('disabled', 'true');
    }
}

function createQuest(buttonElement) {
    let priority = document.querySelector('.custom-option.selected')?.getAttribute('data-value');
    let title = document.getElementById('quest_title')?.value?.trim();
    let description = document.getElementById('quest_description')?.value?.trim();

    buttonElement.value = '';
    document.querySelector(`.createButton>i.fa-spinner`).classList.add('active')
    buttonElement.setAttribute('disabled', 'true')

    console.log(`Clicking "Create"-button`)
    setTimeout(() => {
        try {
            axios.post(`/dashboard/${guildID}/informational/quests`, {
                "priority": priority,
                "title": title,
                "description": description,
            }).then(response => {
                if (response.status === 201) {
                    console.log(`Creation of quest complete`)
                    window.location = './quests'
                } else {
                    console.log("Something went wrong!; ERROR STATUS: " + response.status);
                }
            })
        } catch (error) {
            console.log("error occured during create");
        };
    }, 250);

}

function deleteQuest(trashElement) {
    let questElement = trashElement.parentNode.parentNode;
    let quest_id = questElement.getAttribute('id');
    uncompletedQuestsCount.innerText = uncompletedQuestsCount.innerText - 1
    console.log(quest_id)

    try {
        axios.delete(`/dashboard/${guildID}/informational/quests`, { data: { 'quest_id': quest_id } }).then(response => {
            if (response.status === 201) {
                questElement.remove();
            }
        })
    } catch (error) {
        console.log("error occured during delete");
    };
}