package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"sync"

	"github.com/jackc/pgx/v4"
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
}

func main() {

	config, err := pgx.ParseConfig("postgres://postgres:postgres@localhost/kubeflix")
	if err != nil {
		log.Fatal("error configuring the database: ", err)
	}

	conn, err := pgx.ConnectConfig(context.Background(), config)
	if err != nil {
		log.Fatal("error connecting to the database: ", err)
	}
	defer conn.Close(context.Background())

	// Create tables.
	if _, err := conn.Exec(context.Background(),
		"CREATE TABLE IF NOT EXISTS orders (id SERIAL PRIMARY KEY, userId INT, date timestamp DEFAULT CURRENT_TIMESTAMP)"); err != nil {
		log.Fatal(err)
	}
	if _, err := conn.Exec(context.Background(),
		"CREATE TABLE IF NOT EXISTS order_items (id SERIAL PRIMARY KEY, orderId int NOT NULL, movieId INT, title TEXT, FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE)"); err != nil {
		log.Fatal(err)
	}

	url := os.Getenv("NATS_URL")
	if url == "" {
		url = stan.DefaultNatsURL
	}

	sc, err := stan.Connect("test-cluster", "order-proc", stan.NatsURL(url))
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Connected to nats server: %s\n", url)

	// Use a WaitGroup to wait for a message to arrive
	wg := sync.WaitGroup{}
	wg.Add(1)

	// Simple Async Subscriber
	sub, _ := sc.Subscribe(os.Getenv("NATS_SUBJECT"), func(m *stan.Msg) {
		fmt.Printf("Received a message: %s\n", string(m.Data))

		//desirialize json
		var basket Basket
		json.Unmarshal([]byte(m.Data), &basket)

		orderId := 0
		// save to persistant storage
		if err := conn.QueryRow(context.Background(),
			"INSERT INTO orders (userId) VALUES ($1) RETURNING id", basket.Session).Scan(&orderId); err != nil {
			log.Fatal(err)
		}

		for _, s := range basket.Basket {
			if _, err := conn.Exec(context.Background(),
				"INSERT INTO order_items (orderId, movieId, title) VALUES ($1, $2, $3)", orderId, s.MovieID, s.Title); err != nil {
				log.Fatal(err)
			}
		}

		fmt.Printf("Row persisted to database with id: %d\n", orderId)

	}, stan.DurableName("orders"))

	// Wait for a message to come in
	wg.Wait()

	// Unsubscribe
	sub.Unsubscribe()

	// Close connection
	sc.Close()
}
