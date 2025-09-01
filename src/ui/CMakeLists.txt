project(state_table_editor_ui)

add_library(${PROJECT_NAME})

target_include_directories(
  ${PROJECT_NAME}
  PRIVATE
  ${CMAKE_SOURCE_DIR}/include
  ${CMAKE_SOURCE_DIR}/lib/glfw/include
  ${CMAKE_SOURCE_DIR}/lib/imgui
  ${CMAKE_SOURCE_DIR}/lib/imgui/backends
  ${CMAKE_SOURCE_DIR}/lib/imgui/misc/cpp
)

target_sources (${PROJECT_NAME}
  PRIVATE
  application_window.cc
  console.cc
)