find_package(OpenGL REQUIRED)

project(state_table_editor)

add_executable(${PROJECT_NAME} main.cc)

add_subdirectory(app_table_manager)
add_subdirectory(ui)
add_subdirectory(utils)

target_include_directories(
  ${PROJECT_NAME}
  PRIVATE 
  ${CMAKE_SOURCE_DIR}/include
)

# Add imgui
add_library(
  imgui
  STATIC
  ${CMAKE_SOURCE_DIR}/external/imgui/imgui_demo.cpp
  ${CMAKE_SOURCE_DIR}/external/imgui/imgui_draw.cpp
  ${CMAKE_SOURCE_DIR}/external/imgui/imgui_tables.cpp
  ${CMAKE_SOURCE_DIR}/external/imgui/imgui_widgets.cpp
  ${CMAKE_SOURCE_DIR}/external/imgui/imgui.cpp
  ${CMAKE_SOURCE_DIR}/external/imgui/backends/imgui_impl_glfw.cpp
  ${CMAKE_SOURCE_DIR}/external/imgui/backends/imgui_impl_opengl3.cpp
  ${CMAKE_SOURCE_DIR}/external/imgui/misc/cpp/imgui_stdlib.cpp
)

target_include_directories(imgui PUBLIC
  ${CMAKE_SOURCE_DIR}/external/imgui
  ${CMAKE_SOURCE_DIR}/external/imgui/backends
  ${CMAKE_SOURCE_DIR}/external/imgui/misc/cpp
)

target_link_libraries(imgui PUBLIC glfw OpenGL::GL)

target_link_libraries(
  ${PROJECT_NAME} 
  PRIVATE 
  app_table_manager
  imgui
  glfw
  OpenGL::GL
  state_table_editor_utils
  state_table_editor_ui
)