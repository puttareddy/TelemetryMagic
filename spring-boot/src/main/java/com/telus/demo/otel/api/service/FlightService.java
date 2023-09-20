package com.telus.demo.otel.api.service;

import com.telus.demo.otel.api.model.Flight;
import org.springframework.hateoas.CollectionModel;

public interface FlightService {

    CollectionModel<Flight> getFlightsOld();

     Flight getFlights();
}
