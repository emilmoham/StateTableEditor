#ifndef SRC_APP_TABLE_MANAGER_INCLUDE_STRING_HELPERS_H_
#define SRC_APP_TABLE_MANAGER_INCLUDE_STRING_HELPERS_H_

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

#endif  // SRC_APP_TABLE_MANAGER_INCLUDE_STRING_HELPERS_H_
