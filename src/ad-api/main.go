package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"time"
)

type Ad struct {
	Desc string `json:"desc"`
}

func get(w http.ResponseWriter, r *http.Request) {

	var ads = []Ad{
		{Desc: "50% off"},
		{Desc: "Buy one get one free"},
	}

	rand.Seed(time.Now().Unix())
	var ad = ads[rand.Intn(len(ads))]

	fmt.Printf("Endpoint Hit: Got Ad %v\n", ad.Desc)
	json.NewEncoder(w).Encode(ad)
}

func healthChek(w http.ResponseWriter, r *http.Request) {

	fmt.Printf("Ad api healthy!")
	w.WriteHeader(200)
}

func handleRequests() {
	http.HandleFunc("/", get)
	http.HandleFunc("/healthz", healthChek)
	http.HandleFunc("/healthx", healthChek)
	log.Fatal(http.ListenAndServe(":80", nil))
}

func main() {
	fmt.Println("Server started")
	handleRequests()
}
