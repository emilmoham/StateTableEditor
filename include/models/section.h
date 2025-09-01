#ifndef STATE_TABLE_EDITOR_INCLUDE_MODELS_SECTION_H_
#define STATE_TABLE_EDITOR_INCLUDE_MODELS_SECTION_H_

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

#endif  // STATE_TABLE_EDITOR_INCLUDE_MODELS_SECTION_H_

