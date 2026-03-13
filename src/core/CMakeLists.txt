project(state_table_editor_core)

add_library(${PROJECT_NAME})

target_sources(${PROJECT_NAME}
  PRIVATE
  logging/log.cc
)

target_include_directories(
  ${PROJECT_NAME}
  PUBLIC
  ${CMAKE_SOURCE_DIR}/include
)