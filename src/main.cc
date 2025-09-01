#include "ui/application_window.h"
#include "ui/console.h"

#include "imgui.h"

int main() {
  // AppTable appTable("samples/sample1.app");
  // std::cout << "Reading file contents:" << std::endl;
  // appTable.Read();

  state_table_editor::Console console;
  state_table_editor::ApplicationWindow applicationWindow;

  std::function<void()> render = []() {
    ImGui::BeginMainMenuBar();
    if (ImGui::BeginMenu("File"))
    {
      if (ImGui::MenuItem("New", "Ctrl+N")) {  }
      if (ImGui::MenuItem("Open", "Ctrl+O")) {}
      if (ImGui::MenuItem("Save", "Ctrl+S")) {}
      ImGui::EndMenu();
    }
    ImGui::EndMainMenuBar();
  };

  applicationWindow.StartRenderLoop(render);

  return 0;
}
