//TODO: Cart's items
function getItemCart() {
    $.ajax({
        url: "/api/order/itemcart",
        type: "GET",
        dataType: "json",
        success: (data) => {
            drawTable(data);
        }
    })
}

function drawTable(data) {
    let row = $("<tr />");
    $("#cartTable").append(row);
    row.append($(
        "<th class='name'>Name</th>" +
        "<th class='price'>Price</th>" +
        "<th class='count'>Count</th>" +
        "<th class='delete'>Delete</th>"));
    for (let i = 0; i < data.length; i++) {
        drawRow(data[i]);
    }
}

function drawRow(rowData) {
    let row = $("<tr />");
    $("#cartTable").append(row);
    row.append($(
        "<td>" + rowData.name + "</td>" +
        "<td>" + rowData.price + "</td>" +
        "<td>" + rowData.count + "</td>" +
        "<td>" +
        "All&nbsp&nbsp&nbsp" +
        "<a><img src='../images/delAll.png' class='cart' onclick=\"delAllFromCart('" + rowData.name + "\');\"></a>" +
        "&nbsp&nbsp&nbsp" +
        "One&nbsp&nbsp&nbsp" +
        "<a><img src='../images/delOne.png' class='cart' onclick=\"delOneFromCart('" + rowData.name + "\');\"></a>" +
        "</td>"
    ));
}

//TODO: History order
function getHistoryOrder() {
    $.ajax({
        url: "/api/order/historyorder",
        type: "GET",
        dataType: "json",
        success: (data) => {
            drawTableHistory(data);
        }
    })
}

function drawTableHistory(data) {
    let row = $("<tr />");
    $("#histiryCart").append(row);
    row.append($(
        "<th class='id_order'>ID order</th>" +
        "<th class='name'>Name</th>" +
        "<th class='price'>Price</th>" +
        "<th class='count'>Count</th>" +
        "<th class='date_order'>Date order</th>"));
    for (let i = 0; i < data.length; i++) {
        drawRowHistory(data[i]);
    }
}

function drawRowHistory(rowData) {
    let row = $("<tr />");
    $("#histiryCart").append(row);
    row.append($(
        "<td>" + rowData.id_order + "</td>" +
        "<td>" + rowData.name + "</td>" +
        "<td>" + rowData.price + "</td> " +
        "<td>" + rowData.count + "</td> " +
        "<td>" + rowData.date_order + "</td>"
    ));
}

//TODO: Delete functions
function delAllFromCart(data) {
    $.ajax({
        url: "/api/order/delallfromcart",
        type: "POST",
        dataType: "json",
        data: {"name": data},
        success: (data) => {
            $("#cartTable tr").remove();
            getItemCart();
            location.reload();
        }
    })
}

function delOneFromCart(data) {
    $.ajax({
        url: "/api/order/delonefromcart",
        type: "POST",
        dataType: "json",
        data: {"name": data},
        success: (data) => {
            // $("#cartTable tr").remove();
            //getItemCart();
            location.reload();
        }
    })
}

//TODO: Pay functions
function pay() {
    $.ajax({
        url: "/api/order/pay",
        type: "GET",
        dataType: "json",
        success: (data) => {
            // $("#cartTable tr").remove();
            // $("#histiryCart tr").remove();
            // getHistoryOrder();
            location.reload();
        }
    })
}

$(document).ready(() => {
    $("#buttonPay").click(pay);
});