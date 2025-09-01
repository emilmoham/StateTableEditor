#include <utils/string_helpers.h>

namespace state_table_editor {

vector<string> StringHelpers::Tokenize(
  const std::string str,
  const char delimiter) {
  vector<string> tokens;

  int lastDelimiterIndex = 0;
  for (int i = 0; i < str.size(); i++) {
    if (str.at(i) == delimiter) {
      string token = str.substr(lastDelimiterIndex, i - lastDelimiterIndex);

      if (token.size() > 0)
        tokens.push_back(token);

      lastDelimiterIndex = i + 1;
    }
  }

  if (lastDelimiterIndex < str.size()) {
    string token = str.substr(
      lastDelimiterIndex, str.size() - lastDelimiterIndex);

    if (token.size() > 0)
      tokens.push_back(token);
  }

  return tokens;
}

} // namespace state_table_editor