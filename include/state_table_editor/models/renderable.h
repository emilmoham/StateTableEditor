#ifndef SRC_APP_TABLE_MANAGER_INCLUDE_MODELS_RENDERABLE_H_
#define SRC_APP_TABLE_MANAGER_INCLUDE_MODELS_RENDERABLE_H_

#include <string>

namespace state_table_editor {

class IRenderable {
 public:
  virtual std::string Format(int id = -1) = 0;
};

} // namespace state_table_editor

#endif  // SRC_APP_TABLE_MANAGER_INCLUDE_MODELS_RENDERABLE_H_
