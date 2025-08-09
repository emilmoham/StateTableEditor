project(state_table_editor_utils)

add_library(${PROJECT_NAME})

add_subdirectory(platform)

target_include_directories(
  ${PROJECT_NAME}
  PRIVATE
  ${CMAKE_SOURCE_DIR}/include
  ${CMAKE_SOURCE_DIR}/lib/glfw/include
)