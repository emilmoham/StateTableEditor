#ifndef STATE_TABLE_EDITOR_INCLUDE_UI_APPLICATION_H_
#define STATE_TABLE_EDITOR_INCLUDE_UI_APPLICATION_H_

#include <functional>
#include <string>
#include <vector>

#include "panel.h"

struct GLFWwindow;

namespace state_table_editor {

class ApplicationWindow {
 public:
  ApplicationWindow();
  ~ApplicationWindow();

  void AddPanel(IPanel* panel);

  void SetOnNew(std::function<void()> callback);
  void SetOnOpen(std::function<void(const std::string&)> callback);

  void StartRenderLoop();

  void ToggleDemoWindow();

 private:
  void Init();

  GLFWwindow* window_ = nullptr;
  std::vector<IPanel*> panels_;
  bool show_demo_window_;
  std::function<void()> on_new_;
  std::function<void(const std::string&)> on_open_;
};

}

#endif  // STATE_TABLE_EDITOR_INCLUDE_UI_APPLICATION_H_