# Prodigy State Table Editor
## Why?
This project aims to build an open source editor for "BubbleLink Application
Tables". These tables are used to configure state machines for phone switching systems. While the 
phone systems these files support are outdated, feature development continues to
this day and when new states are added to the phone system source code they must 
also be added to these state files in order to be used. 

While manual editing of these "app" files is possible and fairly straight 
forward, as these files grow basic actions such as inserting or deleteing a 
state require massive refactoring efforts.
[SciDyn](https://ptabdata.blob.core.windows.net/files/2017/IPR2017-01435/v14_1017%20-%20BubbleLink.pdf),
the original company which defined the app table format,
developed a tool to assist with editing these files allowing basic acitons such
as adding, editing, and deleting states. Several features such as undo, cut,
copy, and paste, remain unimplemented and their tool does not run on Windows 
systems later than XP. 

The goal of this project is to create a modern, open source tool which gives
future maintainers of these files more features and flexability when the time 
comes make changes to these app tables.

## File Format
The BubbleLink Application Table format is fairly simple and a sample app file
would look something like the following:

```
#$HEADER; NULL
0
#$State ;TrapState; 0 1 1 ;[0] Error state

****************************************
*  Start Up

****************************************
1
#$State ;Open; 0 2 ;[1] Opening
2
#$State ;Load; 0 3 3 3 3 3 ;[2] Load Stuff
3
#$State ;Connect; 0 4 ;[3] Connect 
4
#$State ;Lookup; 0 0 5 ;[4] Lookup Stuff
5
#$State ;DoStuff; 0 6 3 4 ;[5] Do some work
6
#$State ;Close ; 0 0 1 ;[6] Cleanup and shutdown
```

At the top of the file there is always the string 
```
#$HEADER; NULL
```
Followed by some white space and either a <b>Section Header</b> or a <b>State
 Definition</b>

Section headers always have the format:
```
****************************************
*  <Description>

****************************************
```
Sections Headers are always bounded by a line of `'*'` characters. 
"\<Description\>" is a variable length string which may span multiple lines. 
Each line of the description text must start with a `'*'` character followed
by two spaces and may not be longer than 179 characters including the leading
characters. These lines are ignored by the code which reads the configuration
of the state machine.

While State Definitions always have the following format:
```
<Id>
#$State ;<Name>; <Return0> <Return1> <Return2> ... ;[<Id>] <Description>
```
Where 
* `Id` is some positive integer
* `Name` is any string with no spaces less than 39 characters
* `ReturnX` is an ID of another defined state. There may only be up to 20
defined return states
* `Description` is any string less than 80 characters