function checkPresAdmin() {
    $.ajax({
        url: "/api/auth/getpermissionsadmin",
        type: "GET",
        success: (result) => {
            if (result) {
                let tmp = JSON.stringify(result).replace(/"/gi, '');

                // if (tmp === "admin") {
                //     window.location.href = "/admin.html";
                // }
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

function countUsers() {
    $.ajax({
        url: "/api/auth/countusers",
        type: "GET",
        success: (result) => {
            $('#countUser').text(result);
        }
    })
}

function countOrders() {
    $.ajax({
        url: "/api/order/countorders",
        type: "GET",
        success: (result) => {
            $('#countOrder').text(result);
        }
    })
}

// menu == food

function countMenu() {
    $.ajax({
        url: "/api/menu/countmenu",
        type: "GET",
        success: (result) => {
            $('#countMenu').text(result);
        }
    })
}

function totalAllOrders() {
    $.ajax({
        url: "/api/order/totalallorders",
        type: "GET",
        success: (result) => {
            $('#totalOrder').text(result);
        }
    })
}

function getAllMenu() {
    $.ajax({
        url: "/api/menu/getallmenu",
        type: "GET",
        dataType: "json",
        success: (data) => {
            drawTable(data);
        }
    })
}

function drawTable(data) {
    let row = $("<tr />");
    $("#foodTable").append(row);
    row.append($(
        "<th class='name'>Name</th>" +
        "<th class='price'>Price</th>" +
        "<th class='type'>Type</th>" +
        "<th class='delete'>Action</th>"
    ));
    for (let i = 0; i < data.length; i++) {
        drawRow(data[i]);
    }
}

function drawRow(rowData) {
    let row = $("<tr />");
    $("#foodTable").append(row);
    row.append($(
        "<td>" + rowData.name + "</td>" +
        "<td>" + rowData.price + "</td>" +
        "<td>" + rowData.type_food + "</td>" +
        "<td>" +
        "Change food&nbsp&nbsp<a><img src='../images/update.png' class='cart' onclick=\"PopUpShow('" + rowData.name + ',' + rowData.price + ',' + rowData.type_food + "\');\"></a>" +
        "&nbsp&nbsp" +
        "Delete&nbsp&nbsp<a><img src='../images/delOne.png' class='cart' onclick=\"delFood('" + rowData.name + "\');\"></a>" +
        "</td>"
    ));
}

function addFood() {
    let food = {
        "name": $("#nameFood").val(),
        "price": $("#priceFood").val(),
        "type_food": $("#typeFood").val()
    };
    console.log(JSON.stringify(food));
    $.ajax({
        type: 'POST',
        data: food,
        url: "/api/menu/addfood",
        success: function (data) {
            location.reload();
        }
    })
}

function delFood(data) {
    $.ajax({
        type: 'DELETE',
        data: {"name": data},
        url: "/api/menu/delfood",
        success: function (data) {
            location.reload();
        }
    });
}

//
// function getIdFood(data) {
//     $.ajax({
//         type: 'POST',
//         data: {name: data.name},
//         url: "/api/menu/getidfood",
//         success: (result) => {
//             console.log(result);
//         }
//     });
// }

function clearFood() {
    $("#nameFood").val('');
    $("#priceFood").val('');
    $("#typeFood").val('');
}

function updateFood() {
    let food = {
        "name": $("#nameF").val(),
        "price": $("#priceF").val(),
        "type_food": $("#typeFoodF").val()
    };

    $.ajax({
        type: 'POST',
        data: food,
        url: "/api/menu/updatefood",
        success: function (data) {
            location.reload();
        }
    });
}

function PopUpShow(data) {
    event.preventDefault(); // выключaем стaндaртную рoль элементa
    $('#overlay').fadeIn(400, // снaчaлa плaвнo пoкaзывaем темную пoдлoжку
        () => { // пoсле выпoлнения предъидущей aнимaции
            $('#modal_form')
                .css('display', 'block') // убирaем у мoдaльнoгo oкнa display: none;
                .animate({opacity: 1, top: '50%'}, 200); // плaвнo прибaвляем прoзрaчнoсть oднoвременнo сo съезжaнием вниз
        });

    let arr = data.split(',');

    $("#nameF").val(arr[0]);
    $("#priceF").val(arr[1]);
    $("#typeFoodF").val(arr[2]);
}

function PopUpHide(){
    $("#modal_form").hide();
    $("#overlay").hide();
}

// user

function getAllUsers() {
    $.ajax({
        url: "/api/auth/getallusers",
        type: "GET",
        dataType: "json",
        success: (data) => {
            drawTableUser(data);
        }
    })
}

function drawTableUser(data) {
    let row = $("<tr />");
    $("#userTable").append(row);
    row.append($(
        "<th class='name'>Email</th>" +
        "<th class='price'>Firstname</th>" +
        "<th class='type'>Lastname</th>" +
        "<th class='delete'>Permissions</th>" +
        "<th class='delete'>Action</th>"
    ));
    for (let i = 0; i < data.length; i++) {
        drawRowUser(data[i]);
    }
}

function drawRowUser(rowData) {
    let row = $("<tr />");
    $("#userTable").append(row);
    row.append($(
        "<td>" + rowData.email + "</td>" +
        "<td>" + rowData.firstname + "</td>" +
        "<td>" + rowData.lastname + "</td>" +
        "<td>" + rowData.permissions + "</td>" +
        "<td>" +
        "Change permissions&nbsp&nbsp<a><img src='../images/update.png' class='cart' onclick=\"updateUser('" + rowData.email + "\');\"></a>" +
        "&nbsp&nbsp&nbsp&nbsp" +
        "Delete user&nbsp&nbsp<a><img src='../images/delOne.png' class='cart' onclick=\"delUser('" + rowData.email + "\');\"></a>" +
        "</td>"
    ));
}

function delUser(data) {
    $.ajax({
        type: 'DELETE',
        data: {"email": data},
        url: "/api/auth/deluser",
        success: function (data) {
            location.reload();
        }
    });
}

function updateUser(data) {
    $.ajax({
        type: 'POST',
        data: {"email": data},
        url: "/api/auth/updateuser",
        success: function (data) {
            location.reload();
        }
    });
}

$(document).ready(() => {
    $("#btnAddFood").click(addFood);
});

// $(document).ready(() => {
//     $("#btnDeleteFood").click(delFood);
// });

$(document).ready(() => {
    $("#btnClearFood").click(clearFood);
});


$(document).ready(() => {
    $("#modal_close").click(PopUpHide);
});