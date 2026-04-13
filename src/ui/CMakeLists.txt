project(state_table_editor_ui)

add_library(${PROJECT_NAME})

target_include_directories(
  ${PROJECT_NAME}
  PRIVATE
  ${CMAKE_SOURCE_DIR}/include
)

target_sources (${PROJECT_NAME}
  PRIVATE
  application_window.cc
  console.cc
  state_table_panel.cc
)

target_link_libraries(
  ${PROJECT_NAME}
  PRIVATE
  app_table_manager
  state_table_editor_core
  imgui
  glfw
)