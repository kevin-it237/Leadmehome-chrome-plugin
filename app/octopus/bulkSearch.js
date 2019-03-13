
const bulkSearchBtn = document.querySelector('.bulk__search__btn');
const csvFile = document.querySelector('.bulk__search__csv');
var dataToCsv = [];


// This function get the csv file content and call the getListEmail() function to make Bulk Search
makeBulkSearch = () => {
    // Get the file from the input
    let file = csvFile.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    // Asynchronous method
    reader.onload = (e) => {
        const domainList = reader.result.trim().split(',');
        // Get the email List
        getListEmail(domainList);
    }
}

// This function make the emails search. It take the domain list
getListEmail = async (domainList) => {
    const devUrl = 'https://leadmehome.io/api/lead/getAllDomains';
    try {
        const res = await axios.post(devUrl, { 'domains': domainList }) //await fetch(devUrl);
        //hide the spinner
        bulkSearchView.clearLoader();
        // Dispaly the download button
        bulkSearchView.displayDownloadBtn();
        // Add event listener to button
        addListenerToDownload();
        const data = res.data.data;
        // Get datas
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].concern.length; j++) { //study the structure of the data object to understand this logic
                dataToCsv.push(data[i].concern[j])
            }
        }
        console.log(dataToCsv);
    }
    catch (ex) {
        console.log(ex);
        bulkSearchView.displayServerErrorMessage();
    }
}

// This function take email and sources list, generate the csv file to download
generateCSV = (data) => {
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
    link.setAttribute("download", "bulkData.csv");
    link.click();
}

// This function add the listener to the download button
addListenerToDownload = () => {
    const exportCsvFile = document.querySelector('.bulk__export');
    exportCsvFile.addEventListener('click', () => {
        generateCSV(dataToCsv);
    });
}

// This function add the listener to the search button
bulkSearchBtn.addEventListener('click', () => {
    bulkSearchView.hideSearchButton();
    // Display the loader
    bulkSearchView.renderLoader();
    makeBulkSearch();
});

// This function add the listener to the csv file input
csvFile.addEventListener('change', () => {
    // Display the search button
    bulkSearchView.diplaySearchButton();
    bulkSearchView.hideDownloadBtn()
});

bulkSearchView.hideSearchButton()