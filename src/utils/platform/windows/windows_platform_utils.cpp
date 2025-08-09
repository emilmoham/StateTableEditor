#include "utils/platform_utils.h"

#include <Windows.h>
#define GLFW_EXPOSE_NATIVE_WIN32
#include <GLFW/glfw3native.h>

std::string PlatformUtils::OpenFile(GLFWwindow* window, const char* filter) {
  OPENFILENAMEA ofn;
  CHAR szFile[260] = { 0 };
  CHAR currentDir[256] = { 0 };
  ZeroMemory(&ofn, sizeof(OPENFILENAME));
  ofn.lStructSize = sizeof(OPENFILENAME);
  ofn.hwndOwner = glfwGetWin32Window(window);
  ofn.lpstrFile = szFile;
  ofn.nMaxFile = sizeof(szFile);
  if (GetCurrentDirectoryA(256, currentDir))
  	ofn.lpstrInitialDir = currentDir;
  ofn.lpstrFilter = filter;
  ofn.nFilterIndex = 1;
  ofn.Flags = OFN_PATHMUSTEXIST | OFN_FILEMUSTEXIST | OFN_NOCHANGEDIR;

  if (GetOpenFileNameA(&ofn) == TRUE)
  	return ofn.lpstrFile;

  return std::string();
}

std::string PlatformUtils::SaveFile(GLFWwindow* window, const char* fitler) {
  return std::string();
}