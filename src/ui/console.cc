#include <ui/console.h>
#include <imgui.h>

namespace state_table_editor {

Console::Console() {
  ClearLog();
  auto_scroll_ = true;
  scroll_to_bottom = false;

  AddLog("Welcome to State Table Editor!");
}

Console::~Console() {
  ClearLog();
}

void Console::ClearLog() {
  items_.clear();  
}

void Console::AddLog(const char *log) {
  std::string log_str(log);
  std::shared_ptr<std::string> mem_log = std::make_shared<std::string>(log_str);
  items_.push_back(mem_log);
}

void Console::Draw() {
  ImGui::Begin("Console");
  ImGui::End();
}

}  // namespace state_table_editor