project(app_table_manager)

add_library(${PROJECT_NAME})

add_subdirectory(models)

target_include_directories(
  ${PROJECT_NAME} 
  PUBLIC 
  ${CMAKE_SOURCE_DIR}/include
)