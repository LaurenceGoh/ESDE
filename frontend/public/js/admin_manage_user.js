$(document).ready(() => {
    const baseUrl = 'https://54.242.53.126:5000';
    let userId = localStorage.getItem('user_id');
    let token = localStorage.getItem('token');
    let searchInput = $('#searchInput').val();
    // we will be using a request to validate the role of the user
    axios({
        headers: {
            'user': userId,
            'Authorization' : 'Bearer ' + token 
        },
        method: 'get',
        url: baseUrl + '/api/user/process-search-user/1/' + searchInput,
    }).catch((err) =>{
        console.log(err)
        // not admin
        localStorage.clear()
        window.location.assign('https://54.242.53.126:3001/admin/403.html');
       
    } )
})



let $searchDesignFormContainer = $('#searchUserFormContainer');
if ($searchDesignFormContainer.length != 0) {
    $('#submitButton').on('click', function(event) {
        event.preventDefault();
        const baseUrl = 'https://54.242.53.126:5000';
        let searchInput = $('#searchInput').val();
        let userId = localStorage.getItem('user_id');
        // axios requries the token
        let token = localStorage.getItem('token');
        axios({
                headers: {
                    //Modify this will affect the checkUserFn.js middleware file at the backend.
                    'user': userId,
                    'Authorization': 'Bearer ' + token
                },
                method: 'get',
                url: baseUrl + '/api/user/process-search-user/1/' + searchInput,
            })
            .then(function(response) {
                //Using the following to inspect the response.data data structure
                //before deciding the code which dynamically generates cards.
                //Each card describes a design record.
                //console.dir(response.data);
                const records = response.data.userdata;
                const totalNumOfRecords = response.data.total_number_of_records;
                //Find the main container which displays page number buttons
                let $pageButtonContainer = $('#pagingButtonBlock');
                //Find the main container which has the id, dataBlock
                let $dataBlockContainer = $('#dataBlock');
                $dataBlockContainer.empty();
                $pageButtonContainer.empty();
                if (records.length == 0) {
                    new Noty({
                        type: 'information',
                        layout: 'topCenter',
                        timeout: '5000',
                        theme: 'sunset',
                        text: 'No submission records found.',
                    }).show();
                }
                for (let index = 0; index < records.length; index++) {
                    let record = records[index];
                    console.log(record.cloudinary_url);
                    let $container;
                    if(index%2==0)
                        $container = $('<div></div>').addClass(' offset-sm-2 col-sm-4 mb-4');
                    else 
                        $container = $('<div></div>').addClass(' col-sm-4 mb-4');                    
                    let $card = $('<div></div>').addClass('card').attr('style', 'width: 18rem;');
                    let $cardBody = $('<div></div>').addClass('card-body');
                    let $editUserButtonBlock = $('<div></div>').addClass('position-absolute bottom-0 end-0');
                    $editUserButtonBlock.append($('<a>Manage</a>').addClass('btn btn-primary').attr('href', 'update_user.html?id=' + record.user_id));
                    $cardBody.append($('<h5></h5>').addClass('card-title').append(record.fullname));
                    $cardBody.append($('<p></p>').addClass('card-text').append(record.email));
                    $cardBody.append($editUserButtonBlock);                    
                    if (record.role_name == 'admin') {
                        $cardBody.append($('<img></img>').attr({ 'src': '../images/admin.png', 'widthc': '50' }).addClass('text-right'));
                    }
                    else{
                        $cardBody.append($('<img></img>').attr({ 'src': '../images/user.png', 'widthc': '50' }).addClass('text-right'));
                    }
                    $card.append($cardBody);
                    $container.append($card);
                    //After preparing all the necessary HTML elements to describe the user data,
                    //I used the code below to insert the main parent element into the div element, dataBlock.
                    $dataBlockContainer.append($container);
                    
                } //End of for loop
                let totalPages = Math.ceil(totalNumOfRecords / 4);

                for (let count = 1; count <= totalPages; count++) {

                    let $button = $(`<button class="btn btn-primary btn-sm mr-1" />`);
                    $button.text(count);
                    $button.click(clickHandlerForPageButton);

                    $pageButtonContainer.append($button);
                } //End of for loop to add page buttons

            }).catch((error)=>   {
                //Handle error
                console.dir(error);
                var response = error.response;
                var status = response.status;
               
                new Noty({
                    type: 'error',
                    layout: 'topCenter',
                    timeout: '5000',
                    theme: 'sunset',
                    text: 'Unable to search',
                }).show();

                if (status === 403){
                    window.location.assign('https://54.242.53.126:3001/admin/403.html');
                }
            });
    });

    function clickHandlerForPageButton(event) {
        event.preventDefault();
        const baseUrl = 'https://54.242.53.126:5000';
        let userId = localStorage.getItem('user_id');
        let pageNumber = $(event.target).text().trim();
        let searchInput = $('#searchInput').val();
        let token = localStorage.getItem('token');

        console.log('Checking the button page number which raised the click event : ', pageNumber);
        axios({
                headers: {
                    'user': userId,
                    'Authorization': 'Bearer ' + token
                },
                method: 'get',
                url: baseUrl + '/api/user/process-search-user/' + pageNumber + '/' + searchInput,
            })
            .then(function(response) {
                //Using the following to inspect the response.data data structure
                //before deciding the code which dynamically generates cards.
                //Each card describes a design record.
                //console.dir(response.data);
                const records = response.data.userdata;
                const totalNumOfRecords = response.data.total_number_of_records;
                //Find the main container which displays page number buttons
                let $pageButtonContainer = $('#pagingButtonBlock');
                //Find the main container which has the id, dataBlock
                let $dataBlockContainer = $('#dataBlock');
                $dataBlockContainer.empty();
                $pageButtonContainer.empty();

                for (let index = 0; index < records.length; index++) {
                    let record = records[index];
                    console.log(record.cloudinary_url);
                    if(index%2==0)
                        $container = $('<div></div>').addClass(' offset-sm-2 col-sm-4 mb-4');
                    else 
                        $container = $('<div></div>').addClass(' col-sm-4 mb-4');                    
                    let $card = $('<div></div>').addClass('card').attr('style', 'width: 18rem;');
                    let $cardBody = $('<div></div>').addClass('card-body');
                    $editUserButtonBlock = $('<div></div>').addClass('position-absolute bottom-0 end-0');
                    $editUserButtonBlock.append($('<a>Manage</a>').addClass('btn btn-primary').attr('href', 'update_user.html?id=' + record.user_id));
                    $cardBody.append($('<h5></h5>').addClass('card-title').append(record.fullname))                    
                    $cardBody.append($('<p></p>').addClass('card-text').append(record.email))
                    $cardBody.append($editUserButtonBlock);                    
                    if (record.role_name == 'admin') {
                        $cardBody.append($('<img></img>').attr({ 'src': '../images/admin.png', 'widthc': '50' }).addClass('text-right'));
                    }
                    else{
                        $cardBody.append($('<img></img>').attr({ 'src': '../images/user.png', 'widthc': '50' }).addClass('text-right'));  
                    }
                    $card.append($cardBody);
                    $container.append($card);                    
                    //After preparing all the necessary HTML elements to describe the file data,
                    //I used the code below to insert the main parent element into the div element, dataBlock.
                    $dataBlockContainer.append($container);
                    
                } //End of for loop
                let totalPages = Math.ceil(totalNumOfRecords / 4);
                console.log(totalPages);
                for (let count = 1; count <= totalPages; count++) {

                    let $button = $(`<button class="btn btn-primary btn-sm mr-1" />`);                    
                    $button.text(count);
                    $button.click(clickHandlerForPageButton);
                    $pageButtonContainer.append($button);
                }
            })
            .catch(function(response) {
                //Handle error
                console.dir(response);
                new Noty({
                    type: 'error',
                    layout: 'topCenter',
                    theme: 'sunset',
                    text: 'Unable to search',
                }).show();
            });

    } //End of clickHandlerForPageButton
} //End of checking for $searchUserFormContainer jQuery object