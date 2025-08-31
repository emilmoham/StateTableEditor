#ifndef SRC_APP_TABLE_MANAGER_INCLUDE_UTILS_PLATFORM_UTILS_H_
#define SRC_APP_TABLE_MANAGER_INCLUDE_UTILS_PLATFORM_UTILS_H_

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

#endif // SRC_APP_TABLE_MANAGER_INCLUDE_UTILS_PLATFORM_UTILS_H_
