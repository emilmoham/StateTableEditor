project(app_table_manager)

add_library(${PROJECT_NAME})

target_sources(${PROJECT_NAME}
  PRIVATE
  models/state.cc
  models/section.cc
  models/app_table.cc
)

target_include_directories(
  ${PROJECT_NAME} 
  PUBLIC 
  ${CMAKE_SOURCE_DIR}/include
)