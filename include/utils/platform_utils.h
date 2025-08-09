#ifndef SRC_APP_TABLE_MANAGER_INCLUDE_UTILS_PLATFORM_UTILS_H_
#define SRC_APP_TABLE_MANAGER_INCLUDE_UTILS_PLATFORM_UTILS_H_

#include <string>
#include <GLFW/glfw3.h>

using std::string;

class PlatformUtils {
 public:
  PlatformUtils() = delete;
  static string OpenFile(GLFWwindow* window, const char* filter);
  static string SaveFile(GLFWwindow* window, const char* filter);
};

#endif // SRC_APP_TABLE_MANAGER_INCLUDE_UTILS_PLATFORM_UTILS_H_
