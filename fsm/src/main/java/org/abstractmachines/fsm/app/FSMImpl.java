package org.abstractmachines.fsm.app;

import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;
import javax.xml.namespace.QName;
import javax.xml.transform.stream.StreamSource;

import org.abstractmachines.fsm.types.FSMState;
import org.abstractmachines.fsm.types.FSMTransition;
import org.abstractmachines.fsm.types.FiniteStateMachine;
import org.abstractmachines.fsm.types.Symbol;

public class FSMImpl {
	static List<FiniteStateMachine> allFSMs = new ArrayList<FiniteStateMachine>();
	static JAXBContext jaxbContext = initJAXBContext(); 

	public String getMachineType() {
		return "Finite State Machine";
	}
	
	
	static JAXBContext  initJAXBContext(){
		
		try {
			return JAXBContext.newInstance(FiniteStateMachine.class);
		} catch (JAXBException e) {
			return null;
		}
	}
	
	long currentState;
	
	

	public List<String> listMachineNames(){
		File folder = new File("./");
		
		File[] listOfFiles = folder.listFiles();
		
	
		List<String> files = new ArrayList<String>();
		for (File file : listOfFiles) {
		    if (file.isFile() ) {
		    	String f = file.getName();
		    	if(f.endsWith(".xml")){
		    		files.add(f.substring(0,f.length()-4));
		    	}
		    }
		}	
		
		return files;
	
	}
	
	
	public FiniteStateMachine getFSM( String name)  {
		try{
			if(allFSMs == null){
				return null;
			}
			for(FiniteStateMachine fsm : allFSMs ){
				if(fsm.getName().equals(name)){
					return fsm;
				}
			}
			
			File f = new File(name+".xml");
			if(!f.exists()){
				return null;
			}
			
			StreamSource ss = new StreamSource(f);
			
			//JAXBContext jaxbContext =  JAXBContext.newInstance(JAXBElement.class);
			//JAXBElement<FiniteStateMachine> el = new JAXBElement<FiniteStateMachine>(new QName("http://fsm.amachines.org/types","local"),FiniteStateMachine.class,fsm) ;
			
			
			Unmarshaller unmarshaller = jaxbContext.createUnmarshaller();
			JAXBElement<FiniteStateMachine> el =  unmarshaller.unmarshal(ss,FiniteStateMachine.class);	
			
			return el.getValue();
			
		}catch(Exception ex){
			return null;
		}
		
	}
	
	public boolean createFSM(FiniteStateMachine fsm)  {
		try{
			if(fsm == null){
				return false;
			}
			
			File f = new File(fsm.getName() + ".xml");
			if(f.exists()){
				return false;
			}
						

			
			//JAXBContext jaxbContext =  JAXBContext.newInstance(FiniteStateMachine.class);
			JAXBElement<FiniteStateMachine> el = new JAXBElement<FiniteStateMachine>(new QName("http://fsm.amachines.org/types","local"),FiniteStateMachine.class,fsm) ;
			
			Marshaller marshaller = jaxbContext.createMarshaller();
			marshaller.marshal(el,f);	
			
			if(allFSMs == null){
				allFSMs = new ArrayList<FiniteStateMachine>();
				allFSMs.add(fsm);
			}			

			return true;
			
		}catch(Exception ex){
			return false;
		}
		
	}

	public long getTargetState(String machineName, long inputSymbol){
		FiniteStateMachine fsm = this.getFSM(machineName);
		if(fsm == null){
			return -1;
		}
		return currentState = getTargetStateForState(machineName,currentState,inputSymbol);
	}
	
	public long getTargetStateForState(String machineName, long fromState, long inputSymbol){
		FiniteStateMachine fsm = this.getFSM(machineName);
		if(fsm == null){
			return -1;
		}

		if(fsm.getAllStates().size() <= fromState){
			return -1;
		}
		int i = 0;
		FSMState state = fsm.getAllStates().get((int)fromState);
		/* 
		 * this is a simple linear search. *
		 */
		long toState = -1;
		while(i < state.getNodeTransitions().size()){
			FSMTransition transition = state.getNodeTransitions().get(i);
			if(transition.getInputSymbol() == inputSymbol){
				toState = transition.getToState();
				break;
			}
			i++;
		}
		return toState;
		
	}

