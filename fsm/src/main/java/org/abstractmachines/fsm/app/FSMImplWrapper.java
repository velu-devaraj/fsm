package org.abstractmachines.fsm.app;

import java.util.List;

import org.abstractmachines.fsm.types.AddStateRequest;
import org.abstractmachines.fsm.types.AddStateResponse;
import org.abstractmachines.fsm.types.AddSymbolRequest;
import org.abstractmachines.fsm.types.AddSymbolResponse;
import org.abstractmachines.fsm.types.AddTransitionRequest;
import org.abstractmachines.fsm.types.AddTransitionResponse;
import org.abstractmachines.fsm.types.CreateFSMRequest;
import org.abstractmachines.fsm.types.CreateFSMResponse;
import org.abstractmachines.fsm.types.FiniteStateMachine;
import org.abstractmachines.fsm.types.GetFSMRequest;
import org.abstractmachines.fsm.types.GetFSMResponse;
import org.abstractmachines.fsm.types.GetMachineTypeResponse;
import org.abstractmachines.fsm.types.GetStatePosForNameRequest;
import org.abstractmachines.fsm.types.GetStatePosForNameResponse;
import org.abstractmachines.fsm.types.GetTargetStateForStateRequest;
import org.abstractmachines.fsm.types.GetTargetStateForStateResponse;
import org.abstractmachines.fsm.types.GetTargetStateRequest;
import org.abstractmachines.fsm.types.GetTargetStateResponse;
import org.abstractmachines.fsm.types.ListMachineNamesResponse;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

public class FSMImplWrapper {

	protected static final String NAMESPACE_URI = "http://fsm.amachines.org/types";
	/**
	 * 
	 */
	@SuppressWarnings("unused")
	private static final long serialVersionUID = 3550913473358857646L;
	List<FiniteStateMachine> allFSMs;
	protected long currentState;

	public FSMImplWrapper() {
		super();
	}

	public GetMachineTypeResponse getMachineType() {
		GetMachineTypeResponse res = new GetMachineTypeResponse();
		FSMImpl fsmImpl = new FSMImpl();
		res.setMachineType(fsmImpl.getMachineType());
		return res;
	}

	public ListMachineNamesResponse listMachineNames() {
		ListMachineNamesResponse res = new ListMachineNamesResponse();
		FSMImpl fsmImpl = new FSMImpl();
		res.getMachineNames().addAll(fsmImpl.listMachineNames());
		return res;
	}
	
	public GetFSMResponse getFSM(GetFSMRequest req) {
		try{
			GetFSMResponse res;
			FSMImpl fsmImpl = new FSMImpl();
			res = new GetFSMResponse();
			res.setFsm(fsmImpl.getFSM(req.getName()));
			return res;
			
		}catch(Exception ex){
			return null;
		}
		
	}
	public AddSymbolResponse addSymbol(AddSymbolRequest  req){
		try{
			AddSymbolResponse res;
			FSMImpl fsmImpl = new FSMImpl();
			res = new AddSymbolResponse();		
			res.setSymbolIndex(fsmImpl.addSymbol(req.getMachineName(),req.getSymbolName()));
			return res;
			
		}catch(Exception ex){
			return null;
		}		
	}

	public CreateFSMResponse createFSM(CreateFSMRequest req) {
		try{
			FSMImpl fsmImpl = new FSMImpl();
			boolean success = fsmImpl.createFSM(req.getFsm());
			CreateFSMResponse res = new CreateFSMResponse();
			res.setSuccess(success);			
			return res;
			
		}catch(Exception ex){
			return null;
		}
		
	}

	public GetTargetStateResponse getTargetState(GetTargetStateRequest req) {
	
		FSMImpl fsmImpl = new FSMImpl();
		GetTargetStateResponse res = new GetTargetStateResponse();
		long currentState = fsmImpl.getTargetState(req.getMachineName(),req.getInputSymbol());
		res.setStateID(currentState);
		return res;
	}

	public AddStateResponse addState(AddStateRequest req) {
	
		FSMImpl fsmImpl = new FSMImpl();
		AddStateResponse res = new AddStateResponse();
		long id  = fsmImpl.addState(req.getMachineName(), req.getStateName(), req.isStartState(),req.isEndState());
		res.setStateID(id);
		return res;
	}

	public GetStatePosForNameResponse getStatePosForName(GetStatePosForNameRequest req) {
		FSMImpl fsmImpl = new FSMImpl();
		GetStatePosForNameResponse res = new GetStatePosForNameResponse();
		long pos = fsmImpl.getStatePosForName(req.getMachineName(), req.getStateName());
		res.setPosition(pos);
		return res;
	
	}

	public AddTransitionResponse addTransition(AddTransitionRequest req) {
		AddTransitionResponse res = new AddTransitionResponse();
		FSMImpl fsmImpl = new FSMImpl();
		long id = fsmImpl.addTransition(req.getMachineName(), req.getSourceState(), 
				req.getTargetState(), req.getInputSymbol());
		res.setTransitionID(id);		
		return res;
	}

	public GetTargetStateForStateResponse getTargetStateForState(
			GetTargetStateForStateRequest req) {
		FSMImpl fsmImpl = new FSMImpl();
		GetTargetStateForStateResponse res = new GetTargetStateForStateResponse();
		long currentState = fsmImpl.getTargetStateForState(req.getMachineName(),req.getFromState(),req.getInputSymbol());
		res.setStateID(currentState);
		return res;
	}

}