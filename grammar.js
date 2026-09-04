/**
 * @file A small low-overhead scripting language used in a custom game engine.
 * @author Gordon Novak <novak9@stolaf.edu>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "gscript",

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

    // Keep flat literal choices so Tree-sitter compiles without complex tokenizing bindings
    constant: $ => choice(
      'true',
      'false',
      'null'
    ),

    directive: $ => 'as',

    import: $ => seq(
      'use',
      alias(/[a-zA-Z_][a-zA-Z0-9_]*/, $.module_name)
    ),

    keyword: $ => choice(
      'if', 'elif', 'else', 'for', 'while', 'return', 'fn', 'use'
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
