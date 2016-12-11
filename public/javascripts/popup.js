function getPopup(data) {
    var popupDiv = window.document.createElement('div');

    var content = window.document.createElement('div');
    content.setAttribute('class', 'content panel panel-default material-panel material-panel_primary');

    var span = document.createElement('span');
    span.setAttribute('class', 'x');
    span.onclick = function() {
        span.parentElement.parentElement.remove();
        if (map.getZoom() > 8)
            map.flyTo({zoom: map.getZoom() - 3});
        else
            map.flyTo({zoom: map.getZoom() - 1});
    };
    span.innerHTML = '&times;';

    var popupHeader = document.createElement('h3');
    popupHeader.innerHTML = data.plate;
    popupHeader.setAttribute('class', 'panel-heading material-panel__heading');

    var popupBody = document.createElement('div');
    popupBody.setAttribute('class', 'panel-body material-panel__body');

    var speed = document.createElement('h5');
    speed.innerHTML = 'Speed: ' + data.speed;
    var distance = document.createElement('h5');
    distance.innerHTML = 'Distance: ' + data.distance;

    var popupFooter = document.createElement('div');
    popupFooter.setAttribute('class', 'popup-footer');

    var historyButton = document.createElement('a');
    historyButton.setAttribute('class', 'btn btn-primary');
    historyButton.setAttribute('data-toggle', 'modal');
    historyButton.setAttribute('data-target', '#historyModal');
    historyButton.setAttribute('href', '#historyModal');
    historyButton.setAttribute('role', 'button');
    historyButton.setAttribute('style', 'display: block;');
    historyButton.innerHTML = 'Show history';
    historyButton.onclick = function() {
        //span.parentElement.remove();
    };

    popupHeader.appendChild(span);
    popupFooter.appendChild(historyButton);
    content.appendChild(popupHeader);
    popupBody.appendChild(speed);
    popupBody.appendChild(distance);
    content.appendChild(popupBody);
    content.appendChild(popupFooter);
    popupDiv.appendChild(content);

    popupDiv.style.visibility = 'visible';

    return popupDiv;
}