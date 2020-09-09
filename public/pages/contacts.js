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
    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === XMLHttpRequest.DONE) {
            if (xhttp.status == 200) {
                const res = JSON.parse(xhttp.response);
                for (const individualContact of res) {
                    const contactDiv = document.createElement('div');

                    const img = document.createElement('img');
                    img.src = individualContact.photoUrl;
                    contactDiv.appendChild(img);

                    const name = document.createElement('p');
                    name.innerText = individualContact.name;
                    contactDiv.appendChild(name);

                    const phoneNo = document.createElement('p');
                    phoneNo.innerText = individualContact.phoneNumber;
                    contactDiv.appendChild(phoneNo);

                    const emailAddress = document.createElement('p');
                    emailAddress.innerText = individualContact.emailAddress || '-';
                    contactDiv.appendChild(emailAddress);

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
