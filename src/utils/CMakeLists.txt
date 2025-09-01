project(state_table_editor_utils)

add_library(${PROJECT_NAME})

target_include_directories(
  ${PROJECT_NAME}
  PRIVATE
  ${CMAKE_SOURCE_DIR}/include
  ${CMAKE_SOURCE_DIR}/lib/glfw/include
)

target_sources(${PROJECT_NAME}
  PRIVATE
  string_helpers.cpp
)

if (WIN32)
  target_sources(${PROJECT_NAME}
    PRIVATE
    platform/windows/windows_platform_utils.cpp
  )
endif()