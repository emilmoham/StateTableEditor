#ifndef STATE_TABLE_EDITOR_INCLUDE_UI_APPLICATION_H_
#define STATE_TABLE_EDITOR_INCLUDE_UI_APPLICATION_H_

#include <functional>
#include <vector>

#include "panel.h"

namespace state_table_editor {

class ApplicationWindow {
 public:
  ApplicationWindow();
  ~ApplicationWindow();

  void AddPanel(IPanel* panel);

  void StartRenderLoop();

  void ToggleDemoWindow();

 private:
  void Init();

  std::vector<IPanel*> panels_;
  bool show_demo_window_;
};

}

#endif  // STATE_TABLE_EDITOR_INCLUDE_UI_APPLICATION_H_