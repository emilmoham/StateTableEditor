#include "ui/tabbed_table_panel.h"

#include <algorithm>
#include <memory>
#include <string>

#include "imgui.h"
#include "models/section.h"
#include "models/state.h"

namespace state_table_editor {

TabbedTablePanel::TabbedTablePanel() {}

void TabbedTablePanel::NewTable() {
  ++untitled_count_;
  Tab tab;
  tab.display_name = "Untitled " + std::to_string(untitled_count_);
  tab.file_path = "";
  tab.app_table = std::make_unique<AppTable>("");
  tab.focus = true;
  tabs_.push_back(std::move(tab));
}

void TabbedTablePanel::OpenFile(const std::string& path) {
  // Bring existing tab to focus if already open
  for (auto& tab : tabs_) {
    if (tab.file_path == path) {
      tab.focus = true;
      return;
    }
  }

  std::string filename = path.substr(path.find_last_of("/\\") + 1);

  Tab tab;
  tab.display_name = filename;
  tab.file_path = path;
  tab.focus = true;
  tab.app_table = std::make_unique<AppTable>(path);
  tab.app_table->Read();
  tabs_.push_back(std::move(tab));
}

void TabbedTablePanel::Render() {
  ImGui::Begin("Tables");

  if (ImGui::BeginTabBar("TableTabs")) {
    for (auto& tab : tabs_) {
      std::string tab_id = tab.display_name + "##" + tab.file_path;
      ImGuiTabItemFlags flags = tab.focus ? ImGuiTabItemFlags_SetSelected : ImGuiTabItemFlags_None;
      tab.focus = false;
      if (ImGui::BeginTabItem(tab_id.c_str(), &tab.open, flags)) {
        RenderTable(tab);
        ImGui::EndTabItem();
      }
    }
    ImGui::EndTabBar();
  }

  tabs_.erase(
    std::remove_if(tabs_.begin(), tabs_.end(),
      [](const Tab& t) { return !t.open; }),
    tabs_.end());

  ImGui::End();
}

void TabbedTablePanel::RenderTable(Tab& tab) {
  static const int kNumColumns = 23;
  ImGuiTableFlags flags = ImGuiTableFlags_Borders |
                          ImGuiTableFlags_RowBg |
                          ImGuiTableFlags_ScrollX |
                          ImGuiTableFlags_ScrollY |
                          ImGuiTableFlags_SizingFixedFit;

  if (ImGui::BeginTable("state_table", kNumColumns, flags)) {
    ImGui::TableSetupScrollFreeze(0, 1);

    const float kReturnColWidth = 35.0f;

    ImGui::TableSetupColumn("ID");
    ImGui::TableSetupColumn("Name");
    for (int i = 0; i < 20; ++i) {
      ImGui::TableSetupColumn(std::to_string(i).c_str(),
                              ImGuiTableColumnFlags_WidthFixed, kReturnColWidth);
    }
    ImGui::TableSetupColumn("Description");

    ImGui::TableHeadersRow();

    int state_index = 0;
    for (const auto& renderable : tab.app_table->GetRenderables()) {
      auto state = std::dynamic_pointer_cast<State>(renderable);
      if (state) {
        ImGui::TableNextRow();

        static const ImU32 kHighlightColor = IM_COL32(255, 200, 0, 100);

        ImGui::TableSetColumnIndex(0);
        bool id_highlighted = (state_index == tab.selected_return_state_id);
        if (id_highlighted)
          ImGui::TableSetBgColor(ImGuiTableBgTarget_CellBg, kHighlightColor);
        char id_buf[32];
        snprintf(id_buf, sizeof(id_buf), "%d##id%d", state_index, state_index);
        if (ImGui::Selectable(id_buf, id_highlighted))
          tab.selected_return_state_id = id_highlighted ? -1 : state_index;

        ImGui::TableSetColumnIndex(1);
        ImGui::TextUnformatted(state->GetName().c_str());

        const auto& ids = state->GetReturnStateIds();
        for (int i = 0; i < 20; ++i) {
          ImGui::TableSetColumnIndex(2 + i);
          if (i < static_cast<int>(ids.size())) {
            bool is_highlighted = (ids[i] == tab.selected_return_state_id);
            if (is_highlighted)
              ImGui::TableSetBgColor(ImGuiTableBgTarget_CellBg, kHighlightColor);
            char buf[32];
            snprintf(buf, sizeof(buf), "%d##r%d_%d", ids[i], state_index, i);
            if (ImGui::Selectable(buf, is_highlighted))
              tab.selected_return_state_id = is_highlighted ? -1 : ids[i];
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
}

}  // namespace state_table_editor
