emailSearchView = {
    // This function display result. It takes emails, p and isshowmore boolean
    displayEmails: function(emails, p, isShowMore) {
        var html = "";
        if(emails.length >= 1){
            emails.forEach((email, i) => {
                var sourceUrls = "";
                var numberOfSource = "";
                // Verify if a email have many sources
                if(email.url.length > 1){
                    email.url.forEach((url) => {
                        sourceUrls += `<a href="${url}">${url}</a>`;
                    })
                    numberOfSource = email.url.length+' sources';
                }else{
                    sourceUrls = `<a href="${email.url}">${email.url}</a>`;
                    numberOfSource = '1 source';
                }

                html += `<div class="single__result">
                            <div class="single__result__header"> 
                                <h5 class="email__result">${email.email}</h5>
                                <p role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne${(p+i)}" aria-expanded="false" aria-controls="collapseOne${(p+i)}" class="sources">${numberOfSource} <i class="fas fa-chevron-down"></i></p>
                            </div>
                            <div id="sources_list${(+i)}" class="sources_list">
                                <div id="collapseOne${(p+i)}" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne${(p+i)}">
                                    ${sourceUrls}
                                </div>
                            </div>
                        </div>`;
            });
        }else{
            html += `<div class="single__result">
                        <h5>No Email Found</h5>
                    </div>`;
        }

        // Clear the loader on the screen
        clearLoader();
        resultContainer.innerHTML += html;
        // Display or not Show more button
        if(isShowMore){
            showMoreBtn.style.display = "block";
        }else{
            showMoreBtn.style.display = "none";
        }
    },

    // this function display Error when url is invalid
    displayUrlErrorMessage: function(){
        resultContainer.innerHTML = '<h5 class="url__error alert alert-danger" role="alert">Please, enter a valid Url.</h5>';
    },

    // Display error if the have problem when searching
    displayServerErrorMessage: function () {
        resultContainer.innerHTML = '<h5 class="url__error alert alert-danger" role="alert">An error occured", "Please refresh the page and try again.</h5>';
    },
}
