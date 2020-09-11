import React from "react"
class App extends React.Component {

    componentDidMount() {
        var xhttp = new XMLHttpRequest();
        var queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const code = encodeURIComponent(urlParams.get("code"));
        const state = encodeURIComponent(urlParams.get("state"));
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === XMLHttpRequest.DONE) {
                if (xhttp.status == 200) {
                    let res = JSON.parse(xhttp.response);
                    //on success response , redirect to contacts page
                    window.location.href = res.url;
                } else {
                    alert(xhttp.response);
                    window.location.href = '/knol/login';
                }
            }
        };
        xhttp.open("GET", `/knol/api/v1/user/redirect?code=${code}&state=${state}`, true);
        xhttp.send();
    }

    render() {
        return (
            <div>
                Redirect Page
            </div >
        );
    }
}

export default App;