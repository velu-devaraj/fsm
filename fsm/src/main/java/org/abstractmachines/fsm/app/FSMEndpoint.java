package org.abstractmachines.fsm.app;


import org.abstractmachines.fsm.types.AddStateRequest;
import org.abstractmachines.fsm.types.AddStateResponse;
import org.abstractmachines.fsm.types.AddTransitionRequest;
import org.abstractmachines.fsm.types.AddTransitionResponse;
import org.abstractmachines.fsm.types.CreateFSMRequest;
import org.abstractmachines.fsm.types.CreateFSMResponse;
import org.abstractmachines.fsm.types.GetFSMRequest;
import org.abstractmachines.fsm.types.GetFSMResponse;
import org.abstractmachines.fsm.types.GetMachineTypeResponse;
import org.abstractmachines.fsm.types.GetStatePosForNameRequest;
import org.abstractmachines.fsm.types.GetStatePosForNameResponse;
import org.abstractmachines.fsm.types.GetTargetStateRequest;
import org.abstractmachines.fsm.types.GetTargetStateResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;


//@Endpoint
public class FSMEndpoint extends FSMImplWrapper {
	@Override
	public GetMachineTypeResponse getMachineType() {
		return super.getMachineType();
	}

	@Override
	@PayloadRoot(namespace = NAMESPACE_URI, localPart = "getFSMRequest")
	@ResponsePayload
	public GetFSMResponse getFSM(GetFSMRequest req) {
		return super.getFSM(req);
	}

	@Override
	@PayloadRoot(namespace = NAMESPACE_URI, localPart = "createFSMRequest")
	@ResponsePayload
	public CreateFSMResponse createFSM(CreateFSMRequest req) {
		return super.createFSM(req);
	}

	@Override
	@PayloadRoot(namespace = NAMESPACE_URI, localPart = "getTargetStateRequest")
	@ResponsePayload
	public GetTargetStateResponse getTargetState(GetTargetStateRequest req) {
		return super.getTargetState(req);
	}

	@Override
	@PayloadRoot(namespace = NAMESPACE_URI, localPart = "addStateRequest")
	@ResponsePayload
	public AddStateResponse addState(AddStateRequest req) {
		return super.addState(req);
	}

	@Override
	@PayloadRoot(namespace = NAMESPACE_URI, localPart = "getStatePosForNameRequest")
	@ResponsePayload
	public GetStatePosForNameResponse getStatePosForName(
			GetStatePosForNameRequest req) {
		return super.getStatePosForName(req);
	}

	@Override
	@PayloadRoot(namespace = NAMESPACE_URI, localPart = "addTransitionRequest")
	@ResponsePayload
	public AddTransitionResponse addTransition(AddTransitionRequest req) {
		return super.addTransition(req);
	}

	//@Autowired
	public FSMEndpoint() {
		currentState = 0;
		
	}	


}
