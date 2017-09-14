// Flip an element on hover or on click
rh.test.flip = {
    attr: {
        trigger: "data-ux-flip-on",
        visible: "data-ux-visible"
    },
    action: function( $el ) {}
};

// For all flip-enabled elements, attach an on click or on hover event
$( "[" + rh.test.flip.attr.trigger + "]", context ).each( function( idx, val ) {
    // Add your trigger event here
} );
