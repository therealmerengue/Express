$(document).ready(function () {
    var sideDivs = ['d1', 'd2'];
    var pageWidth = $(document).width();
    var sideNavWidth = $('.sidenav').css('width');

    jQuery.each(sideDivs, function(i, val) {
        $("#" + val).resizable({
            handles: 'e, w',
            minWidth: 0.3 * pageWidth,
            maxWidth: 0.5 * pageWidth
        });
    });

    $(".sidenav-list li a").click(function () {

        // Set the effect type
        var effect = 'slide';

        // Set the options for the effect type chosen
        var options = { direction: 'right', distance: sideNavWidth };

        // Set the duration (default: 400 milliseconds)
        var duration = 450;

        var toggledElement = $(this.getAttribute('href'));

        var toggleElement = function() {
            toggledElement.toggle(effect, options, duration, function() {
                toggledElement.css('width', '30%');
            });
        }

        for (var i = 1; i <= 2; i++) {
            var name = '#d';
            name += i;
            if ($(name).is(":visible") && toggledElement.attr("id") != name.substring(1)) {
                $(name).toggle(effect, options, duration, function() {
                    toggleElement();
                });
                return;
            }
        }
        toggleElement();
    });
});



