#ifndef STATE_TABLE_EDITOR_INCLUDE_UI_APPLICATION_H_
#define STATE_TABLE_EDITOR_INCLUDE_UI_APPLICATION_H_

#include <functional>

namespace state_table_editor {

class ApplicationWindow {
 public:
  ApplicationWindow();
  ~ApplicationWindow();

  void StartRenderLoop(std::function<void()>& render);

  void ToggleDemoWindow();

 private:
  void Init();

  bool show_demo_window_;
};

}

#endif  // STATE_TABLE_EDITOR_INCLUDE_UI_APPLICATION_H_