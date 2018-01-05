function checkPres(data) {
    $.ajax({
        url: "/api/auth/getpermissions",
        type: "POST",
        data: {email: data},
        success: (result) => {
            if (result) {
                let tmp = JSON.stringify(result).replace(/"/gi, '');

                // if (tmp === "admin") {
                //     window.location.href = "/admin.html";
                // }
                // if (tmp === "user") {
                //     window.location.href = "/main.html";
                // }
                if (tmp === "err") {
                    window.location.href = "/index.html";
                }
            }
        }
    })
}

function getlogin() {
    let user = "";
    let cookieBrowser = $.cookie('x-access-token');
    if (cookieBrowser !== undefined) {
        $.ajax({
            url: "/api/auth/getname",
            type: "GET",
            success: (result) => {
                if (result) {
                    let tmp = JSON.stringify(result).replace(/"/gi, '');
                    user = tmp;
                    $('#userName').text("Добро пожаловать, " + user);
                    return result;
                }
            }
        })
    }
    else {
        window.location.href = "/index.html";
    }
}

function logout() {
    $.ajax({
        url: "/api/auth/logout",
        type: "GET",
        success: (result) => {
            $.removeCookie('x-access-token');
            window.location.href = "/";
        }
    })
}