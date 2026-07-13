document.addEventListener('DOMContentLoaded', function () {

    const radios = document.querySelectorAll('input[name="AgeCategory"]');

    const formMap = {
        'adult':  'adult-form',
        'ochild': 'older-child-form',
        'ychild': 'young-child-form'
    };

    // safety check — warn immediately if any form div is missing
    Object.values(formMap).forEach(id => {
        if (!document.getElementById(id)) {
            console.warn(`Triage: form div #${id} not found in DOM. Check partial view id attributes.`);
        }
    });

    if (radios.length === 0) {
        console.warn('Triage: no radio buttons found with name="AgeCategory".');
        return;
    }

    radios.forEach(radio => {
        radio.addEventListener('click', function () {

            // hide all forms first
            document.querySelectorAll('.age-form').forEach(form => {
                form.hidden = true;
            });

            // show only the matching form
            const targetId = formMap[this.value];

            if (!targetId) {
                console.warn(`Triage: no form mapped for value "${this.value}".`);
                return;
            }

            const targetForm = document.getElementById(targetId);

            if (!targetForm) {
                console.warn(`Triage: form div #${targetId} not found.`);
                return;
            }

            targetForm.hidden = false;
        });
    });

});