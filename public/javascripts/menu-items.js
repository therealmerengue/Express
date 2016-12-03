$(document).ready(function () {
    var sideDivs = ['d2'];
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
                if (toggledElement.attr("id") != 'd1')
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

    $('.btn-primary').on('click', function () {
        map.setStyle('/styles/' + $(this).find('input').attr('id') + '.json');
    });

    $('.vehicle').on('click', function () {
        $.ajax({
            url: '/info/' + $(this).html().replace(/\s/g, '%20'),
            success: function (data) {
                alert(JSON.stringify(data));
            },
            complete: this.ajax_complete,
            dataType: 'json'
        });
    });
});



