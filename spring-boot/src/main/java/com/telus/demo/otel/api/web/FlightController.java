package com.telus.demo.otel.api.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.telus.demo.otel.api.model.Flight;
import com.telus.demo.otel.api.service.FlightService;

@RestController
public class FlightController {

	   @Autowired
	    private FlightService flightService;

	    @GetMapping("/flights-old")
	    public CollectionModel<Flight> getFlightsOld() {
	        return flightService.getFlightsOld();
	    }

		@GetMapping("/flights")
	    public Flight getFlights() {
	        return flightService.getFlights();
	    }
}
