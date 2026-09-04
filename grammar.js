/**
 * @file A small low-overhead scripting language used in a custom game engine.
 * @author Gordon Novak <novak9@stolaf.edu>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "gscript",

  // FIX: Added conflicts for literals and types so they don't collide with generic identifiers
  conflicts: $ => [
    [$.keyword, $.import],
    [$.identifier, $.constant],
    [$.identifier, $.type]
  ],

  rules: {
    source_file: $ => repeat($._definition),

    _definition: $ => choice(
      $.comment,
      $.keyword,
      $.identifier,
      $.number,
      $.string,
      $.import,
      $.escape,
      $.type,
      $.constant
    ),

    comment: $ => /#.*/,

    constant: $ => choice(
      'true',
      'false',
      'null'
    ),

    directive: $ => choice(
      'as'
    ),

    import: $ => seq(
      'use',
      alias(/[a-zA-Z_][a-zA-Z0-9_]*/, $.module_name)
    ),

    keyword: $ => choice(
      'if', 'elif', 'else', 'for', 'while', 'return', 'fn',
      'use'
    ),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    number: $ => /\d+(\.\d+)?/,

    string: $ => /".*"/,

    // FIX: Simplified escape sequence token matching standard backslash escapes
    escape: $ => /\\["\\ntr]/,

    type: $ => choice(
      "bool",
      "int",
      "uint",
      "float",
      "str"
    )
  }
});
