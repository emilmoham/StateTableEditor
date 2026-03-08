#ifndef STATE_TABLE_EDITOR_INCLUDE_UI_PANEL_H_
#define STATE_TABLE_EDITOR_INCLUDE_UI_PANEL_H_

namespace state_table_editor {

class IPanel {
  public:
  virtual ~IPanel() = default;
  virtual void Render() = 0;
};

}

#endif // STATE_TABLE_EDITOR_INCLUDE_UI_PANEL_H_