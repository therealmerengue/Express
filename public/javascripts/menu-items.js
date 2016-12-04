$(document).ready(function() {
    var sideDivs = ['d3'];
    var pageWidth = $(document).width();
    var sideNavWidth = $('.sidenav').css('width');

    jQuery.each(sideDivs, function(i, val) {
        $("#" + val).resizable({
            handles: 'e, w',
            minWidth: 0.3 * pageWidth,
            maxWidth: 0.5 * pageWidth
        });
    });

    $(".sidenav-list li a").click(function() {
        var effect = 'slide';
        var options = { direction: 'right', distance: sideNavWidth };
        var duration = 450;

        var toggledElement = $(this.getAttribute('href'));

        $('.sidenav-list li a').not(this).removeClass('active');
        $(this).toggleClass('active');

        var toggleElement = function() {
            toggledElement.toggle(effect, options, duration, function() {
                if (toggledElement.attr("id") != 'd1' && toggledElement.attr("id") != 'd2')
                    toggledElement.css('width', '30%');
            });

        }

        for (var i = 1; i <= 3; i++) {
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

    $('.btn-primary').on('click', function() {
        map.setStyle('/styles/' + $(this).find('input').attr('id') + '.json');
    });

    $('.vehicle').on('click', function() {
        $.ajax({
            url: '/info/' + $(this).find('span').html().replace(/\s/g, '%20'),
            success: function (data) {
                alert(JSON.stringify(data));
                map.flyTo({center: data.current[0].geometry.coordinates, zoom: 11});
            },
            complete: this.ajax_complete,
            dataType: 'json'
        });
    });
});



