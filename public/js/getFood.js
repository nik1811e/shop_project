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
    row.append($("<th class='name'>" + "Name" + "</th> <th class='price'>" + "Price" + "</th><th>Action</th>"));
    for (let i = 0; i < data.length; i++) {
        drawRow(data[i]);
    }
}

function drawRow(rowData) {
    let row = $("<tr />");
    $("#foodTable").append(row);
    row.append($("<td>" + rowData.name + "</td> <td>" + rowData.price + "</td> <td> <a><img src='../images/cart.png' class='cart'></a></ad></td>"));
}