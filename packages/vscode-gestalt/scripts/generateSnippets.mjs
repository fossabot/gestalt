import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import fs from "fs";
import path from "path";
import { parse as reactDocgenParse } from "react-docgen";

const GESTALT_SRC = "packages/gestalt/src/";
const GESTALT_VSCODE = "packages/vscode-gestalt/";

const gestaltImports = async () => {
  const GESTALT_EXPORTS = await fs.promises.readFile(
    path.join(GESTALT_SRC, "index.js"),
    "utf-8"
  );

  const ast = parse(GESTALT_EXPORTS, {
    sourceType: "module",

    plugins: ["jsx", "flow"],
  });

  const imports = [];

  traverse.default(ast, {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ImportDeclaration: function (nodePath) {
      // console.log(path.node.source.value);

      nodePath.node.specifiers.forEach((specifier) => {
        imports.push({
          name: specifier.local.name,
          filePath: path.join(GESTALT_SRC, nodePath.node.source.value),
        });
      });
    },
  });

  return imports;
};

// Escape dollar signs in prop values so we don't get the following exception:
// One or more snippets very likely confuse snippet-variables and snippet-placeholders
// (see https://code.visualstudio.com/docs/editor/userdefinedsnippets#_snippet-syntax for more details)
function escapePropValue(propValue) {
  return propValue.replace(/\$/g, "\\$");
}

function convertToPropValues(propsInfo) {
  return Object.entries(propsInfo).reduce((acc, [propName, propOptions]) => {
    if (propName === "children") {
      return acc;
    } else if (propOptions?.flowType?.name === "union") {
      // |error,info,warning|
      // const output = escapePropValue(
      //   `|${propOptions?.flowType.raw
      //     .replace(/\n/g, '')
      //     .split('|')
      //     .map((element) => element.trim().replace(/\'/g, ''))
      //     .join(',')}|`
      // );

      const allLiterals = propOptions?.flowType.elements.every(
        ({ name }) => name === "literal"
      );
      return {
        ...acc,
        [propName]: escapePropValue(
          allLiterals
            ? `|${propOptions?.flowType.elements
                .map((element) => element.value.replace(/\'/g, ""))
                .join(",")}|`
            : `:${propOptions?.flowType?.elements
                .map((element) => element.name)
                .join(" | ")}`
        ),
      };
    } else if (
      propOptions?.flowType?.name === "boolean" ||
      propOptions?.type?.name === "bool"
    ) {
      return {
        ...acc,
        [propName]: `|true,false|`,
      };
    } else if (
      [propOptions?.type?.name, propOptions?.flowType?.name].includes("string")
    ) {
      return {
        ...acc,
        [propName]: `:string`,
      };
    } else if (
      [propOptions?.type?.name, propOptions?.flowType?.name].includes("number")
    ) {
      return {
        ...acc,
        [propName]: `:number`,
      };
    } else {
      return {
        ...acc,
        [propName]: escapePropValue(
          `:${
            propOptions?.flowType?.raw?.replace(/\s\s+/g, " ") ??
            propOptions?.type?.name
          }`
        ),
      };
    }
  }, {});
}

async function init() {
  const imports = await gestaltImports();

  const mappedImports = await Promise.all(
    imports.map(async ({ filePath, name }) => {
      const contents = await fs.promises.readFile(filePath);
      try {
        return {
          docgen: reactDocgenParse(contents),
          filePath,
          name,
        };
      } catch (error) {
        // console.error(`${filePath}: ${error.message}`);
        return null;
      }
    })
  );

  const output = mappedImports
    .filter(Boolean)
    .map(({ docgen, filePath, name }) => {
      const requiredProps = docgen.props
        ? convertToPropValues(
            Object.fromEntries(
              Object.entries(docgen.props).filter(([propName, propOptions]) => {
                return propOptions.required;
              })
            )
          )
        : null;

      const hasChildrenProp = Boolean(docgen?.props?.children);
      const props = requiredProps
        ? Object.entries(requiredProps).map(([propName, propValue], index) => {
            const [leftDelimiter, rightDelimiter] = propValue.startsWith(":")
              ? [`{`, `}`]
              : ['"', '"'];

            return `\t${propName}=${leftDelimiter}\${${
              index + 1
            }${propValue}}${rightDelimiter}`;
          })
        : null;

      return {
        [`Gestalt ${name}`]: {
          prefix: `<${name}`,
          scope: "javascript,typescript,javascriptreact",
          body:
            !props?.length && hasChildrenProp
              ? [`<${name}>`, "\t${0:node}", `</${name}>`]
              : [
                  `<${name}`,
                  ...(props?.length ? props : []),
                  hasChildrenProp
                    ? `>\${${
                        props?.length ? props.length + 1 : 0
                      }:node}</${name}>`
                    : "/>",
                ].filter(Boolean),
        },
      };
    })
    .reduce((acc, currentValue) => {
      return {
        ...acc,
        ...currentValue,
      };
    }, {});

  await fs.promises.writeFile(
    path.join(GESTALT_VSCODE, "src", "snippets.json"),
    JSON.stringify(output, null, 4)
  );
}

init();

// {
//   "Gestalt Callout": {
//     "prefix": ["callout"],
// 		"body": ["<Callout",
// 		"\ticonAccessibilityLabel=\"${1:string}\"",
// 		"\tmessage=\"${2:string}\"",
// 		"\ttype=\"${3|error,info,warning|}\"",
// 		" />"],
//     "description": "Gestalt Callout Component"
//   }
// }
