$('#loginForm').submit(function (event) {
    event.preventDefault();
    let userEmail = document.getElementById("email");
    let password = document.getElementById("password");
    let errorMessage = document.getElementById("errorMessage");

    let regexp = /\S+@\S+\.\S+/;
    if (!userEmail.value.match(regexp)) {
        errorMessage.innerText = "* Invalid Email Address";
        // emailIdErrorMessage.innerText = "Error: Invalid Email Address";
        // loaderLogin.style.display = "none";
        return;
    }

    if (!password.value || password.value.length < 6 || password.value.length > 20) {
        errorMessage.innerText = "* Password must be between 6 to 20 characters";
        return;
    }

    const post_url = $(this).attr("action");
    const request_method = $(this).attr("method"); //get form GET/POST method
    const form_data = $(this).serialize(); //Encode form elements for submission

    $.ajax({
        url: post_url,
        type: request_method,
        data: form_data,
        success: function (response) {
            window.location.href = response.url;
        },
        error: function (response) {
            console.log("Error response:", response.responseText);
            errorMessage.innerText = "*" + response.responseText;
        }
    });
});