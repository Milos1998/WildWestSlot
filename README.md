# WildWestSlot
This is wild west themed slot machine. Tech used in this project is Pixijs, Typescript, Webpack and GSAP. I've implemented singleton creation pattern and reactive programming pattern in this project.

# Live version
[Latest uploaded version]: https://optimistic-panini-c999f6.netlify.app/

Note: game has cheat mode, where you can remove or add symbols. It is activated by clicking and holding information button in the upper right corner for 1 second.

# Project setup
`npm install`

## Compiles and hot-reloads for development
`npm run dev`

## Compiles and minifies for production
`npm run build-only`

This command compiles dist file. After building you have to serve your dist file. For Ubuntu you can run `serve -s dist` to serve it locally.

## Formats src files
`npm run prettier-format`

# What I learned
During this project I've learned:
- Typescript
- Webpack advanced features (adding plugins, using linter within webpack etc.)
- pixijs advanced features (using loader, masking, animating with gsap, etc.)
- how to use prettier (as suggestion from mentor)
- how to use linter (as suggestion from mentor)
- singleton creation pattern (as suggestion from mentor)
- memory profiling chrome devtool - basics (used for detecting memory leaks)
- I've learned that garbage collector doesn't affect GPU's memory and that it has to be emptied by programmer
- Autoplay policy in Chrome and other browsers and that it can't be defeated
- gsap has great support service
