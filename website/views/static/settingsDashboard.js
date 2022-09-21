document.addEventListener("DOMContentLoaded", function () {
    disabled_cmd.forEach(cmd_name => {
        let element = document.querySelector(`#${cmd_name}-checkbox`);
        if (element != null && element != undefined) element.checked = false;
        // console.log(document.querySelector(`#${cmd_name}-checkbox`))
    })

    const startingCheckboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));
    const startingStatus = startingCheckboxes.map(checkbox => checkbox.checked);

    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    allCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const currentStatus = Array.from(document.querySelectorAll('input[type="checkbox"]')).map(checkbox => checkbox.checked);
            if (!equals(startingStatus, currentStatus)) {
                document.querySelector('.operationButtons').classList.add('show')
            } else {
                document.querySelector('.operationButtons').classList.remove('show')
            }
        })
    })
    document.querySelector('span.resetAction').addEventListener('click', function () {
        let currentStatus = document.querySelectorAll('input[type="checkbox"]');
        for (let index = 0; index < currentStatus.length; index++) {
            currentStatus[index].checked = startingStatus[index]
        }
        document.querySelector('.operationButtons').classList.remove('show')

    })
    document.querySelector(`input[id="save_settings"]`).addEventListener('click', function () {
        const disabled_commands = Array.from(document.querySelectorAll('input[type="checkbox"]')).filter(element => element.checked === false).map(setting => setting.id.split('-checkbox')[0]);
        const enabled_commands = Array.from(document.querySelectorAll('input[type="checkbox"]')).filter(element => element.checked === true).map(setting => setting.id.split('-checkbox')[0]);
        try {
            axios.put(`/dashboard/${guildID}/settings`, {
                "disabled_commands_array": disabled_commands,
                "enabled_commands_array": enabled_commands,

            }).then(response => {
                if (response.status === 201) {
                    console.log(`Changes saved succesfully`)
                    document.querySelector('.operationButtons').classList.remove('show')
                    window.location = window.location.href;
                } else {
                    console.log("Something went wrong!; ERROR STATUS: " + response.status);
                }
            })
        } catch (error) {
            console.log(error);
        }
    })
})

const equals = (a, b) =>
    a.length === b.length &&
    a.every((v, i) => v === b[i]);