#ifndef STATE_TABLE_EDITOR_INCLUDE_CORE_LOGGING_LOG_H_
#define STATE_TABLE_EDITOR_INCLUDE_CORE_LOGGING_LOG_H_

#include <string>
#include <vector>

namespace state_table_editor{ 

enum class LogLevel { TRACE, DEBUG, INFO, WARNING, ERROR };

struct LogMessage {
  LogLevel level;
  std::string msg;
};

inline const char* ToString(LogLevel level) {
  switch (level) {
    case LogLevel::TRACE:   return "  TRACE";
    case LogLevel::DEBUG:   return "  DEBUG";
    case LogLevel::INFO:    return "   INFO";
    case LogLevel::WARNING: return "WARNING";
    case LogLevel::ERROR:   return "  ERROR";
    default:                return "UNKNOWN";
  }
}

class Log {
 public:
  static Log& Get();

  const std::vector<LogMessage>& Messages() const { return messages_; }

  void Clear();

  void AddMessage(LogLevel level, const std::string& msg);


  static void Trace(const std::string &msg)    { Log::Get().AddMessage(LogLevel::TRACE,  msg); }
  static void Debug(const std::string &msg)    { Log::Get().AddMessage(LogLevel::DEBUG,  msg); }
  static void Info(const std::string &msg)     { Log::Get().AddMessage(LogLevel::INFO,   msg); }
  static void Warning(const std::string &msg)  { Log::Get().AddMessage(LogLevel::WARNING,msg); }
  static void Error(const std::string& msg)    { Log::Get().AddMessage(LogLevel::ERROR,  msg); }

 private:
  Log() = default;

  std::vector<LogMessage> messages_;
};

}

#endif // STATE_TABLE_EDITOR_INCLUDE_CORE_LOGGING_LOG_H_