# Test 1
The files for this test live in the `example1` folder and contains the following assets:
	- example1.js: This is the custom JS file for this test.
	- example1.md: This is the guide you're reading right now.  No need to edit this.
	- example1.scss: This is the custom CSS for the page.
	- example1.twig: This is the custom template for the page.

## Tasks

### Mark-up
1. In example1.twig, inside the body block, check for more than one card in the array:
	- if `true` then create a wrapper div with the attribute: `data-test-layout`
	- if `false` then do not print data-test-layout attribute

### Styles
1. Our cards should have a front and a back. Set the back of card to be hidden initially. The final view should show the front of the cards only in 3 columns.
2. The content area of the band with the cards are lacking tablet and mobile styles.  You don't have to use CSS Grid unless you're comfortable in it.  Here are the specs:
  - Desktop: 3 columns
  - Tablet: 2 columns
  - Mobile: 1 column
3. Please add some snazzy styles to the CTA button!
4. Update the `.test-header-headline` use the `%default-headline style`.
	- _Hint_: check the global Sass extends

### Interactions
1. Add an on-click event that toggles the card front-to-back via the button at the bottom of the card.  Use the existing frame in the example1.js file.
