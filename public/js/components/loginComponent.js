import React from "react"
import '../../css/login.css'
import backgroundImg from '../../images/background.png';
import googleIcon from '../../images/google.png'

class App extends React.Component {

    constructor() {
        super();
        this.state = {
            userName: "",
            password: "",
            errorMessage: ""
        }
        this.usernameValid = false;
        this.passwordValid = false;
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleOnChange(e) {
        let fieldname = e.target.name;

        this.setState({
            [e.target.name]: e.target.value
        });
        if (fieldname === 'userName') {
            let regexp = /\S+@\S+\.\S+/;
            if (!e.target.value.match(regexp)) {
                this.setState({
                    errorMessage: "* Invalid Email Address"
                });
            } else {
                this.setState({
                    errorMessage: ""
                });
                this.usernameValid = true;
            }

        } else if (fieldname === 'password') {
            let password = e.target.value;
            if (!password || password.length < 6 || password.length > 20) {
                this.setState({
                    errorMessage: "* Password must be between 6 to 20 characters"
                });
            } else {
                this.setState({
                    errorMessage: ""
                });
                this.passwordValid = true;
            }

        }
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.usernameValid && this.passwordValid) {
            this.makePostRequest();
        } else {
            this.setState({
                errorMessage: "* Invalid input fields"
            });
        }
        console.log("form submitted with values:", this.state.userName, this.state.password);
    }

    makePostRequest() {

        fetch("/knol/api/v1/user/login", {
            method: "POST",
            body: JSON.stringify({
                userName: this.state.userName,
                password: this.state.password,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(response => {
            if (response.status == 200) {
                return response.json();
            }
            else {
                return response.text().then(text => { throw new Error(text) });

            }
        })
            .then(json => {
                console.log(json);
                window.location.href = json.url;
            }).catch((err) => {
                console.log("Error response:", err.message);
                this.setState({
                    errorMessage: `* ${err.message}`
                });
            });
    }

    render() {
        return (
            <div>
                <div id="background-img">
                    <img className="stretch" src={backgroundImg} />
                </div>

                <div className="signIn-rectangle">
                    <img className="google-img" src={googleIcon} />
                    <p className="login-text">Sign in with Google</p>
                    <form onSubmit={this.handleSubmit}>
                        <input className="form-text" id="email" name="userName" placeholder="Email" type="text" onChange={this.handleOnChange} />
                        <br />
                        <br />
                        <input className="form-text" name="password" id="password" type="password" placeholder="Password" onChange={this.handleOnChange} />
                        <button className="signIn-Button">Submit</button>
                        <p className="error-Message"> {this.state.errorMessage}</p>
                    </form>
                </div>
            </div >
        );
    }
}

export default App;