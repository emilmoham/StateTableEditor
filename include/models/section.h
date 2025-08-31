#ifndef SRC_APP_TABLE_MANAGER_INCLUDE_MODELS_SECTION_H_
#define SRC_APP_TABLE_MANAGER_INCLUDE_MODELS_SECTION_H_

#include <string>
#include <vector>
#include <memory>

#include "renderable.h"

using std::shared_ptr;
using std::string;
using std::vector;
using std::weak_ptr;

namespace state_table_editor {

class Section : public IRenderable {
 public:
  explicit Section(vector<string> description = vector<string>());
  void ParseDescriptionLine(string line);

  string Format(int id = -1);

  vector<string> GetDescription();

 private:
  vector<string> description;
};

} // namespace state_table_editor

#endif  // SRC_APP_TABLE_MANAGER_INCLUDE_MODELS_SECTION_H_

