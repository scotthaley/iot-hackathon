var socket = io();

socket.on('new data point', function(msg) {
  var alternate = !$("#data_table").find('tr').last().hasClass('alternate');
  var $row = $("<tr></tr>");
  if (alternate) {
    $row.addClass("alternate");
  }
  $row.append("<td>" + msg.deviceId + "</td>");
  $row.append("<td>" + msg.address + "</td>");
  $row.append("<td>" + msg.date + "</td>");
  $("#data_table").append($row);
});
