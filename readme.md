## Simulate and Test

A simple project to create and visually simulate finite state machines.

New finite state machines can be created and persisted in xml files that store the symbols and transitions.

To build and run project requires gradle. Gradle should be installed and in the path. 

After a git clone change to fsm folder and issue gradle run.

This builds and runs a web app listening at port 8080. 

Then go to http://localhost:8080/fsm/index.html

Click on the link. Click on load and click on existing sample TestMachine1.xml

The simulation page opens up showing the states transitions and symbols.

The bottom most text area takes in the sequence separated by space as machine input. Click in test acceptance. The change of state and final acceptance or rejection of the input is displayed.

## Create Finite State Machine

Specify a new name next to the create button in the page http://localhost:8080/fsm/fsm.html#/fsm

Buttons labeled <B>Add ...</B> allow creating symbols, states and transitions.

Start adding short symbols, naming in the adjacent test field.
eg. x, y, z, ax, ay, ...
The table is created as columns of 5.

Then add states with short names. Make sure to add the start state only once by checking the box. A graphical view shows states columns of 5.
To add transitions click on "Add transitions" followed by clicking on 2 states in the transition table and a symbol in the symbol table.

The grahic view is limited and shows in columns of 5. 
Edges around a node are approximately equally spaced for each quadrant.









