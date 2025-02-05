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
    {
      name: "Injected dependency, no strategy onpush",
      code: `
        @Component({
          selector: 'app-root',
        })
        public class AppComponent {
          someService = inject(Service);
        }
      `,
    },
    {
      name: "Input, no property",
      code: `
        @Component({
          selector: 'app-root',
          changeDetection: ChangeDetectionStrategy.OnPush,
        })
        public class AppComponent {
          @Input() someInput: string;
        }
      `,
    },
    {
      name: "Input signal, no property",
      code: `
        @Component({
          selector: 'app-root',
          changeDetection: ChangeDetectionStrategy.OnPush,
        })
        public class AppComponent {
          someInput = input("some");
        }
      `,
    },
    {
      name: "property that is not an input nor an output",
      code: `
        @Component({
          selector: 'app-root',
        })
        public class AppComponent {
          someInput = signal();
        }
      `,
    }
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
    {
      name: "property that is not an input nor an output",
      code: `
        @Component({
          selector: 'app-root',
        })
        public class AppComponent {
          someInput = input('');
        }`,
      output: `
        @Component({
          selector: 'app-root',
changeDetection: ChangeDetectionStrategy.OnPush,
        })
        public class AppComponent {
          someInput = input('');
        }`,
      errors: [
        {
          messageId: "strategyOnPush",
          suggestions: [
            {
              messageId: 'strategyOnPushSuggestion',
              output: `
        @Component({
          selector: 'app-root',
changeDetection: ChangeDetectionStrategy.OnPush,
        })
        public class AppComponent {
          someInput = input('');
        }`,
            },
          ],
        },
      ],
    }
  ],
});
