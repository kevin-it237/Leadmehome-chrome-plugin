const searchBtn = document.getElementById('search__btn');
const resultContainer = document.getElementById('results');
const showMoreBtn = document.getElementById('showmore');
const urlField = document.getElementById('url__field');
var allEmails = [];
var P = 0;

// Auto load Email search when change tab
(function(){
    chrome.tabs.getSelected(null, function (tab) {
        tabUrl = tab.url;
        resultContainer.innerHTML = "";
        let domain = extractDomain(tabUrl);
        urlField.value = domain;
        renderLoader();
        findEmails(domain, P);
    });
})();


// This function take url and p value and make search for emails
async function findEmails(url, p) {
    const devUrl = 'https://leadmehome.io/api/lead/testSharing';

    try {
        const res = await axios.post(devUrl, { url : url, p: p })
        const emails = await res.data.data[0];
        P = await res.data.data[1];
        const isShowMore = await res.data.data[2];
        // Update all emails List
        getAllEmail(emails);
        console.log(allEmails)

        // Display results
        emailSearchView.displayEmails(emails, p, isShowMore);
        // Display export button
        if(allEmails.length > 0){
            emailSearchView.displayExportBtn(allEmails.length);
            // Add Event listener to export button
            addListenerToExport()
            // Add clipboard copy Listener
            addCopyListener();
        }
    } catch (error) {
        console.log(error);
        emailSearchView.displayServerErrorMessage();
    }
}

// Extact domain for tabs urls
extractDomain = (url) => {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    //find & remove www
    if (domain.indexOf("www.") > -1) {
        domain = domain.split('www.')[1];
    }

    domain = domain.split(':')[0]; //find & remove port number
    domain = domain.split('?')[0]; //find & remove url params

    return domain;
}

// Get All Emails and sources into an array
getAllEmail = (arr) => {
    arr.forEach(el => {
        allEmails.push(el);
    });
}

// This function take email and sources list, generate the csv file to download
generateCSVFile = (data) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    // Format our csv file content
    csvContent += "email , url" + "\r\n";
    data.forEach(function (rowArray) {
        row = rowArray.email + " , " + rowArray.url.join(",");
        csvContent += row + "\r\n";
    });

    // Creating the file
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "emailData.csv");
    link.click();
}

// Display loader when searching results
renderLoader = () => {
    const loader = `<p class="loader"><i class="fas fa-spinner fa-2x fa-spin"></i></p>`;
    resultContainer.innerHTML += loader;
}

// Remove loader 
clearLoader = () =>{
    const loader = document.querySelector(`.loader`);
    if(loader){
        loader.parentElement.removeChild(loader);
    }
}

// Copy email on clipboard
getEmailTextOnClick = (e) => {
    e.preventDefault();
    var emailText = e.target.innerHTML;
    navigator.clipboard.writeText(emailText);
    //display the "copied" text
    document.querySelector('.copied span').style.visibility = 'visible';
    // Hide the "copied text" after 2 seconds
    setTimeout(function () { 
        document.querySelector('.copied span').style.visibility = 'hidden';
    }, 2000);
}

// Add Listener to copy email on clipboard
addCopyListener = () => {
    let emailsList = document.getElementsByClassName('email__result');
    for (let i = 0; i < emailsList.length; i++) {
        emailsList[i].addEventListener('click', getEmailTextOnClick);
    }
}

// This function add the listener to the export button
addListenerToExport = () => {
    const exportCsvFile = document.querySelector('.emails__export');
    exportCsvFile.addEventListener('click', () => {
        generateCSVFile(allEmails);
    });
}

var regex = new RegExp(/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/);

// Verify is url is valid and return true
function validURL(str) {
    var pattern = new RegExp(/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/);
    return !!pattern.test(str);  
}

// When click on the search button
searchBtn.addEventListener('click', function() {
    allEmails = []; // Init all Email list
    let url = document.getElementById('url__field').value;
    emailSearchView.hideExportBtn();        // Hide export button
    showMoreBtn.style.visibility = 'hidden'; // Hide showmore button
    // Verify url
    if(validURL(url)){
        P = 0;
        resultContainer.innerHTML = "";
        renderLoader();
        findEmails(url, P);
    }else{
        emailSearchView.displayUrlErrorMessage()
    }
});

// Execute a function when the user releases a key on the keyboard
urlField.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        allEmails = []; // Init all Email list
        let url = document.getElementById('url__field').value;
        emailSearchView.hideExportBtn();        // Hide export button
        showMoreBtn.style.visibility = 'hidden'; // Hide showmore button
        // Verify url
        if (validURL(url)) {
            P = 0;
            resultContainer.innerHTML = "";
            renderLoader();
            findEmails(url, P);
        } else {
            emailSearchView.displayUrlErrorMessage()
        }
    }
});

// When click on the show more button
showMoreBtn.addEventListener('click', function() {
    renderLoader();
    let url = document.getElementById('url__field').value;
    findEmails(url, P);
});