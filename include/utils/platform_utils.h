#ifndef STATE_TABLE_EDITOR_INCLUDE_UTILS_PLATFORM_UTILS_H_
#define STATE_TABLE_EDITOR_INCLUDE_UTILS_PLATFORM_UTILS_H_

#include <string>
#include <GLFW/glfw3.h>

using std::string;

namespace state_table_editor {

class PlatformUtils {
 public:
  PlatformUtils() = delete;
  static string OpenFile(GLFWwindow* window, const char* filter);
  static string SaveFile(GLFWwindow* window, const char* filter);
};

} // namespace state_table_editor

#endif // STATE_TABLE_EDITOR_INCLUDE_UTILS_PLATFORM_UTILS_H_
