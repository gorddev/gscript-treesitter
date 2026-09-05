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
      $.constant,
      $.type,
      $.special_type,
      $.number,
      $.string,
      $.identifier,
      $.operator
    ),

    keyword: $ => choice(
      'if',
      'elif',
      'else',
      'for',
      'while',
      'return',
      'as',
      'decl',
      'end',
      'done'
    ),

    comment: $ => /#.*/,

    constant: $ => choice(
      "true",
      "false",
      "null"
    ),

    type: $ => choice(
      "bool",
      "int",
      "uint",
      "float"
    ),

    special_type: $ => choice(
      'str'
    ),

    import: $ => seq(
      "use",
      alias(/[a-zA-Z_][a-zA-Z0-9_]*/, $.module_name)
    ),

    function_definition: $ => seq(
      "fn",
      alias($.identifier, $.function_name),
      $.parameter_list
    ),

    parameter_list: $ => seq(
      "(",
      commaSeparated($.identifier),
      ")"
    ),

    operator: $ => choice(
      '==',
      '!=',
      '=',
      '+',
      '-',
      '/',
      '*',
      '!'
    ),

    number: $ => /\d+(\.\d+)?/,

    string: $ => seq(
      '"',
      repeat(choice(
        $.escape,
        /[^"\\\n]/
      )),
      '"'
    ),

    escape: $ => /\\["\\ntr]/,

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/
  }
});

function commaSeparated(rule) {
  return optional(seq(rule, repeat(seq(",", rule))));
}
