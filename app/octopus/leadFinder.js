const findLeadBtn = document.getElementById('findLead');
const showMoreLeadBtn = document.getElementById('leadShowmore');
const nicheField = document.getElementById('niche');
const cityField = document.getElementById('city');

// State of the APP
state = {
    niche: '',
    city: '',
    foundEmails: [],
    remainingEmails: []
}

// This function take url and p value and make search for emails
async function findLeads(niche, location) {
    const devUrl = 'https://leadmehome.io/api/lead/betterfindlead';

    try {
        const res = await axios.post(devUrl, { niche: niche, city: location });

        leadFinderView.clearLoader();

        if (res.data.data.length !== 0) {
            var emailsThatWhereFound = res.data.data[0].Results;

            var finalFoundEmails = [];
            if (emailsThatWhereFound.length !== 0) {
                for (var i = 0; i < emailsThatWhereFound.length; i++) {
                    finalFoundEmails.push(emailsThatWhereFound[i]);
                }
            } else {
                finalFoundEmails = []
            }

            // Sort Email list by number of emails
            var readyEmailList = this.sortEmails(finalFoundEmails);
            // Update state
            state.remainingEmails = readyEmailList;
            // Display results
            displayResults();

            // Add Event listener to export button
            leadEvent.addListenerToExport()
            // Add clipboard copy Listener
            leadEvent.addCopyListener();

        } else {
            // Not result found.
            leadFinderView.displayNoResultFoundMessage();
        }
    } catch (error) {
        console.log(error);
        leadFinderView.displayServerErrorMessage();
    }
}

// This function sort it basing on numbers of email per domains
sortEmails = (emailList) => {
    let sortedEmailList = [...emailList];
    for (var i = 0; i < sortedEmailList.length; i++) {
        var len1 = sortedEmailList[i].Emails.length; // Length of each email domain table
        for (var j = 0; j < sortedEmailList.length; j++) {
            var len2 = sortedEmailList[j].Emails.length; // Length of each email domain table
            if (len1 < len2) {
                let cache = sortedEmailList[i];
                sortedEmailList[i] = sortedEmailList[j];
                sortedEmailList[j] = cache;
            }
        }

    }
    sortedEmailList.reverse();
    return sortedEmailList;
}

displayResults = () => {
    let prevRemainingEmails = [...state.remainingEmails];
    let nPrev = prevRemainingEmails.length;

    let emailsToDisplay = [...state.foundEmails];

    if (nPrev > 10) {
        // If there are more than ten emails
        emailsToDisplay = emailsToDisplay.concat(prevRemainingEmails.slice(0, 10));
        let newRemainingEmails = prevRemainingEmails.slice(10);

        // Update state
        state.foundEmails = emailsToDisplay
        state.remainingEmails = newRemainingEmails

        // Display on the front
        leadFinderView.renderResults(emailsToDisplay);
        // Display Show more button
        leadFinderView.displayShowmoreBtn();

    } else {
        emailsToDisplay = emailsToDisplay.concat(prevRemainingEmails);

        // Update state
        state.foundEmails = emailsToDisplay
        state.remainingEmails = []

        // Display on the front
        leadFinderView.renderResults(emailsToDisplay);
        // Hide Show more button
        leadFinderView.hideShowmoreBtn();
    }
    // Display export button
    const exportBtn = document.querySelector(`.lead__Emails__export`);
    if (!exportBtn) {
        leadFinderView.displayExportBtn(emailsToDisplay.length);
    }else{
        document.querySelector(`.lead__Emails__export > span`).textContent = emailsToDisplay.length;
    }
}

initState = () => {
    state.niche = '';
    state.city = '';
    state.foundEmails = [];
    state.remainingEmails = [];
}

// This function take email and sources list, generate the csv file to download
generateLeadCSV = (data) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    // Format our csv file content
    csvContent += "domain , emails" + "\r\n";
    data.forEach(function (rowArray) {
        let row = rowArray.Domain + " , " + rowArray.Emails.join(",");
        csvContent += row + "\r\n";
    });

    // Creating the file
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    let fileName = state.niche + "_" + state.city;
    link.setAttribute("download", fileName + ".csv");
    link.click();
}

// When click on the search button
findLeadBtn.addEventListener('click', function () {
    initState();
    let niche = document.getElementById('niche').value.toLowerCase().trim();
    let location = document.getElementById('city').value.toLowerCase().trim();
    state.niche = niche;
    state.city = location;
    leadFinderView.hideExportBtn();        // Hide export button
    leadFinderView.hideShowmoreBtn();        // Hide showmore button

    // Verify inputs
    if (niche.length != 0 && location.length != 0) {
        document.querySelector('#leadResultsContent').innerHTML = "";
        leadFinderView.renderLoader();
        findLeads(niche, location);
    } else {
        leadFinderView.displayInputsErrorMessage()
    }
});

// Execute a function when the user releases a key on the keyboard
[cityField, nicheField].forEach((el) => {
    el.addEventListener("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            initState();
            let niche = document.getElementById('niche').value.toLowerCase().trim();
            let location = document.getElementById('city').value.toLowerCase().trim();
            state.niche = niche;
            state.city = location;
            leadFinderView.hideExportBtn();        // Hide export button
            leadFinderView.hideShowmoreBtn();        // Hide showmore button

            // Verify inputs
            if (niche.length != 0 && location.length != 0) {
                document.querySelector('#leadResultsContent').innerHTML = "";
                leadFinderView.renderLoader();
                findLeads(niche, location);
            } else {
                leadFinderView.displayInputsErrorMessage()
            }
        }
    });
})

// When click on the show more button
showMoreLeadBtn.addEventListener('click', function () {
    displayResults();
});

leadEvent = {
    addListenerToExport: () =>{
        document.getElementById('leadExport__btn').addEventListener('click', () => {
            generateLeadCSV(state.foundEmails);
        })
    },

    addCopyListener: () => {

    },
}