#ifndef STATE_TABLE_EDITOR_INCLUDE_UI_CONSOLE_H_
#define STATE_TABLE_EDITOR_INCLUDE_UI_CONSOLE_H_

#include <memory>
#include <string>
#include <vector>

namespace state_table_editor {

class Console {
 public:
  Console();
  ~Console();

  void Draw();

  void ClearLog();
  void AddLog(const char *log);
 
  private:
    std::vector<std::shared_ptr<std::string>> items_;
    bool auto_scroll_;
    bool scroll_to_bottom;
};

}

#endif  // STATE_TABLE_EDITOR_INCLUDE_UI_CONSOLE_H_