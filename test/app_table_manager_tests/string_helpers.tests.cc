#include <catch2/catch_test_macros.hpp>

#include <utils/string_helpers.h>

namespace state_table_editor {

TEST_CASE("tokenize by space", "[string_helpers]") {
  vector<string> expectedOutput;

  SECTION("normal string") {
    string input = "This is a string with spaces";

    expectedOutput.push_back("This");
    expectedOutput.push_back("is");
    expectedOutput.push_back("a");
    expectedOutput.push_back("string");
    expectedOutput.push_back("with");
    expectedOutput.push_back("spaces");

    vector<string> output = StringHelpers::Tokenize(input, ' ');
    REQUIRE(output == expectedOutput);
  }

  SECTION("leading spaces") {
    string input = "   This is a string with leading spaces";

    expectedOutput.push_back("This");
    expectedOutput.push_back("is");
    expectedOutput.push_back("a");
    expectedOutput.push_back("string");
    expectedOutput.push_back("with");
    expectedOutput.push_back("leading");
    expectedOutput.push_back("spaces");

    vector<string> output = StringHelpers::Tokenize(input, ' ');

    REQUIRE(output == expectedOutput);
  }

  SECTION("trailing spaces") {
    string input = "This is a string with trailing spaces    ";

    expectedOutput.push_back("This");
    expectedOutput.push_back("is");
    expectedOutput.push_back("a");
    expectedOutput.push_back("string");
    expectedOutput.push_back("with");
    expectedOutput.push_back("trailing");
    expectedOutput.push_back("spaces");

    vector<string> output = StringHelpers::Tokenize(input, ' ');

    REQUIRE(output == expectedOutput);
  }

  SECTION("extra spaces between tokens") {
    string input = "This is   a    string  with extra spaces";

    expectedOutput.push_back("This");
    expectedOutput.push_back("is");
    expectedOutput.push_back("a");
    expectedOutput.push_back("string");
    expectedOutput.push_back("with");
    expectedOutput.push_back("extra");
    expectedOutput.push_back("spaces");

    vector<string> output = StringHelpers::Tokenize(input, ' ');

    REQUIRE(output == expectedOutput);
  }
}

TEST_CASE("tokenize by -", "[string_helpers]") {
  SECTION("normal sentence") {
    string input = "This-is-a-string-with-dashes";

    vector<string> expectedOutput;

    expectedOutput.push_back("This");
    expectedOutput.push_back("is");
    expectedOutput.push_back("a");
    expectedOutput.push_back("string");
    expectedOutput.push_back("with");
    expectedOutput.push_back("dashes");

    vector<string> output = StringHelpers::Tokenize(input, '-');
    REQUIRE(output == expectedOutput);
  }
}

}  // namespace state_table_editor