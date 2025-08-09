#include "models/state.h"

#include <regex>

#include "utils/string_helpers.h"

State::State(
  string name,
  string description
) {
  this->name = name;
  this->description = description;
}

State::State(
  string name,
  vector<int> returnStateIds,
  string description
) {
  this->name = name;
  this->returnStateIds = returnStateIds;
  this->description = description;
}

State::State(
  string name,
  vector<shared_ptr<State>> returnStateRefs,
  string description
) {
  this->name = name;
  this->returnStateRefs = returnStateRefs;
  this->description = description;
}

string State::GetName() {
  return name;
}

vector<int> State::GetReturnStateIds() {
  return returnStateIds;
}

vector<shared_ptr<State>> State::GetReturnStateRefs() {
  return returnStateRefs;
}

string State::GetDescription() {
  return description;
}

shared_ptr<State> State::ParseState(string input) {
  std::regex e("#\\$State ;(\\w{0,})[ ]?;([ \\d]{0,});\\[(\\d+)\\] (.{0,})");
  std::smatch matchSet;

  std::regex_match(input, matchSet, e);

  if (matchSet.size() != 5)
    return shared_ptr<State>(nullptr);

  std::string name = matchSet[1];
  std::string rawReturnStatesString = matchSet[2];
  std::string description = matchSet[4];

  // Convert raw return states to vector of ints
  vector<string> returnStateIdTokens
    = StringHelpers::Tokenize(rawReturnStatesString, ' ');

  if (returnStateIdTokens.size() < MIN_STATES
    || returnStateIdTokens.size() > MAX_STATES) {
    return shared_ptr<State>(nullptr);
  }

  vector<int> returnStateIds;
  int returnStateId = 0;
  for (string token : returnStateIdTokens) {
    sscanf(token.c_str(), "%d", &returnStateId);
    returnStateIds.push_back(returnStateId);
  }

  State parsedState = State(name, returnStateIds, description);

  return std::make_shared<State>(parsedState);
}

string State::Format(int id) {
  string text = "";

  text += "#$State ;";
  text += name;
  text += "; ";
  for (int i : returnStateIds) {
    text += std::to_string(i);
    text += ' ';
  }
  text += ";[";
  text += std::to_string(id);
  text += "] ";
  text += description;
  return text;
}

bool State::ResolveReturnStateIds(vector<shared_ptr<State>> appTableStates) {
  returnStateIds.clear();
  for (int i = 0; i < returnStateRefs.size(); i++) {
    shared_ptr<State> ref = returnStateRefs[i];
    vector<shared_ptr<State>>::iterator position
      = std::find(appTableStates.begin(), appTableStates.end(), ref);

    if (position == appTableStates.end())
      return false;
    returnStateIds.push_back(position - appTableStates.begin());
  }
  return true;
}

bool State::ResolveReturnStateRefs(vector<shared_ptr<State>> appTableStates) {
  returnStateRefs.clear();
  for (int i = 0; i < returnStateIds.size(); i++) {
    int id = returnStateIds[i];
    if (id >= appTableStates.size())
      return false;
    bool setResult = SetReturnState(i, appTableStates[id]);
    if (!setResult)
      return false;
  }
  return true;
}

void State::AddCaller(shared_ptr<State> caller) {
  if (callers.find(caller) == callers.end()) {
    callers[caller] = 1;
    return;
  }

  int callCount = callers[caller];
  callCount += 1;
  callers[caller] = callCount;
}

void State::RemoveCaller(shared_ptr<State> caller) {
  if (callers.find(caller) == callers.end())
    return;

  int callCount = callers[caller];
  if (callCount == 1) {
    callers.erase(caller);
  }

  callCount -= 1;
  callers[caller] = callCount;
}

bool State::SetReturnState(int index, shared_ptr<State> state) {
  if (index >= MAX_STATES) return false;

  if (index > returnStateRefs.size()) return false;

  if (index < returnStateRefs.size()) {
    shared_ptr<State> oldState = returnStateRefs[index];

    if (oldState == state) return true;  // Nothing to do

    RemoveCaller(oldState);
    returnStateRefs[index] = state;
  } else {
    returnStateRefs.push_back(state);
  }

  AddCaller(state);
  return true;
}

unordered_map<shared_ptr<State>, int> State::GetCallers() {
  return callers;
}