import React from "react"
import '../../css/contact.css'
import logoutIcon from '../../images/logout.png'
import backgroundImg from '../../images/background.png';

class App extends React.Component {

    constructor() {
        super();
        this.state = {
            userName: "",
            userEmail: "",
            userPhoto: "",
            numberContact: 0,
            contactlists: [],
        };
        this.handleOnClick = this.handleOnClick.bind(this);
    }
    componentDidMount() {
        let _this = this;
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === XMLHttpRequest.DONE) {
                if (xhttp.status == 200) {
                    const res = JSON.parse(xhttp.response);
                    _this.setState({
                        userName: res.userName,
                        userPhoto: res.photoUrl,
                        userEmail: res.userEmail,
                        numberContact: "(" + res.contacts.length + ")",
                        contactlists: res.contacts,
                    });
                } else {
                    alert(xhttp.response);
                    window.location.href = '/knol/login';
                }
            }
        };
        xhttp.open('GET', '/knol/api/v1/contacts', true);
        xhttp.send();
    }
    createIndividualContacts() {
        let rows = [];
        for (const individualContact of this.state.contactlists) {
            rows.push(
                <div className="individual-contact-div">
                    <img className="individual-contact-img" src={individualContact.photoUrl} />
                    <p className="individual-contact-name">{individualContact.name}</p>
                    <p className="individual-contact-email">{individualContact.emailAddress || "-"}</p>
                    <p className="individual-contact-phone">{individualContact.phoneNumber}</p>
                </div>
            );
        }
        return rows;
    }

    handleOnClick() {
        console.log('logging out');
        const xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === XMLHttpRequest.DONE) {
                console.log(xhttp.response);
                window.location.href = '/knol/login';
            }
        };
        xhttp.open('GET', '/knol/api/v1/user/logout', true);
        xhttp.send();
    }

    render() {
        return (
            <div>
                <div id="background-img">
                    <img className="stretch" src={backgroundImg} />
                </div>
                <div className="top-banner">
                    <div className="user-info">
                        <img className="user-img" src={this.state.userPhoto} alt="No Image" />
                        <p className="user-name" >{this.state.userName}</p>
                        <p className="user-email">{this.state.userEmail}</p>
                    </div>
                    <img src={logoutIcon} className="logout" id="logout" onClick={this.handleOnClick} />
                </div>
                <div className="contact-holder">
                    <p className="static-contact">Contacts</p>
                    <p className="static-contact static-number-contact" id="numberContact">{this.state.numberContact}</p>
                    <div className="actual-contact-div" id="contactsDiv">
                        <div className="header-div">
                            <p className="static-header name-header">NAME</p>
                            <p className="static-header email-header">EMAIL</p>
                            <p className="static-header phone-header">PHONE NUMBER</p>
                        </div>
                        {this.createIndividualContacts()}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;