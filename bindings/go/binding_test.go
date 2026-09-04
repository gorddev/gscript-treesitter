package tree_sitter_gscript_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_gscript "github.com/gorddev/gscript-treesitter.git/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_gscript.Language())
	if language == nil {
		t.Errorf("Error loading Gordie's Scripting Language grammar")
	}
}
