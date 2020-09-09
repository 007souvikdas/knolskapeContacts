const logoutButton = document.getElementById('logout');

logoutButton.onclick = (e) => {
    console.log('logging out');

    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === XMLHttpRequest.DONE) {
            console.log(xhttp.response);
            window.location.href = '/knol/pages/login';
        }
    };
    xhttp.open('GET', '/knol/api/v1/user/logout', true);
    xhttp.send();
};

window.onload = (event) => {
    getContacts();
};

function getContacts() {
    const contactsDiv = document.getElementById('contactsDiv');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userImage = document.getElementById('userPhoto');
    const numberContact = document.getElementById('numberContact');

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === XMLHttpRequest.DONE) {
            if (xhttp.status == 200) {
                const res = JSON.parse(xhttp.response);

                userName.innerText = res.userName;
                userImage.src = res.photoUrl;
                userEmail.innerText = res.userEmail;
                numberContact.innerText = "(" + res.contacts.length + ")";
                for (const individualContact of res.contacts) {
                    const contactDiv = document.createElement('div');
                    contactDiv.className = "individual-contact-div";

                    const img = document.createElement('img');
                    img.className = "individual-contact-img";
                    img.src = individualContact.photoUrl;
                    contactDiv.appendChild(img);

                    const name = document.createElement('p');
                    name.className = "individual-contact-name";
                    name.innerText = individualContact.name;
                    contactDiv.appendChild(name);

                    const emailAddress = document.createElement('p');
                    emailAddress.className = "individual-contact-email";
                    emailAddress.innerText = individualContact.emailAddress || '-';
                    contactDiv.appendChild(emailAddress);

                    const phoneNo = document.createElement('p');
                    phoneNo.className = "individual-contact-phone";
                    phoneNo.innerText = individualContact.phoneNumber;
                    contactDiv.appendChild(phoneNo);

                    contactsDiv.appendChild(contactDiv);
                }
            } else {
                window.location.href = '/knol/pages/login';
            }
        }
    };
    xhttp.open('GET', '/knol/api/v1/contacts', true);
    xhttp.send();
}
