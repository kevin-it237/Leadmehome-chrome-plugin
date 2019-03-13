const searchBtn = document.getElementById('search__btn');
const resultContainer = document.getElementById('results');
const showMoreBtn = document.getElementById('showmore');
const urlField = document.getElementById('url__field')
var P = 0;

// This function take url and p value and make search for emails
async function findEmails(url, p) {
    const devUrl = 'https://leadmehome.io/api/lead/testSharing';

    try {
        const res = await axios.post(devUrl, { url : url, p: p })
        const emails = await res.data.data[0];
        P = await res.data.data[1];
        const isShowMore = await res.data.data[2];

        // Display results
        emailSearchView.displayEmails(emails, p, isShowMore);
    } catch (error) {
        console.log(error);
        emailSearchView.displayServerErrorMessage();
    }
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


// Verify is url is valid and return true
function validURL(str) {
    var pattern = new RegExp(
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ 
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ 
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }

// When click on the search button
searchBtn.addEventListener('click', function() {
    let url = document.getElementById('url__field').value;
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
        let url = document.getElementById('url__field').value;
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