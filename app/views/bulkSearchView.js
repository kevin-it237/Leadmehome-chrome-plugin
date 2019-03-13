var bulkSearchView = {
    
    // Display the search button
    diplaySearchButton: function() {
        const bulkSearchBtn = document.querySelector('.bulk__search__btn');
        bulkSearchBtn.style.display = 'inline-block';
    },

    // Hide the search button
    hideSearchButton: function() {
        const bulkSearchBtn = document.querySelector('.bulk__search__btn');
        bulkSearchBtn.style.display = 'none';
    },

    // Display loader when searching results
    renderLoader : () => {
        const loaderBox = document.querySelector('.elements__box');
        const loader = `<div class="s_loader d-flex flex-column justify-content-center">
                            <span>Wait while we get your email addresses...</span><br>
                            <i class="fas fa-spinner fa-2x fa-spin mt-3"></i>
                        </div>`;

        loaderBox.innerHTML = loader;
    },

    // Remove loader 
    clearLoader : () => {
        const loader = document.querySelector(`.s_loader`);
        if (loader) {
            loader.parentElement.removeChild(loader);
        }
    },

    // Display download Button
    displayDownloadBtn : () => {
        const bulkBox = document.querySelector(`.bulk__search`);
        bulkBox.innerHTML += `<a class="btn bulk__export" href="#"><i class="fa fa-download"></i> Download Result</a>`;
    },

    // Hide download Button
    hideDownloadBtn : () => {
        const downloadBtn = document.querySelector(`.bulk__export`);
        if (downloadBtn) {
            downloadBtn.parentElement.removeChild(downloadBtn);
        }
    },

    // Display error if the have problem when searching
    displayServerErrorMessage: function () {
        const loaderBox = document.querySelector('.elements__box');
        loaderBox.innerHTML = '<h5 class="url__error alert alert-danger" role="alert">An error occured", "Please refresh the page and try again.</h5>';
    },
}