	public long addState(String machineName,  String stateName, boolean isStartState, boolean isEndState){
		FiniteStateMachine fsm = getFSM(machineName);
		if(fsm == null){
			return -1;
		}		
		List<FSMState> states = fsm.getAllStates();

		long size = states.size();
		if(stateName == null || stateName.trim().equals("")){
			stateName = "q" + size;
		}
		/* check duplicate */
		FSMState q = new FSMState();
		q.setState(stateName);
		
		
		String stateType = "";
		
		if(isStartState){
			stateType = "s";
		}
		if(isEndState){
			stateType += "e";
		}
		
		if(!stateType.isEmpty()){
			q.setStateType(stateType);
		}
		
		
		fsm.getAllStates().add(q);
		

		this.save(fsm);
		
		return fsm.getAllStates().size() - 1;
	}

	public int addSymbol(String machineName, String symbolName){
		FiniteStateMachine fsm = this.getFSM(machineName);
		if(fsm == null){
			return -1;
		}	
		if(symbolName == null || symbolName.trim().isEmpty()){
			return -1;
		}
		List<Symbol> symbols = fsm.getAllSymbols();

		for(Symbol s : symbols){
			if(s.getSymbol().equals(symbolName)){
				return -1; // this already exists
			}
		}

		Symbol symbolToAdd = new Symbol();
		symbolToAdd.setSymbol(symbolName);
		symbols.add(symbolToAdd);
		
		this.save(fsm);
		
		return symbols.size()-1;
	}
	
	public boolean save(FiniteStateMachine fsm ){
		try {		
			File f = new File(fsm.getName()+".xml");


			//JAXBContext jaxbContext =  JAXBContext.newInstance(FiniteStateMachine.class);
			JAXBElement<FiniteStateMachine> el = new JAXBElement<FiniteStateMachine>(new QName("http://fsm.amachines.org/types","local"),FiniteStateMachine.class,fsm) ;
			
			Marshaller marshaller = jaxbContext.createMarshaller();
			marshaller.setProperty( Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE );
			marshaller.marshal(el,f);	
			return true;
						
		} catch (JAXBException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		}
		
	}

	public long getStatePosForName(String machineName, String stateName){
		FiniteStateMachine fsm = this.getFSM(machineName);
		if(fsm == null){
			return -1;
		}		
		List<FSMState> states = fsm.getAllStates();
		long size = fsm.getAllStates().size();
		int i = 0;
		while(i < size){
			String name = states.get(i).getState();
			if(stateName.trim().equals(name)){
				return i;
			}
			i++;
		}
		return -1;
	
	}
	 
	public FSMState getStateForPos(String machineName, int i){
		FiniteStateMachine fsm = this.getFSM(machineName);
		if(fsm == null){
			return null;
		}		
		List<FSMState> states = fsm.getAllStates();
	
		if(states.size() > i){
			return states.get(i);
		}
		return null;
	}
	
	public int addTransition(String machineName, long sourceState, long targetState, long inputSymbol){
		FiniteStateMachine fsm = this.getFSM(machineName);
		if(fsm == null){
			return -1;
		}	
		
		List<FSMTransition> nodeTransitions = fsm.getAllStates().get((int)sourceState).getNodeTransitions();
		int i = 0;
		while(i < nodeTransitions.size()){
			long symbol = nodeTransitions.get(i).getInputSymbol();
			if(symbol == inputSymbol){
				return -1; // there already is a transition for inputSymbol
			}
			i++;
		}
		FSMTransition transition = new FSMTransition();
		transition.setInputSymbol(inputSymbol);
		transition.setToState(targetState);
		nodeTransitions.add(transition);
		this.save(fsm);
		return nodeTransitions.size()-1;
	}		

}
