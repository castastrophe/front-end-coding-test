# Front-end coding test

Contained within this repo is a series of problems to be solved using HTML, CSS, and JavaScript.  Feel free to put comments in the files to explain your solution.  Try to maintain a similar coding style to the other examples in the repository.

These are intentionally open-ended to give you a chance to express your creativity and style.  Also these tests shouldn't take longer than a few hours, so please don't spend too long on them.

Have fun, show off, and please give us feedback so we can make this better!

* **[Test 1](instructions/example1.html)**: This contains the detailed instructions for the first coding test.

## Getting started

To get started with this, simply fork this repository, make your changes, and send us a link to your repo so we can have a look.

1. [Fork the repository](https://help.github.com/articles/fork-a-repo/)
2. Once you have the repo pulled down, move into the directory and run: `npm install`
3. To kick off the local environment run: `grunt watcher`

## Repo guide

All the code you will be editing in this test lives inside the `src` folder.

- `assets`: This contains the image assets for use in the project.
- `example1`: This contains the test-specifc JavaScript, styles, and templates for the first test.
- `library`: This contains the global components and layouts used in the tests:
  - `components`: Components are small, reusable templates and styles.
  - `layouts`: Layouts are used as containers for components and can provide padding, layout, and semantic markup.
- `sass`: This folder contains the global Sass styles including extends, mixins, and variables.

### Q: Where can I find...
- **Card markup?** `library/layouts/_card.twig`
- **Sass color variables?** `sass/global/variables/_global-variables.scss`
- **Card content?** `data.json`