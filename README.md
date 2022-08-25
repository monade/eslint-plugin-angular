# @monade/eslint-plugin-angular
A couple of quality-of-life eslint rules for Angular components.

**THIS PROJECT IS UNDER ACTIVE DEVELOPMENT. IT MAY NOT WORK AS INTENDED**

## Usage

Install:

```bash
yarn add --dev @monade/eslint-plugin-angular
```

Add to your .eslint.js:
```javascript
   plugins: [
     ...,
     "@monade/angular"
   ]
   ...
   rules: {
     ...,
      "@monade/angular/remove-empty-styles": 2,
      "@monade/angular/strategy-onpush": 2,
   }
```

## Rules:
... **TODO** ...

## TODO:
* Document rules
* When strategy is OnPush, show an error if there's a non-scalar property that is not ReadOnly<>

## Debugging
You can use an AST view tool
* For Javascript: https://astexplorer.net/
* For Typescript: https://ts-ast-viewer.com/

About Monade
----------------

![monade](https://monade.io/wp-content/uploads/2021/06/monadelogo.png)

@monade/eslint-plugin-angular is maintained by [mònade srl](https://monade.io/en/home-en/).

We <3 open source software. [Contact us](https://monade.io/en/contact-us/) for your next project!
