function firstStartApp() {
    $.ajax({
        url: "/api/auth/firststartapp",
        type: "GET",
        success: (result) => {
            if (result) {
                // let tmp = JSON.stringify(result).replace(/"/gi, '');
                //
                // if (tmp === "admin") {
                //     window.location.href = "/admin.html";
                // }
                // if (tmp === "user") {
                //     window.location.href = "/main.html";
                // }
                // if (tmp === "err") {
                //     window.location.href = "/index.html";
                // }
            }
        }
    })
}

function checkPres(data) {
    $.ajax({
        url: "/api/auth/getpermissions",
        type: "POST",
        data: {email: data},
        success: (result) => {
            if (result) {
                let tmp = JSON.stringify(result).replace(/"/gi, '');

                if (tmp === "admin") {
                    window.location.href = "/admin.html";
                }
                if (tmp === "user") {
                    window.location.href = "/main.html";
                }
                if (tmp === "err") {
                    window.location.href = "/index.html";
                }
            }
        }
    })
}

function register() {
    let id = {
        "email": $("#email").val(),
        "password": $("#password").val(),
        "lastname": $("#lastname").val(),
        "firstname": $("#firstname").val()
    };
    console.log(JSON.stringify(id));
    $.ajax({
        type: 'POST',
        data: id,
        async: false,
        url: "api/auth/register",
        success: (data) => {
            window.location.href = "/index.html";
            // $.ajax({
            //     type: 'POST',
            //     data: id,
            //     async: false,
            //     url: "api/auth/login",
            //     success: (data) => {
            //         location.href = ("/main.html");
            //     }
            // })
        }
    })
}


function login() {
    let id = {
        "email": document.getElementById("email_login").value,
        "password": document.getElementById("password_login").value
    };
    $.ajax({
        type: 'POST',
        data: id,
        url: "api/auth/login",
        success: function (data) {
            checkPres(id.email);
        }
    })
}


$(document).ready(() => {
    $("#regButton").click(register);
});
