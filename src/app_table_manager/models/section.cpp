#include "models/section.h"

#include <regex>

Section::Section(vector<string> descriptionLines) {
  description = vector<string>(descriptionLines);
}

void Section::ParseDescriptionLine(string line) {
  std::regex e("\\*\\s{2}(.+)\\r?\\n?");
  std::smatch matchSet;

  std::regex_match(line, matchSet, e);

  if (matchSet.size() == 2)
    description.push_back(matchSet[1]);
}

string Section::Format(int id) {
  string text = "";

  text += "****************************************";
  text += '\n';
  for (string line : description) {
    text += "*  ";
    text += line;
    text += '\n';
  }
  text += '\n';
  text += "****************************************";

  return text;
}

vector<string> Section::GetDescription() {
  return description;
}
