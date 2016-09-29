package org.abstractmachines.fsm.app;


import java.util.concurrent.atomic.AtomicLong;

import org.abstractmachines.fsm.types.AddStateRequest;
import org.abstractmachines.fsm.types.AddStateResponse;
import org.abstractmachines.fsm.types.AddSymbolRequest;
import org.abstractmachines.fsm.types.AddSymbolResponse;
import org.abstractmachines.fsm.types.AddTransitionRequest;
import org.abstractmachines.fsm.types.AddTransitionResponse;
import org.abstractmachines.fsm.types.CreateFSMRequest;
import org.abstractmachines.fsm.types.CreateFSMResponse;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping(value="/fsm")
public class FSMRESTController extends FSMImplWrapper{
    private static final String template = "Hello, %s!";
    private final AtomicLong counter = new AtomicLong();

    @RequestMapping("/greeting")
    public Greeting greeting(@RequestParam(value="name", defaultValue="World") String name) {
        return new Greeting(counter.incrementAndGet(),
                            String.format(template, name));
    }
    
    @Override
    @RequestMapping(value = "/listMachineNames", produces =  {"application/json", "application/xml"})
	public ListMachineNamesResponse listMachineNames() {
    	return super.listMachineNames();
	}
    
    @Override
    @RequestMapping(value = "/getMachineType", produces =  {"application/json", "application/xml"})
	public GetMachineTypeResponse getMachineType() {
		return super.getMachineType();
	}

	@Override
    @RequestMapping(value = "/getFSM" , produces =  {"application/json", "application/xml"}  , consumes =  {"application/json", "application/xml"} )
	public GetFSMResponse getFSM(@RequestBody  GetFSMRequest req) {
		return super.getFSM(req);
	}

	@Override
    @RequestMapping(value = "/addSymbol" , produces =  {"application/json", "application/xml"}  , consumes =  {"application/json", "application/xml"} )
	public AddSymbolResponse addSymbol(@RequestBody  AddSymbolRequest  req){
		return super.addSymbol(req);
	}
	
	
	@Override
    @RequestMapping(value = "/createFSM" , produces =  {"application/json", "application/xml"}  , consumes =  {"application/json", "application/xml"})
	public CreateFSMResponse createFSM(@RequestBody  CreateFSMRequest req) {
		return super.createFSM(req);
	}

	@Override
    @RequestMapping(value = "/getTargetState", produces =  {"application/json", "application/xml"}  , consumes =  {"application/json", "application/xml"})
	public GetTargetStateResponse getTargetState(@RequestBody GetTargetStateRequest req) {
		return super.getTargetState(req);
	}

	@Override
    @RequestMapping(value = "/getTargetStateForState", produces =  {"application/json", "application/xml"}  , consumes =  {"application/json", "application/xml"})
	public GetTargetStateForStateResponse getTargetStateForState(@RequestBody GetTargetStateForStateRequest req) {
		return super.getTargetStateForState(req);
	}


	@Override
    @RequestMapping(value = "/addState", produces =  {"application/json", "application/xml"}  , consumes =  {"application/json", "application/xml"})
	public AddStateResponse addState(@RequestBody  AddStateRequest req) {
		return super.addState(req);
	}

	@Override
    @RequestMapping(value = "/getStatePosForName", produces =  {"application/json", "application/xml"}  , consumes =  {"application/json", "application/xml"})
	public GetStatePosForNameResponse getStatePosForName(@RequestBody  
			GetStatePosForNameRequest req) {
		return super.getStatePosForName(req);
	}

	@Override
    @RequestMapping(value = "/addTransition")
	public AddTransitionResponse addTransition(@RequestBody AddTransitionRequest req) {
		return super.addTransition(req);
	}


}
