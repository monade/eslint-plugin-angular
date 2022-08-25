// no-empty-catch.spec.js
const { RuleTester } = require("eslint");
const strategyOnPush = require("../src/rules/strategy-onpush.js");
const ruleTester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
});

ruleTester.run("strategy-onpush", strategyOnPush, {
  valid: [
    {
      name: "No constructor, strategy onpush",
      code: `
        @Component({
          selector: 'app-root',
          changeDetection: ChangeDetectionStrategy.OnPush,
        })
        public class AppComponent {}
      `,
    },
    {
      name: "Dependency, no strategy onpush",
      code: `
        @Component({
          selector: 'app-root',
        })
        public class AppComponent {
          constructor(private readonly service: Service) {}
        }
      `,
    },
  ],
  invalid: [
    {
      code: `@Component({
  selector: 'app-root',
})
public class AppComponent {}`,
      output: `@Component({
  selector: 'app-root',
changeDetection: ChangeDetectionStrategy.OnPush,
})
public class AppComponent {}`,
      // we can use messageId from the rule object
      errors: [
        {
          messageId: "strategyOnPush",
          suggestions: [
            {
              messageId: 'strategyOnPushSuggestion',
              output: `@Component({
  selector: 'app-root',
changeDetection: ChangeDetectionStrategy.OnPush,
})
public class AppComponent {}`,
            },
          ],
        },
      ],
    },
  ],
});
