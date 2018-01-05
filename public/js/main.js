function checkAuth ()
{
    let cookieBrowser = $.cookie('x-access-token');
    if (cookieBrowser !== undefined)
    {
        window.location.href = "/main.html";
    }
    else
    {
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