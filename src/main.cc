#include "ui/application_window.h"
#include "ui/console.h"

#include "imgui.h"

int main()
{
    // AppTable appTable("samples/sample1.app");
    // std::cout << "Reading file contents:" << std::endl;
    // appTable.Read();

    state_table_editor::Console console;
    state_table_editor::ApplicationWindow applicationWindow;

    applicationWindow.AddPanel(&console);

    applicationWindow.StartRenderLoop();

    return 0;
}
