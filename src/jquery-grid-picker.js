(function ($) {
    $.fn.gridPicker = function (options) {
        const defaults = {
            rows: 10,
            cols: 10,
            onSelect: function (x, y) {
                console.log(`Selected: ${x} x ${y}`);
            }
        };

        const settings = $.extend({}, defaults, options);

        // Selector to track all open overlays
        const selector = '.grid-picker-overlay';

        this.each(function () {
            const $button = $(this);
            let $overlay = null;

            // Create picker UI
            const createPicker = () => {
                const $overlayDiv = $('<div class="grid-picker-overlay"></div>');
                const $container = $('<div class="grid-picker-container"></div>');

                // Generate the grid dynamically
                for (let i = 0; i < settings.rows * settings.cols; i++) {
                    $container.append('<div class="grid-picker-cell"></div>');
                }

                $overlayDiv.append($container);
                $button.parent().append($overlayDiv); // Append to the parent of the button

                return $overlayDiv;
            };

            // Open picker
            $button.on('click', function () {
                // Close all other overlays
                $(selector).fadeOut();

                // Create the overlay if it doesn't exist
                if (!$overlay) {
                    $overlay = createPicker();
                }

                // Position the picker relative to the button
                const buttonOffset = $button.position(); // Position relative to parent
                const buttonHeight = $button.outerHeight();

                $overlay.css({
                    position: 'absolute', // Position relative to the parent container
                    top: buttonOffset.top + buttonHeight + 5 + 'px',
                    left: buttonOffset.left + 'px',
                    zIndex: 1000
                }).fadeIn();

                const $cells = $overlay.find('.grid-picker-cell');
                let selectedX = 0;
                let selectedY = 0;

                // Unbind previous events to prevent duplicates
                $cells.off('mousemove');
                $cells.off('click');

                // Mouseover effect to highlight the grid
                $cells.on('mousemove', function () {
                    const index = $cells.index($(this));
                    selectedX = (index % settings.cols) + 1;
                    selectedY = Math.floor(index / settings.cols) + 1;

                    // Reset all cells
                    $cells.removeClass('active');

                    // Highlight the selected area
                    for (let i = 0; i < selectedY; i++) {
                        for (let j = 0; j < selectedX; j++) {
                            $cells.eq(i * settings.cols + j).addClass('active');
                        }
                    }
                });

                // On click, trigger onSelect callback
                $cells.on('click', function () {
                    settings.onSelect(selectedX, selectedY);
                    $overlay.fadeOut();
                });

                // Close picker when clicking outside
                $(document).off('click.gridPicker'); // Remove previous handler
                $(document).on('click.gridPicker', function (e) {
                    if (!$(e.target).closest('.grid-picker-overlay, .grid-picker-button').length) {
                        $overlay.fadeOut();
                    }
                });

                // Adjust overlay position on window resize
                $(window).off('resize.gridPicker'); // Clean up previous resize events
                $(window).on('resize.gridPicker', function () {
                    const newButtonOffset = $button.position();
                    $overlay.css({
                        top: newButtonOffset.top + buttonHeight + 5 + 'px',
                        left: newButtonOffset.left + 'px',
                    });
                });
            });
        });

        return this;
    };
})(jQuery);

