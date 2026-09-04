import XCTest
import SwiftTreeSitter
import TreeSitterGscript

final class TreeSitterGscriptTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_gscript())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Gordie's Scripting Language grammar")
    }
}
