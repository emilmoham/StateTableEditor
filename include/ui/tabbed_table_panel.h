#ifndef STATE_TABLE_EDITOR_INCLUDE_UI_TABBED_TABLE_PANEL_H_
#define STATE_TABLE_EDITOR_INCLUDE_UI_TABBED_TABLE_PANEL_H_

#include <memory>
#include <string>
#include <vector>

#include "models/app_table.h"
#include "ui/panel.h"

namespace state_table_editor {

class TabbedTablePanel : public IPanel {
 public:
  TabbedTablePanel();
  void Render() override;
  void NewTable();
  void OpenFile(const std::string& path);

 private:
  struct Tab {
    std::unique_ptr<AppTable> app_table;
    std::string display_name;
    std::string file_path;
    int selected_return_state_id = -1;
    bool open = true;
    bool focus = false;
  };

  void RenderTable(Tab& tab);

  std::vector<Tab> tabs_;
  int untitled_count_ = 0;
};

}  // namespace state_table_editor

#endif  // STATE_TABLE_EDITOR_INCLUDE_UI_TABBED_TABLE_PANEL_H_
