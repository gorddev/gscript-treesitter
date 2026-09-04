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
    // TODO: add the actual grammar rules
    source_file: $ => repeat($._definition),

    _definition: $ => choice(
      $.comment,
      $.directive,
      $.keyword,
      $.identifier,
      $.number,
      $.string,
      $.import,
      $.escape
    ),

    comment: $ => /#.*/,

    import: $ => seq(
      'use',
      alias(/[a-zA-Z_][a-zA-Z0-9_]*/, $.module_name)
    ),

    directive: $ => choice(
      'use',
      'as'
    ),

    keyword: $ => choice(
      'if',
      'elif',
      'else',
      'for',
      'while',
      'return',
      'fn',
      'int',
      'uint',
      'float',
      'str'
    ),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    number: $ => /([0-9][0-9]*[0-9.][0-9]*)/,

    string: $ => /".*"/,

    escape: $ => seq(
      '"',
      alias(/\\./, $.escape),
      '"'
    )
  }
});
