package com.telus.demo.otel.api.service;

import com.telus.demo.otel.api.model.Flight;

import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@Service
public class FlightServiceImpl implements FlightService {

    @Autowired
    private FlightClient flightClient;

    @Override
    public CollectionModel<Flight> getFlightsOld() {
        return doGetFlightsSerial();
        //return doGetFlightsParallel();
    }

     @Override
    public Flight getFlights() {
        return new Flight("this is flight");
    }

    private CollectionModel<Flight> doGetFlightsSerial() {
        val result = new ArrayList<Flight>();
        Flight ff = new Flight("this is flight");
        result.add(ff);
//        result.addAll(flightClient.getProvider1Flights().getContent());
//        result.addAll(flightClient.getProvider2Flights().getContent());
        return CollectionModel.of(result);
    }

    private CollectionModel<Flight> doGetFlightsParallel() {
        val flights1 = flightClient.getProvider1FlightsAsync();
        val flights2 = flightClient.getProvider2FlightsAsync();
        CompletableFuture.allOf(new CompletableFuture[] { flights1, flights2 }).join();

        try {
            val result = new ArrayList<Flight>();
            result.addAll(flights1.get().getContent());
            result.addAll(flights2.get().getContent());
            return CollectionModel.of(result);
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
