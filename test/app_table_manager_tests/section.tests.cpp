#include <catch2/catch_test_macros.hpp>

#include "models/section.h"

TEST_CASE("parse sections", "[section]") {
  Section section = Section();

  SECTION("single word") {
    std::string input = "*  stuff";
    std::string output = "stuff";
    section.ParseDescriptionLine(input);

    vector<string> description = section.GetDescription();

    REQUIRE(description.size() == 1);
    REQUIRE(description[0] == output);
  }

  SECTION("multiple words") {
    std::string input = "*  lots of stuff";
    std::string output = "lots of stuff";

    section.ParseDescriptionLine(input);

    vector<string> description = section.GetDescription();

    REQUIRE(description.size() == 1);
    REQUIRE(description[0] == output);
  }

  SECTION("words, numbers, and symbols") {
    std::string input = "*  do 3 (three) things";
    std::string output = "do 3 (three) things";

    section.ParseDescriptionLine(input);

    vector<string> description = section.GetDescription();

    REQUIRE(description.size() == 1);
    REQUIRE(description[0] == output);
  }

  SECTION("multiple lines") {
    std::string input0 = "*  this is line number 1";
    std::string input1 = "*  this is line number 2";
    std::string output0 = "this is line number 1";
    std::string output1 = "this is line number 2";

    section.ParseDescriptionLine(input0);
    section.ParseDescriptionLine(input1);

    vector<string> description = section.GetDescription();

    REQUIRE(description.size() == 2);
    REQUIRE(description[0] == output0);
    REQUIRE(description[1] == output1);
  }
}

TEST_CASE("format sections", "[section]") {
  Section section;

  SECTION("single line description") {
    std::string input = "this is line number 1";
    std::string output =
      "****************************************\n"
      "*  this is line number 1\n\n"
      "****************************************";
    std::vector<std::string> description;
    description.push_back(input);

    section = Section(description);

    REQUIRE(section.Format() == output);
  }

  SECTION("multiple line description") {
    std::string input0 = "this is line number 1";
    std::string input1 = "this is line number 2";
    std::string output =
      "****************************************\n"
      "*  this is line number 1\n"
      "*  this is line number 2\n\n"
      "****************************************";
    std::vector<std::string> description;
    description.push_back(input0);
    description.push_back(input1);

    section = Section(description);

    REQUIRE(section.Format() == output);
  }
}
