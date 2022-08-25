// no-empty-catch.spec.js
const { RuleTester } = require('eslint');
const removeEmptyStyles = require('../src/rules/remove-empty-styles.js');
const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
});

ruleTester.run('remove-empty-styles', removeEmptyStyles, {
  valid: [
    {
      name: 'Styles is not present',
      code: `
        @Component({
          selector: 'app-root'
        })
        public class AppComponent {}
      `,
    },
    {
      name: 'A non empty styles',
      code: `
        @Component({
          selector: 'app-root',
          styles: ['.foo { color: red; }']
        })
        public class AppComponent {}
      `,
    },
  ],
  invalid: [
    {
      code: `
@Component({
  selector: 'app-root',
  styles: [],
})
public class AppComponent {}`,
      output: `
@Component({
  selector: 'app-root',
` + `  ` + `
})
public class AppComponent {}`,
      errors: [
        {
          messageId: 'removeEmptyStyles',
          suggestions: [
            {
              messageId: 'removeEmptyStylesSuggestion',
              output: `
@Component({
  selector: 'app-root',
` + `  ` + `
})
public class AppComponent {}`
            }
          ]
        }
      ],
  }]
});

