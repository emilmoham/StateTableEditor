#ifndef STATE_TABLE_EDITOR_INCLUDE_MODELS_STATE_H_
#define STATE_TABLE_EDITOR_INCLUDE_MODELS_STATE_H_

#include <memory>
#include <string>
#include <unordered_map>
#include <vector>

#include "renderable.h"

using std::shared_ptr;
using std::string;
using std::unordered_map;
using std::vector;
using std::weak_ptr;

namespace state_table_editor {

class State : public IRenderable {
 public:
  static const int MAX_STATES = 20;
  static const int MIN_STATES = 2;

  State(
    string name,
    string description);

  State(
    string name,
    vector<int> returnStateIds,
    string description);

  State(
    string name,
    vector<shared_ptr<State>> returnStateRefs,
    string description);

  static shared_ptr<State> ParseState(std::string input);

  string Format(int id = -1);

  string GetName();
  vector<int> GetReturnStateIds();
  vector<shared_ptr<State>> GetReturnStateRefs();
  string GetDescription();

  bool ResolveReturnStateIds(vector<shared_ptr<State>> appTableStates);
  bool ResolveReturnStateRefs(vector<shared_ptr<State>> appTableStates);

  // int GetStateId(std::vector<std::shared_ptr<State>> appTableStates);
  bool SetReturnState(int index, shared_ptr<State> state);

  unordered_map<std::shared_ptr<State>, int> GetCallers();

 private:
  string name;
  vector<int> returnStateIds;
  vector<shared_ptr<State>> returnStateRefs;
  unordered_map<std::shared_ptr<State>, int> callers;
  string description;

  void AddCaller(shared_ptr<State> caller);
  void RemoveCaller(shared_ptr<State> caller);
};

} // namespace state_table_editor

#endif  // STATE_TABLE_EDITOR_INCLUDE_MODELS_STATE_H_
