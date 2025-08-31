#include <state_table_editor/models/app_table.h>

#include <fstream>
#include <iostream>
#include <regex>

#include <state_table_editor/models/state.h>

namespace state_table_editor {

AppTable::AppTable(string filename) : filename(filename) {}

AppTable::ParseState AppTable::ParseHeader(std::string line) {
  return line.compare("#$HEADER; NULL") == 0 ? Next : Error;
}

AppTable::ParseState AppTable::ParseNextLine(std::string line) {
  if (line[0] == '*') return TableSection;

  std::smatch matchSet;
  std::regex stateMatchEngine("\\d+");
  std::regex_match(line, matchSet, stateMatchEngine);
  if (matchSet.size() > 0) return TableState;

  return Error;
}

AppTable::ParseState AppTable::ParseStateLine(std::string line) {
  std::shared_ptr<State> parsedState = State::ParseState(line);
  if (parsedState == nullptr) return Error;
  stateMap.push_back(parsedState);
  renderables.push_back(parsedState);
  return Next;
}

AppTable::ParseState AppTable::ParseSection(
  std::string line,
  shared_ptr<Section> section
) {
  std::smatch matchSet;
  std::regex sectionLineMatchEngine("\\*{1,}(\\s{2,})?");
  std::regex_search(line, matchSet, sectionLineMatchEngine);

  if (matchSet.size() < 2) return Error;

  std::regex sectionEndMatchEngine("\\*{3,}");
  std::regex_match(line, matchSet, sectionEndMatchEngine);
  if (matchSet.size() == 1) return Next;

  std::shared_ptr<Section> lastRenderable
    = std::dynamic_pointer_cast<Section>(renderables.back());

  if (lastRenderable == nullptr) {
    Section section;
    lastRenderable = std::make_shared<Section>(section);
    renderables.push_back(lastRenderable);
  }

  lastRenderable->ParseDescriptionLine(line);

  return TableSection;
}

void AppTable::Print() {
  int stateCount = 0;
  for (int i = 0; i < renderables.size(); i++) {
    std::shared_ptr<Section> section
      = std::dynamic_pointer_cast<Section>(renderables[i]);
    std::shared_ptr<State> state
      = std::dynamic_pointer_cast<State>(renderables[i]);
    if (state != nullptr) {
      std::cout << stateCount;
      std::cout << "\n";
      std::cout << state->Format(stateCount++);
      std::cout << "\n";
    } else if (section != nullptr) {
      std::cout << "\n";
      std::cout << section->Format();
      std::cout << "\n";
    }
  }
}

void AppTable::ResolveAllReturnStateIds() {
  for (auto state : stateMap) {
    state->ResolveReturnStateIds(stateMap);
  }
}

void AppTable::ResolveAllReturnStateRefs() {
  for (auto state : stateMap) {
    state->ResolveReturnStateRefs(stateMap);
  }
}

int AppTable::Read() {
  std::ifstream file(filename);
  if (!file.is_open()) {
    std::cerr << "Error: Unable to open file " << filename << std::endl;
    return -1;
  }

  ParseState parseState = ParseState::Header;
  std::string line;

  int lineNumber = 1;

  while (std::getline(file, line)) {
    if (line.size() == 0) continue;  // Ignore blank lines

    switch (parseState) {
      case Header:
        parseState = ParseHeader(line);
        break;
      case Next:
        parseState = ParseNextLine(line);
        break;
      case TableState:
        parseState = ParseStateLine(line);
        break;
      case TableSection:
        parseState = ParseSection(line);
        break;
      case Error:
        std::cerr
          << "Error parsing input file on line: "
          << lineNumber
          << std::endl;
        return lineNumber;
      default:
        std::cerr << "Error: Unknown parse state" << std::endl;
        return lineNumber;
    }
    lineNumber++;
  }

  ResolveAllReturnStateRefs();

  file.close();
  return 0;
}

int AppTable::GetStateCount() {
  return stateMap.size();
}

shared_ptr<State> AppTable::GetState(int id) {
  if (id >= 0 && id < stateMap.size())
    return stateMap.at(id);
  return nullptr;
}

bool AppTable::InsertState(
  shared_ptr<State> stateToAdd,
  shared_ptr<State> adjacentTo,
  bool after) {
  if (stateMap.size() == 0) {
    stateMap.push_back(stateToAdd);
    renderables.push_back(stateToAdd);
    return true;
  }

  if (adjacentTo == nullptr) return false;

  auto stateIterator = std::find(stateMap.begin(), stateMap.end(), adjacentTo);
  if (stateIterator == stateMap.end()) return false;
  stateIterator += after;

  auto renderableIterator
    = std::find(renderables.begin(), renderables.end(), adjacentTo);
  if (renderableIterator == renderables.end()) return false;
  renderableIterator += after;

  stateMap.insert(stateIterator, stateToAdd);
  renderables.insert(renderableIterator, stateToAdd);

  return true;
}

bool AppTable::DeleteState(
  shared_ptr<State> stateToRemove,
  shared_ptr<State> replacementState) {
  auto deletionStateIterator =
    std::find(stateMap.begin(), stateMap.end(), stateToRemove);
  auto deletionRenderableIterator =
    std::find(renderables.begin(), renderables.end(), stateToRemove);

  if (deletionStateIterator == stateMap.end()
    || deletionRenderableIterator == renderables.end()) {
     return false;
  }

  auto replacementStateIterator =
    std::find(stateMap.begin(), stateMap.end(), replacementState);
  if (replacementStateIterator == stateMap.end() && GetStateCount() > 1) {
    return false;
  }

  if (GetStateCount() == 1 && GetState(0) == stateToRemove) {
    stateMap.erase(deletionStateIterator);
    renderables.erase(deletionRenderableIterator);
    return true;
  }

  unordered_map<std::shared_ptr<State>, int> callers =
    stateToRemove->GetCallers();

  for (auto pair : callers) {
    shared_ptr<State> caller = pair.first;
    vector<shared_ptr<State>> callerReturnRefs = caller->GetReturnStateRefs();
    for (int i = 0; i < callerReturnRefs.size(); i++) {
      caller->SetReturnState(i, replacementState);
    }
  }

  stateMap.erase(deletionStateIterator);
  renderables.erase(deletionRenderableIterator);
  return true;
}

} // namespace state_table_editor