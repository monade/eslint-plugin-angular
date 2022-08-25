const { getDecoratorName } = require("../utils");

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "suggestion",
    fixable: "code",
    docs: {
      description: "Suggests to remove empty styles properties.",
    },
    hasSuggestions: true,
    messages: {
      removeEmptyStyles: "An empty `styles` property is redundant.",
      removeEmptyStylesSuggestion: "Remove property `styles`.",
    }
  },
  /** @param {import('eslint').Rule.RuleContext} context */
  create: function (context) {
    return {
      /** @param {import('estree').ClassDeclaration & import('eslint').Rule.NodeParentExtension} node */
      ClassDeclaration(node) {
        const componentDecorator = node?.decorators?.find((decorator) => {
          return getDecoratorName(decorator) === "Component";
        });

        if (!componentDecorator) {
          return;
        }

        const decoratorParams =
          componentDecorator?.expression?.arguments?.[0]?.properties?.map(
            (e) => e.value
          );

        if (!decoratorParams) {
          return;
        }

        /** @type {import('estree').AssignmentProperty} */
        const emptyStyle = decoratorParams.find(
          (e) =>
            e.parent.key.name === "styles" &&
            e.type === "ArrayExpression" &&
            e.elements.length === 0
        );

        if (!emptyStyle) {
          return;
        }
        const sourceCode = context.getSourceCode()

        const suggestion = {
          messageId: "removeEmptyStylesSuggestion",
          * fix(fixer) {
            yield fixer.remove(emptyStyle.parent);

            const comma = sourceCode.getTokenAfter(emptyStyle.parent);
            if (comma.value === ",") {
              yield fixer.remove(comma);
            }
          },
        }

        context.report({
          messageId: "removeEmptyStyles",
          node: emptyStyle.parent,
          fix: suggestion.fix,
          suggest: [suggestion],
        });
      },
    };
  },
};
