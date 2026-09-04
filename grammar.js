/**
 * @file A small low-overhead scripting language used in a custom game engine.
 * @author Gordon Novak <novak9@stolaf.edu>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "gscript",

  conflicts: $ => [
    [$.keyword, $.import]
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
      $.constant,
      $.function_definition
    ),

    // FIX: Added prec(2) to resolve conflict with the standalone 'fn' keyword
    function_definition: $ => prec(2, seq(
      'fn',
      alias($.identifier, $.function_name),
      $.parameter_list
    )),

    parameter_list: $ => seq(
      '(',
      commaSeparated($.identifier),
      ')'
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
    )
  }
});

function commaSeparated(rule) {
  return optional(seq(rule, repeat(seq(',', rule))));
}
