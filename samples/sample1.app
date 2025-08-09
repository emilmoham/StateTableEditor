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

****************************************
*  Section 2
*  with extra lines

****************************************
6
#$State ;Close ; 0 0 1 ;[6] Cleanup and shutdown

