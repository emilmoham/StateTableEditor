#include "ui/application_window.h"
#include "ui/console.h"
#include "ui/state_table_panel.h"

#include "imgui.h"
#include "models/app_table.h"

int main()
{
    state_table_editor::AppTable app_table("samples/sample1.app");
    app_table.Read();

    state_table_editor::Console console;
    state_table_editor::StateTablePanel state_table_panel(&app_table);
    state_table_editor::ApplicationWindow applicationWindow;

    applicationWindow.AddPanel(&state_table_panel);
    applicationWindow.AddPanel(&console);

    applicationWindow.SetOnNew([&app_table]() {
        app_table.Reset();
    });
    applicationWindow.SetOnOpen([&app_table](const std::string& path) {
        app_table.Load(path);
    });

    applicationWindow.StartRenderLoop();

    return 0;
}
