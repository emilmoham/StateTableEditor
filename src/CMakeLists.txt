find_package(OpenGL REQUIRED)

project(state_table_editor)

add_executable(${PROJECT_NAME} main.cc)

add_subdirectory(app_table_manager)
add_subdirectory(utils)

# Add imgui
target_sources(${PROJECT_NAME}
  PRIVATE
  ${CMAKE_SOURCE_DIR}/lib/imgui/imgui_demo.cpp
  ${CMAKE_SOURCE_DIR}/lib/imgui/imgui_draw.cpp
  ${CMAKE_SOURCE_DIR}/lib/imgui/imgui_tables.cpp
  ${CMAKE_SOURCE_DIR}/lib/imgui/imgui_widgets.cpp
  ${CMAKE_SOURCE_DIR}/lib/imgui/imgui.cpp
  ${CMAKE_SOURCE_DIR}/lib/imgui/backends/imgui_impl_glfw.cpp
  ${CMAKE_SOURCE_DIR}/lib/imgui/backends/imgui_impl_opengl3.cpp
  ${CMAKE_SOURCE_DIR}/lib/imgui/misc/cpp/imgui_stdlib.cpp
)

target_include_directories(
  ${PROJECT_NAME}
  PRIVATE 
  ${CMAKE_SOURCE_DIR}/include
  ${CMAKE_SOURCE_DIR}/lib/glfw/inlcude
  ${CMAKE_SOURCE_DIR}/lib/imgui
  ${CMAKE_SOURCE_DIR}/lib/imgui/backends
  ${CMAKE_SOURCE_DIR}/lib/imgui/misc/cpp
)

target_link_libraries(
  ${PROJECT_NAME} 
  PRIVATE 
  app_table_manager
  glfw
  OpenGL::GL
  state_table_editor_utils
)