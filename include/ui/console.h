#ifndef STATE_TABLE_EDITOR_INCLUDE_UI_CONSOLE_H_
#define STATE_TABLE_EDITOR_INCLUDE_UI_CONSOLE_H_

#include <memory>
#include <string>
#include <vector>

#include "panel.h"

namespace state_table_editor {

class Console : public IPanel {
 public:
  Console();

  void Render() override;
 
  private:
    bool auto_scroll_;
    bool scroll_to_bottom_;
};

}

#endif  // STATE_TABLE_EDITOR_INCLUDE_UI_CONSOLE_H_