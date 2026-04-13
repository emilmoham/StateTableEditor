#include "ui/application_window.h"
#include "ui/console.h"
#include "ui/tabbed_table_panel.h"

int main()
{
    state_table_editor::TabbedTablePanel tabbed_panel;
    tabbed_panel.NewTable();

    state_table_editor::Console console;
    state_table_editor::ApplicationWindow applicationWindow;

    applicationWindow.AddPanel(&tabbed_panel);
    applicationWindow.AddPanel(&console);

    applicationWindow.SetOnNew([&tabbed_panel]() {
        tabbed_panel.NewTable();
    });
    applicationWindow.SetOnOpen([&tabbed_panel](const std::string& path) {
        tabbed_panel.OpenFile(path);
    });

    applicationWindow.StartRenderLoop();

    return 0;
}
