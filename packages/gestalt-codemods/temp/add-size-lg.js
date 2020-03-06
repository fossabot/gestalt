/**
 * Converts
 *  <TextField />
 * to
 *  <TextField size="lg" />
 */

export default function transformer(file, api) {
  const j = api.jscodeshift;
  const src = j(file.source);
  let localIdentifierName;

  src.find(j.ImportDeclaration).forEach(path => {
    const decl = path.node;
    if (decl.source.value !== 'gestalt') {
      return;
    }
    const specifier = decl.specifiers.find(
      node =>
        node.imported.name === 'SearchField' ||
        node.imported.name === 'SelectList' ||
        node.imported.name === 'Tabs' ||
        node.imported.name === 'TextField'
    );
    if (!specifier) {
      return;
    }
    localIdentifierName = specifier.local.name;
  });

  if (!localIdentifierName) {
    return;
  }

  console.log(localIdentifierName);

  let hasModifications = false;

  const transform = src
    .find(j.JSXElement)
    .forEach(path => {
      const { node } = path;

      if (node.openingElement.name.name !== localIdentifierName) {
        return;
      }

      const hasSize = node.openingElement.attributes.find(
        attr => attr.name && attr.name.name === 'size'
      );

      if (hasSize) {
        return;
      }

      node.openingElement.attributes = [
        ...node.openingElement.attributes,
        j.jsxAttribute(j.jsxIdentifier('size'), j.literal('lg')),
      ];

      // Sort attributes alphabetically
      node.openingElement.attributes.sort((a, b) => {
        if (!a.name) {
          return -1;
        }
        if (!b.name) {
          return 1;
        }
        return a.name.name.localeCompare(b.name.name);
      });

      j(path).replaceWith(node);

      hasModifications = true;
    })
    .toSource();

  return hasModifications ? transform : null;
}
