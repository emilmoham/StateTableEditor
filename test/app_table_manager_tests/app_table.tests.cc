#include <catch2/catch_test_macros.hpp>

#include "models/app_table.h"
#include "models/state.h"

namespace state_table_editor {

TEST_CASE("state map metadata", "[app_table]") {
  AppTable appTable("");

  shared_ptr<State> state0(new State("TestState0", "Test State 0"));
  shared_ptr<State> state1(new State("TestState1", "Test State 1"));

  SECTION("get state count") {
    REQUIRE(appTable.GetStateCount() == 0);

    appTable.InsertState(state0);

    REQUIRE(appTable.GetStateCount() == 1);

    appTable.InsertState(state1, state0);
    REQUIRE(appTable.GetStateCount() == 2);
  }
}

TEST_CASE("insert state", "[app_table]") {
  AppTable appTable("");

  shared_ptr<State> state0(new State("TestState0", "Test State 0"));
  shared_ptr<State> state1(new State("TestState1", "Test State 1"));

  SECTION("insert state with no args as first state") {
    bool rc = appTable.InsertState();
    REQUIRE(rc);
    REQUIRE(appTable.GetStateCount() == 1);
  }

  SECTION("insert state with no args as state 2+") {
    bool rc = appTable.InsertState();
    REQUIRE(rc);
    REQUIRE(appTable.GetStateCount() == 1);

    rc = appTable.InsertState();
    REQUIRE(!rc);
    REQUIRE(appTable.GetStateCount() == 1);
  }

  SECTION("insert state before valid state") {
    bool rc = appTable.InsertState(state0);
    REQUIRE(rc);
    REQUIRE(appTable.GetStateCount() == 1);

    shared_ptr<State> adjacentState = appTable.GetState(0);
    REQUIRE(adjacentState == state0);

    rc = appTable.InsertState(state1, adjacentState, false);
    REQUIRE(rc);

    REQUIRE(state1 == appTable.GetState(0));
    REQUIRE(adjacentState == appTable.GetState(1));
  }

  SECTION("insert state before invalid state") {
    bool rc = appTable.InsertState();
    REQUIRE(rc);

    rc = appTable.InsertState(state1, state0, false);
    REQUIRE(!rc);
  }

  SECTION("insert state after valid state") {
    bool rc = appTable.InsertState(state0);
    REQUIRE(rc);
    REQUIRE(appTable.GetStateCount() == 1);

    shared_ptr<State> adjacentState = appTable.GetState(0);
    REQUIRE(adjacentState == state0);

    rc = appTable.InsertState(state1, adjacentState, true);
    REQUIRE(rc);

    REQUIRE(adjacentState == appTable.GetState(0));
    REQUIRE(state1 == appTable.GetState(1));
  }

  SECTION("insert state after invalid state") {
    bool rc = appTable.InsertState();
    REQUIRE(rc);

    rc = appTable.InsertState(state1, state0, true);
    REQUIRE(!rc);
  }
}

TEST_CASE("delete state", "[app_table]") {
  AppTable appTable("");

  shared_ptr<State> state0(new State("TestState0", "Test State 0"));
  shared_ptr<State> state1(new State("TestState1", "Test State 1"));
  shared_ptr<State> state2(new State("TestState2", "Test State 2"));
  shared_ptr<State> invalidState(new State("InvalidState", "Invalid State"));

  SECTION("delete invalid state") {
    bool rc = appTable.DeleteState(invalidState);
    REQUIRE(rc == false);
  }

  SECTION("delete state single state exists") {
    bool rc = appTable.InsertState(state0);
    REQUIRE(appTable.GetStateCount() == 1);

    rc = appTable.DeleteState(state0);
    REQUIRE(rc);
    REQUIRE(appTable.GetStateCount() == 0);
  }

  SECTION("delete state no replacement multiple states exist") {
    bool rc = appTable.InsertState(state0);
    rc = appTable.InsertState(state1, state0);
    REQUIRE(appTable.GetStateCount() == 2);

    rc = appTable.DeleteState(state0);
    REQUIRE(!rc);
    REQUIRE(appTable.GetStateCount() == 2);
  }

  SECTION("delete state single state exists replace with invalid state") {
    bool rc = appTable.InsertState(state0);
    REQUIRE(appTable.GetStateCount() == 1);

    rc = appTable.DeleteState(state0, invalidState);
    REQUIRE(rc);
    REQUIRE(appTable.GetStateCount() == 0);
  }

  SECTION("delete state mulitple states exist replace with invalid") {
    bool rc = appTable.InsertState(state0);
    appTable.InsertState(state1, state0);
    REQUIRE(appTable.GetStateCount() == 2);

    rc = appTable.DeleteState(state0, invalidState);
    REQUIRE(!rc);
    REQUIRE(appTable.GetStateCount() == 2);
  }

  SECTION("delete state point to valid state") {
     bool rc = appTable.InsertState(state0);
     REQUIRE(rc);
     rc = appTable.InsertState(state1, state0);
     REQUIRE(rc);
     rc = appTable.InsertState(state2, state1);
     REQUIRE(rc);

     state0->SetReturnState(0, state0);
     state0->SetReturnState(1, state1);
     state0->SetReturnState(2, state1);  // 0 1 1
     state1->SetReturnState(0, state0);
     state1->SetReturnState(1, state2);
     state1->SetReturnState(2, state2);  // 0 2 2
     state2->SetReturnState(0, state0);
     state2->SetReturnState(1, state2);
     state2->SetReturnState(2, state1);  // 0 2 1

     REQUIRE(appTable.GetStateCount() == 3);

     rc = appTable.DeleteState(state1, state0);
     REQUIRE(rc);
     REQUIRE(appTable.GetStateCount() == 2);
     REQUIRE(appTable.GetState(1)->GetName() == "TestState2");
     REQUIRE(appTable.GetState(1)->GetReturnStateRefs().at(2) == state0);
  }
}

}  // namespace state_table_editor