$('#loginForm').submit(function (event) {
    event.preventDefault();
    const post_url = $(this).attr("action");
    const request_method = $(this).attr("method"); //get form GET/POST method
    const form_data = $(this).serialize(); //Encode form elements for submission

    $.ajax({
        url: post_url,
        type: request_method,
        data: form_data,
        success: function (response) { 
            //redirect to url
            // console.log(response);
            window.location.href = response.url;
        },
        error: function (response) {
            console.log("Error response:", response.responseText);
            window.location.href = '/knol/pages/login';
        }
    });
});