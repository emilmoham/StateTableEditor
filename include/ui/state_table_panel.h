#ifndef STATE_TABLE_EDITOR_INCLUDE_UI_STATE_TABLE_PANEL_H_
#define STATE_TABLE_EDITOR_INCLUDE_UI_STATE_TABLE_PANEL_H_

#include "models/app_table.h"
#include "ui/panel.h"

namespace state_table_editor {

class StateTablePanel : public IPanel {
 public:
  explicit StateTablePanel(AppTable* app_table);
  void Render() override;

 private:
  AppTable* app_table_;
  int selected_return_state_id_;
};

}  // namespace state_table_editor

#endif  // STATE_TABLE_EDITOR_INCLUDE_UI_STATE_TABLE_PANEL_H_
