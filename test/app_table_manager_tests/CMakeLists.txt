project(app_table_manager_tests)

add_executable(
    ${PROJECT_NAME}
    app_table.tests.cc
    section.tests.cc
    state.tests.cc
    string_helpers.tests.cc
)

target_include_directories(
  ${PROJECT_NAME}
  PRIVATE
  ${CMAKE_SOURCE_DIR}/include
)

target_link_libraries(
    ${PROJECT_NAME}
    PRIVATE
    Catch2::Catch2WithMain
    app_table_manager
    state_table_editor_utils
)

include(CTest)
include(Catch)

catch_discover_tests(${PROJECT_NAME})