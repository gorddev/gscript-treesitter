
[
  "if"
  "elif"
  "else"
  "for"
  "while"
  "return"
  "fn"
] @keyword

(import
  "use" @keyword.import
  (module_name) @type.namespace)


(identifier) @variable

; --- Literals ---
(number) @number
(string) @string
(comment) @comment

; --- String Escape Sequences ---
(escape) @string.escape
