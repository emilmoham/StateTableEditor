#include "ui/console.h"

#include "imgui.h"
#include "core/logging/log.h"

namespace state_table_editor {

Console::Console(): auto_scroll_(true), scroll_to_bottom_(false) {}

void Console::Render() {
  ImGui::SetNextWindowSize(ImVec2(520, 600), ImGuiCond_FirstUseEver);
  ImGui::Begin("Console");

  if (ImGui::SmallButton("Add Debug Text"))  { Log::Info("some more text"); Log::Warning("display very important message here!"); }
  ImGui::SameLine();
  if (ImGui::SmallButton("Add Debug Error")) { Log::Error("something went wrong"); }
  ImGui::SameLine();
  if (ImGui::SmallButton("Clear"))           { Log::Get().Clear(); }

  ImGui::Separator();

  // Options menu
  if (ImGui::BeginPopup("Options")) {
      ImGui::Checkbox("Auto-scroll", &auto_scroll_);
      ImGui::EndPopup();
  }

  // Reserve enough left-over height for 1 separator + 1 input text
  const float footer_height_to_reserve = ImGui::GetStyle().ItemSpacing.y + ImGui::GetFrameHeightWithSpacing();
  if (ImGui::BeginChild(
    "ScrollingRegion",
    ImVec2(0,-footer_height_to_reserve),
    ImGuiChildFlags_NavFlattened,
    ImGuiWindowFlags_HorizontalScrollbar
  )) {

    if (ImGui::BeginPopupContextWindow()) {
      if (ImGui::Selectable("Clear")) Log::Get().Clear();
      ImGui::EndPopup();
    }

    ImGui::PushStyleVar(ImGuiStyleVar_ItemSpacing, ImVec2(4, 1)); // Tighten spacing
    for (const LogMessage& item : Log::Get().Messages())
    {
      // Normally you would store more information in your item than just a string.
      // (e.g. make Items[] an array of structure, store color/type etc.)
      ImGui::Text("[ %s ] %s", ToString(item.level), item.msg.c_str());

      // Keep up at the bottom of the scroll region if we were already at the bottom at the beginning of the frame.
      // Using a scrollbar or mouse-wheel will take away from the bottom edge.
      if (scroll_to_bottom_ || (auto_scroll_ && ImGui::GetScrollY() >= ImGui::GetScrollMaxY()))
          ImGui::SetScrollHereY(1.0f);
      scroll_to_bottom_ = false;

    }
    ImGui::PopStyleVar();
    ImGui::EndChild();
    ImGui::Separator();
  }

  ImGui::End();
}

}  // namespace state_table_editor