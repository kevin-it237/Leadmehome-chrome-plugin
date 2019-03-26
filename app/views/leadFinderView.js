var leadFinderView = {

    renderResults: (emailList) => {
        var html = '';
        emailList.forEach((el, i) => {
            var Emails = "";
            // Emails for eah domain
            if (el.Emails.length > 0){
                el.Emails.forEach((email) => {
                    Emails += `<tr><td><span class="email">${email}</span></td></tr>`;
                })
            }else{
                Emails = `<tr><td><span class="email">No email found.</span></td></tr>`;
            }

            html += `
                <div class="result">
                    <div class="panel-group" id="accordion">
                        <div class="panel panel-default">
                            <div class="panel-heading" data-toggle="collapse" data-parent="#accordion" href="#collapseOne${'_'+i}">
                                <h4 class="panel-title">
                                    <span class="domain">${el.Domain}</span>
                                    <i class="fa fa-chevron-down"></i>
                                </h4>
                            </div>
                            <div id="collapseOne${'_' + i}" class="panel-collapse collapse">
                                <div class="panel-body">
                                    <table class="table">
                                        ${Emails}
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
        });

        // Render
        let resultContainer = document.getElementById('leadResultsContent');
        resultContainer.innerHTML = html;
    },

    // Display loader when searching results
    renderLoader: () => {
        const loaderBox = document.querySelector('#leadResultsContent');
        const loader = `<div style="text-align:center" class="s2_loader d-flex flex-column justify-content-center">
                            <i class="fas fa-spinner fa-2x fa-spin"></i>
                        </div>`;

        loaderBox.innerHTML = loader;
    },

    // Remove loader 
    clearLoader: () => {
        const loader = document.querySelector(`.s2_loader`);
        if (loader) {
            loader.parentElement.removeChild(loader);
        }
    },

    // Display download Button
    displayExportBtn: (n) => {
        const buttonBox = document.querySelector(`.leadExport`);
        buttonBox.innerHTML = `<a id="leadExport__btn" class="btn  lead__Emails__export" href="#">Export <span>${n}</span></a>`;
    },

    // Hide download Button
    hideExportBtn: () => {
        const exportBtn = document.querySelector(`.lead__Emails__export`);
        if (exportBtn) {
            exportBtn.parentElement.removeChild(exportBtn);
        }
    },

    // Display showmore Button
    displayShowmoreBtn: () => {
        document.querySelector(`#leadShowmore`).style.visibility = 'visible';         
    },

    // Hide showmore Button
    hideShowmoreBtn: () => {
        document.querySelector(`#leadShowmore`).style.visibility = 'hidden'; 
    },

    // Display error if they are a problem when make search
    displayServerErrorMessage: function () {
        const loaderBox = document.querySelector('#leadResultsContent');
        loaderBox.innerHTML = '<h5 class="url__error alert alert-danger" role="alert">An error occured", "Please refresh the page and try again.</h5>';
    },

    // Display error if they are a problem when make search
    displayInputsErrorMessage: function () {
        const loaderBox = document.querySelector('#leadResultsContent');
        loaderBox.innerHTML = '<h5 class="url__error alert alert-danger" role="alert">Please enter city and niche.</h5>';
    },

    displayNoResultFoundMessage: function () {
        const loaderBox = document.querySelector('#leadResultsContent');
        loaderBox.innerHTML = '<h5 class="url__error alert alert-dark" role="alert">Sorry, no result found.</h5>';
    },
}