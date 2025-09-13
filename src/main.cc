#include "ui/application_window.h"
#include "ui/console.h"

#include "imgui.h"

int main() {
  // AppTable appTable("samples/sample1.app");
  // std::cout << "Reading file contents:" << std::endl;
  // appTable.Read();

  state_table_editor::Console console;
  state_table_editor::ApplicationWindow applicationWindow;

  ImGuiKeyChord newFileKeyChord = ImGuiMod_Ctrl | ImGuiKey_N;

  std::function<void()> render = [
    &console,
    &newFileKeyChord
  ]() {
    if (ImGui::Shortcut(newFileKeyChord, ImGuiInputFlags_RouteGlobal)) {
      console.AddLog("new file");
    }
    // static ImGuiInputFlags route_options = ImGuiInputFlags_Repeat;
    // static ImGuiInputFlags route_type = ImGuiInputFlags_RouteFocused;
    // ImGui::CheckboxFlags("ImGuiInputFlags_Repeat", &route_options, ImGuiInputFlags_Repeat);
    // ImGui::RadioButton("ImGuiInputFlags_RouteActive", &route_type, ImGuiInputFlags_RouteActive);
    // ImGui::RadioButton("ImGuiInputFlags_RouteFocused (default)", &route_type, ImGuiInputFlags_RouteFocused);
    // ImGui::RadioButton("ImGuiInputFlags_RouteGlobal", &route_type, ImGuiInputFlags_RouteGlobal);
    // ImGui::RadioButton("ImGuiInputFlags_RouteAlways", &route_type, ImGuiInputFlags_RouteAlways);
    // ImGuiInputFlags flags = route_type | route_options; // Merged flags
    // if (route_type != ImGuiInputFlags_RouteGlobal)
    //     flags &= ~(ImGuiInputFlags_RouteOverFocused | ImGuiInputFlags_RouteOverActive | ImGuiInputFlags_RouteUnlessBgFocused);
    // ImGui::Text("Ctrl+N");
    // ImGui::Text("IsWindowFocused: %d, Shortcut: %s", ImGui::IsWindowFocused(), ImGui::Shortcut(newFileKeyChord, flags) ? "PRESSED" : "...");

    ImGui::BeginMainMenuBar();
    if (ImGui::BeginMenu("File"))
    {
      if (ImGui::MenuItem("New", "Ctrl+N")) {}
      if (ImGui::MenuItem("Open", "Ctrl+O")) {}
      if (ImGui::MenuItem("Save", "Ctrl+S")) {}
      ImGui::EndMenu();
    }
    ImGui::EndMainMenuBar();

    console.Render();
  };

  applicationWindow.StartRenderLoop(render);

  return 0;
}
