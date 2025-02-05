const { getDecoratorName, isAngularSignal, hasDecorator } = require('../utils');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "suggestion",
    hasSuggestions: true,
    docs: {
      description:
        "Enforces the use of the OnPush strategy when there's nothing injected in the constructor.",
    },
    messages: {
      strategyOnPush: 'This component looks presentation only. Use strategy on push.',
      strategyOnPushSuggestion: 'Use strategy on push.',
    },
    fixable: "code",
  },
  /** @param {import('eslint').Rule.RuleContext} context */
  create: function (context) {
    return {
      /** @param {import('estree').ClassDeclaration & import('eslint').Rule.NodeParentExtension} node */
      ClassDeclaration(node) {
        /** @type {import('@typescript-eslint/typescript-estree').TSESTree.Decorator} */
        const componentDecorator = node?.decorators?.find((decorator) => {
          return getDecoratorName(decorator) === "Component";
        });

        if (!componentDecorator) {
          return;
        }

        /** @type {import('estree').MethodDefinition} */
        const constructor = node.body.body.find(
          (e) => e.kind === "constructor"
        );
        const params = constructor?.value?.params;
        if (constructor) {
          if (!params || params.filter((e) => e.accessibility).length > 0) {
            return;
          }
        }

        const hasInject = node.body.body.find((e) => {
          return e.type === "PropertyDefinition" && isAngularSignal(e, "inject");
        });

        if (hasInject) {
          return;
        }

        const hasIOProperty = node.body.body.find((e) => {
          if (e.type !== "PropertyDefinition") {
            return false;
          }
          if (isAngularSignal(e, "input") ||
              isAngularSignal(e, "output") ||
              hasDecorator(e, "Input") ||
              hasDecorator(e, "Output")
            ) {
            return false;
          }

          return true;
        });

        if (hasIOProperty) {
          return;
        }

        const decoratorParams =
          componentDecorator?.expression?.arguments?.[0]?.properties?.map(
            (e) => e.value
          );
        if (!decoratorParams) {
          return;
        }

        const hasStrategyOnPush = decoratorParams.some(
          (e) =>
            e.object?.name === "ChangeDetectionStrategy" &&
            e.property?.name === "OnPush"
        );
        if (hasStrategyOnPush) {
          return;
        }

        /** @type {import('eslint').Rule.SuggestionReportDescriptor} */
        const suggestion = {
          messageId: "strategyOnPushSuggestion",
          * fix(fixer) {
            yield fixer.insertTextAfter(decoratorParams[decoratorParams.length - 1], ',\nchangeDetection: ChangeDetectionStrategy.OnPush');
          },
        }

        context.report({
          node: componentDecorator,
          messageId: "strategyOnPush",
          fix: suggestion.fix,
          suggest: [suggestion],
        });
      },
    };
  },
}
