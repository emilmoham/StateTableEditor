project(app_table_manager_tests)

add_executable(
    ${PROJECT_NAME}
    app_table.tests.cpp
    section.tests.cpp
    state.tests.cpp
    string_helpers.tests.cpp
)

target_include_directories(
  ${PROJECT_NAME}
  PRIVATE
  ../../src/app_table_manager/include
)

target_link_libraries(
    ${PROJECT_NAME}
    PRIVATE
    Catch2::Catch2WithMain
    app_table_manager
)

include(CTest)
include(Catch)

catch_discover_tests(${PROJECT_NAME})