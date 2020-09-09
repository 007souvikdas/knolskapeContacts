window.onload = (event) => {
    getContacts();
}

function getContacts() {
    let contactsDiv = document.getElementById("contactsDiv");
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === XMLHttpRequest.DONE) {

            if (xhttp.status == 200) {
                let res = JSON.parse(xhttp.response);
                for (let individualContact of res) {

                    let contactDiv = document.createElement('div');

                    let img = document.createElement('img');
                    img.src = individualContact.photoUrl;
                    contactDiv.appendChild(img);

                    let name = document.createElement('p');
                    name.innerText = individualContact.name;
                    contactDiv.appendChild(name);

                    let phoneNo = document.createElement('p');
                    phoneNo.innerText = individualContact.phoneNumber;
                    contactDiv.appendChild(phoneNo);

                    let emailAddress = document.createElement('p');
                    emailAddress.innerText = individualContact.emailAddress || "-";
                    contactDiv.appendChild(emailAddress);

                    contactsDiv.appendChild(contactDiv);
                }
            } else {
                window.location.href = '/knol/pages/login';
            }
        }
    };
    xhttp.open("GET", `/knol/api/v1/contacts`, true);
    xhttp.send();
}