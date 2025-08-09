#include <catch2/catch_test_macros.hpp>

#include "models/state.h"

using std::shared_ptr;
using std::string;
using std::vector;
using std::weak_ptr;

TEST_CASE("format states", "[state]") {
  SECTION("basic format") {
    vector<int> returnStates = vector<int>({ 0, 1, 2, 3, 4 });

    State state = State(
      "TestState",
      returnStates,
      "This is a test state<6>");

    std::string formattedState = state.Format(1);

    std::string expected = "#$State ;"
      "TestState; 0 1 2 3 4 ;[1] This is a test state<6>";

    REQUIRE(formattedState == expected);
  }
}

TEST_CASE("parse states", "[state]") {
  SECTION("single digit id") {
    string input = "#$State ;TestState; 0 1 2 3 4 5 ;[2] This is a test state";
    std::shared_ptr<State> state = State::ParseState(input);

    REQUIRE(state != nullptr);

    vector<int> returnStateIds = state->GetReturnStateIds();

    REQUIRE(state->GetName() == "TestState");
    REQUIRE(returnStateIds[0] == 0);
    REQUIRE(returnStateIds[5] == 5);
    REQUIRE(state->GetDescription() == "This is a test state");
  }

  SECTION("double digit id") {
    string input = "#$State ;TestState; 0 1 87 ;[13] This is a test state";
    std::shared_ptr<State> state = State::ParseState(input);

    REQUIRE(state != nullptr);

    vector<int> returnStateIds = state->GetReturnStateIds();

    REQUIRE(state->GetName() == "TestState");
    REQUIRE(returnStateIds[0] == 0);
    REQUIRE(returnStateIds[2] == 87);
    REQUIRE(state->GetDescription() == "This is a test state");
  }

  SECTION("too many return states") {
    string input = "#$State ;"
      "TestState; 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 ;"
      "[13] Too many Return states";
    std::shared_ptr<State> state = State::ParseState(input);

    REQUIRE(state == nullptr);
  }

  SECTION("too few return states") {
    string input = "#$State ;TestState; 0 ;[13] Too many Return states";
    std::shared_ptr<State> state = State::ParseState(input);

    REQUIRE(state == nullptr);
  }
}

TEST_CASE("set return state", "[state]") {
  State s0("State0", vector<int>(), "test state 0");
  shared_ptr<State> state0 = std::make_shared<State>(s0);

  SECTION("add first return state") {
    REQUIRE(state0->SetReturnState(0, state0));
    REQUIRE(state0->GetReturnStateRefs().size() == 1);
    REQUIRE(state0->GetReturnStateRefs()[0] == state0);
  }

  SECTION("add return state out of order") {
    REQUIRE(!state0->SetReturnState(1, state0));
    REQUIRE(state0->GetReturnStateRefs().size() == 0);
  }

  SECTION("add too many return states") {
    for (int i = 0; i < State::MAX_STATES; i++) {
      REQUIRE(state0->SetReturnState(i, state0));
    }

    REQUIRE(state0->GetReturnStateRefs().size() == State::MAX_STATES);
    REQUIRE(!state0->SetReturnState(State::MAX_STATES, state0));
  }

  SECTION("add state which already exists at index") {
    REQUIRE(state0->SetReturnState(0, state0));
    REQUIRE(state0->GetReturnStateRefs().size() == 1);
    REQUIRE(state0->SetReturnState(0, state0));
  }
}

TEST_CASE("resolve return state ids", "[state]") {
  vector<int> returnStates;

  State s0("State0", returnStates, "test state 0");
  State s1("State1", returnStates, "test state 1");
  shared_ptr<State> state0 = std::make_shared<State>(s0);
  shared_ptr<State> state1 = std::make_shared<State>(s1);

  state0->SetReturnState(0, state0);
  state0->SetReturnState(1, state1);
  state1->SetReturnState(0, state1);
  state1->SetReturnState(1, state0);

  vector<shared_ptr<State>> stateMap;

  SECTION("all statess defined") {
    stateMap.push_back(state0);
    stateMap.push_back(state1);

    REQUIRE(state0->ResolveReturnStateIds(stateMap));
    REQUIRE(state1->ResolveReturnStateIds(stateMap));
  }

  SECTION("state map incomplete") {
    stateMap.push_back(state0);

    REQUIRE(!state0->ResolveReturnStateIds(stateMap));
  }
}

TEST_CASE("resolve return state refs", "[state]") {
  vector<int> s0Returns = vector<int>({ 0, 1 });
  vector<int> s1Returns = vector<int>({ 1, 0 });
  State s0("State0", s0Returns, "test state 0");
  State s1("State1", s1Returns, "test state 1");

  shared_ptr<State> state0 = std::make_shared<State>(s0);
  shared_ptr<State> state1 = std::make_shared<State>(s1);

  vector<shared_ptr<State>> stateMap;

  SECTION("all states defined") {
    stateMap.push_back(state0);
    stateMap.push_back(state1);

    REQUIRE(state0->ResolveReturnStateRefs(stateMap));
    REQUIRE(state1->ResolveReturnStateRefs(stateMap));
  }

  SECTION("state map incomplete") {
    stateMap.push_back(state0);
    REQUIRE(!state0->ResolveReturnStateRefs(stateMap));
  }
}
