#ifndef STATE_TABLE_EDITOR_INCLUDE_STRING_HELPERS_H_
#define STATE_TABLE_EDITOR_INCLUDE_STRING_HELPERS_H_

#include <string>
#include <vector>

using std::string;
using std::vector;

namespace state_table_editor {

class StringHelpers {
 public:
  StringHelpers() = delete;

  static vector<string> Tokenize(const std::string str, const char delimitter);
};

} // namespace state_table_editor

#endif  // STATE_TABLE_EDITOR_INCLUDE_STRING_HELPERS_H_
