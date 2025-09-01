project(state_table_editor_ui)

add_library(${PROJECT_NAME})

target_sources (${PROJECT_NAME}
  PRIVATE
  console.cc
)

target_include_directories(
  ${PROJECT_NAME}
  PRIVATE
  ${CMAKE_SOURCE_DIR}/include
  ${CMAKE_SOURCE_DIR}/lib/imgui
)