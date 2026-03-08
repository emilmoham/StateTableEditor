project(state_table_editor_utils)

add_library(${PROJECT_NAME})

target_include_directories(
  ${PROJECT_NAME}
  PRIVATE
  ${CMAKE_SOURCE_DIR}/include
)

target_sources(${PROJECT_NAME}
  PRIVATE
  string_helpers.cc
)

target_link_libraries(
  ${PROJECT_NAME}
  PRIVATE
  glfw
)

if (WIN32)
  target_sources(${PROJECT_NAME}
    PRIVATE
    platform/windows/windows_platform_utils.cc
  )
endif()