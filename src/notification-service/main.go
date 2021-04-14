package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"sync"

	stan "github.com/nats-io/stan.go"
)

type BasketItem struct {
	MovieID int    `json:"movieId"`
	Title   string `json:"title"`
}

// Basket type
type Basket struct {
	Basket  []BasketItem `json:"basket"`
	Session string       `json:"session"`
	OrderId int          `json:"orderId"`
}

func main() {

	url := os.Getenv("NATS_URL")
	if url == "" {
		url = stan.DefaultNatsURL
	}

	sc, err := stan.Connect("test-cluster", "notification-svc", stan.NatsURL(url))
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Connected to nats server: %s\n", url)

	// Use a WaitGroup to wait for a message to arrive
	wg := sync.WaitGroup{}
	wg.Add(1)

	// Simple Async Subscriber
	sub, _ := sc.Subscribe(os.Getenv("ORDER_COMPLETE_SUBJECT"), func(m *stan.Msg) {
		fmt.Printf("Received a message: %s\n", string(m.Data))

		//desirialize json
		var basket Basket
		json.Unmarshal([]byte(m.Data), &basket)

		fmt.Printf("Order completed event received with id: %d\n", basket.OrderId)

	}, stan.DurableName("orders"))

	subShip, _ := sc.Subscribe(os.Getenv("ORDER_SHIPPED_SUBJECT"), func(m *stan.Msg) {
		fmt.Printf("Received a message: %s\n", string(m.Data))

		//desirialize json
		var basket Basket
		json.Unmarshal([]byte(m.Data), &basket)

		fmt.Printf("Order shipped event received with id: %d\n", basket.OrderId)

	}, stan.DurableName("orders"))

	// Wait for a message to come in
	wg.Wait()

	// Unsubscribe
	sub.Unsubscribe()
	subShip.Unsubscribe()

	// Close connection
	sc.Close()
}
