cmake_minimum_required(VERSION 3.30)

project(StateTableEditor LANGUAGES CXX)

enable_testing() 

list(APPEND CMAKE_MODULE_PATH "${CMAKE_SOURCE_DIR}/cmake")

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_subdirectory(src)
add_subdirectory(test)
add_subdirectory(lib/glfw)