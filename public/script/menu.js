function getMenu(type) {
    $.ajax({
        url: "/api/menu/getmenu",
        type: "POST",
        dataType: "json",
        data: {"type_food": type},
        success: (data) => {
            drawTable(data);
        }
    })
}

function drawTable(data) {
    let row = $("<tr />");
    $("#foodTable").append(row);
    row.append($("<th class='name'>Name</th>" +
        "<th class='price'>Price</th>" +
        "<th class='action'>Action</th>"));
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
        "<td><a><img src='../images/cart.png' class='cart' onclick=\"addtocart('" + rowData.name + "\'); \"></a></ad></td>"));
}

function addtocart(data) {
    $.ajax({
        url: "/api/order/tocart",
        type: "POST",
        dataType: "json",
        data: {"name": data},
        success: (data) => {
            if (data) {
                countCart();
                totalOrder();
            }
        }
    })
}

function countCart() {
    $.ajax({
        url: "/api/order/countcart",
        type: "GET",
        dataType: "json",
        success: (result) => {
            $('#countOrder').text("Товаров в корзине: " + JSON.stringify(result));
        }
    })
}

function totalOrder() {
    $.ajax({
        url: "/api/order/totalcart",
        type: "GET",
        dataType: "json",
        success: (result) => {
            $('#totalOrder').text("Cумма заказа: " + JSON.stringify(result));
        }
    })
}