#include "core/logging/log.h"

namespace state_table_editor {

void Log::AddMessage(LogLevel level, const std::string& msg) {
  messages_.emplace_back(LogMessage{level, msg});
}

void Log::Clear() {
  messages_.clear();
}

Log& Log::Get() {
  static Log log;
  return log;
}

}