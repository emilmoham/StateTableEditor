#ifndef SRC_APP_TABLE_MANAGER_INCLUDE_MODELS_APP_TABLE_H_
#define SRC_APP_TABLE_MANAGER_INCLUDE_MODELS_APP_TABLE_H_

#include <memory>
#include <string>
#include <vector>

#include "renderable.h"
#include "section.h"
#include "state.h"

using std::shared_ptr;
using std::string;
using std::vector;

class AppTable {
 public:
  explicit AppTable(string filename);

  int Read();
  void Print();
 
  int GetStateCount();
  shared_ptr<State> GetState(int id);

  bool InsertState(
    shared_ptr<State> stateToAdd =
      shared_ptr<State>(new State("myNewState", "My new state")),
    shared_ptr<State> adjacentTo = nullptr,
    bool after = true);

  bool DeleteState(
    shared_ptr<State> stateToRemove,
    shared_ptr<State> replacementState = nullptr);

  // TODO
  bool InsertSection(
    shared_ptr<Section> sectionToAdd,
    shared_ptr<State> adjacentTo,
    bool after = true);

  // TODO
  bool DeleteSection(shared_ptr<Section> sectionToRemove);

  // TODO
  bool DuplicateState(
    shared_ptr<State> originalState,
    shared_ptr<State> insertAdjacentTo,
    bool after = true);

  // TODO 
  bool DuplicateRange(
    shared_ptr<State> startRangeState,
    shared_ptr<State> endRangeState,
    shared_ptr<State> adjacentTo,
    bool after = true);

 private:
  string filename;
  vector<shared_ptr<State>> stateMap;
  vector<shared_ptr<IRenderable>> renderables;

  enum ParseState {
    Error,
    Header,
    Next,
    TableState,
    TableSection
  };

  ParseState ParseHeader(string line);
  ParseState ParseNextLine(string line);
  ParseState ParseStateLine(string line);
  ParseState ParseSection(
    std::string line,
    shared_ptr<Section> section = nullptr);

  void ResolveAllReturnStateIds();
  void ResolveAllReturnStateRefs();

};

#endif  // SRC_APP_TABLE_MANAGER_INCLUDE_MODELS_APP_TABLE_H_
