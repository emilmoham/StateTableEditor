#include "ui/state_table_panel.h"

#include <memory>
#include <string>

#include "imgui.h"
#include "models/section.h"
#include "models/state.h"

namespace state_table_editor {

StateTablePanel::StateTablePanel(AppTable* app_table)
    : app_table_(app_table), selected_return_state_id_(-1) {}

void StateTablePanel::Render() {
  ImGui::Begin("State Table");

  static const int kNumColumns = 23;
  ImGuiTableFlags flags = ImGuiTableFlags_Borders |
                          ImGuiTableFlags_RowBg |
                          ImGuiTableFlags_ScrollX |
                          ImGuiTableFlags_ScrollY |
                          ImGuiTableFlags_SizingFixedFit;

  if (ImGui::BeginTable("state_table", kNumColumns, flags)) {
    ImGui::TableSetupScrollFreeze(0, 1);

    const float kReturnColWidth = 35.0f;  // ~5 chars at default font size

    ImGui::TableSetupColumn("ID");
    ImGui::TableSetupColumn("Name");
    for (int i = 0; i < 20; ++i) {
      ImGui::TableSetupColumn(std::to_string(i).c_str(),
                              ImGuiTableColumnFlags_WidthFixed, kReturnColWidth);
    }
    ImGui::TableSetupColumn("Description");

    ImGui::TableHeadersRow();

    int state_index = 0;
    for (const auto& renderable : app_table_->GetRenderables()) {
      auto state = std::dynamic_pointer_cast<State>(renderable);
      if (state) {
        ImGui::TableNextRow();

        static const ImU32 kHighlightColor = IM_COL32(255, 200, 0, 100);

        ImGui::TableSetColumnIndex(0);
        bool id_highlighted = (state_index == selected_return_state_id_);
        if (id_highlighted)
          ImGui::TableSetBgColor(ImGuiTableBgTarget_CellBg, kHighlightColor);
        char id_buf[32];
        snprintf(id_buf, sizeof(id_buf), "%d##id%d", state_index, state_index);
        if (ImGui::Selectable(id_buf, id_highlighted))
          selected_return_state_id_ = id_highlighted ? -1 : state_index;

        ImGui::TableSetColumnIndex(1);
        ImGui::TextUnformatted(state->GetName().c_str());

        const auto& ids = state->GetReturnStateIds();
        for (int i = 0; i < 20; ++i) {
          ImGui::TableSetColumnIndex(2 + i);
          if (i < static_cast<int>(ids.size())) {
            bool is_highlighted = (ids[i] == selected_return_state_id_);
            if (is_highlighted)
              ImGui::TableSetBgColor(ImGuiTableBgTarget_CellBg, kHighlightColor);
            char buf[32];
            snprintf(buf, sizeof(buf), "%d##r%d_%d", ids[i], state_index, i);
            if (ImGui::Selectable(buf, is_highlighted))
              selected_return_state_id_ = is_highlighted ? -1 : ids[i];
          }
        }

        ImGui::TableSetColumnIndex(22);
        ImGui::TextUnformatted(state->GetDescription().c_str());

        ++state_index;
        continue;
      }

      auto section = std::dynamic_pointer_cast<Section>(renderable);
      if (section) {
        ImGui::TableNextRow();
        ImGui::TableSetColumnIndex(0);

        std::string label;
        for (const auto& line : section->GetDescription()) {
          if (!label.empty()) label += "\n";
          label += line;
        }
        ImGui::TextUnformatted(label.c_str());
      }
    }

    ImGui::EndTable();
  }

  ImGui::End();
}

}  // namespace state_table_editor
