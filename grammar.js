/**
 * @file A small low-overhead scripting language used in a custom game engine.
 * @author Gordon Novak <novak9@stolaf.edu>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "gscript",

  // Tells Tree-sitter it's okay to figure out 'use' contextually
  conflicts: $ => [
    [$.keyword, $.import]
  ],

  rules: {
    source_file: $ => repeat($._definition),

    _definition: $ => choice(
      $.comment,
      $.import,
      $.function_definition,
      $._expression
    ),

    _expression: $ => choice(
      $.keyword,
      $.identifier,
      $.number,
      $.string,
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

    escape: $ => /\\["\\ntr]/,

    type: $ => choice(
      "bool",
      "int",
      "uint",
      "float",
      "str"
    ),

    // Enforce higher sequence parsing precedence
    function_definition: $ => prec(2, seq(
      'fn',
      alias($.identifier, $.function_name),
      $.parameter_list
    )),

    parameter_list: $ => seq(
      '(',
      commaSeparated($.identifier),
      ')'
    )
  }
});

function commaSeparated(rule) {
  return optional(seq(rule, repeat(seq(',', rule))));
}
