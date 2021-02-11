package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/go-redis/redis"
	"github.com/gorilla/mux"
)

var client *redis.Client

// Basket type
type Basket struct {
	MovieID  int `json:"movieId"`
	Quantity int `json:"quantity"`
}

func get(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	key := vars["id"]
	fmt.Println("basketId:" + key)

	cacheEntry, err := client.Get(key).Result()
	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	baskets := []Basket{}
	err = json.Unmarshal([]byte(cacheEntry), &baskets)
	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(baskets)
}

// AddBasket - Insert basket in Redis
func AddBasket(baskets []Basket, key string) {
	cacheEntry, err := json.Marshal(&baskets)
	if err != nil {
		fmt.Println(err)

	}

	err = client.Set(key, cacheEntry, 1*time.Hour).Err()
	if err != nil {
		fmt.Println(err)

	}
}

func post(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	key := vars["id"]
	baskets := []Basket{}

	reqBody, _ := ioutil.ReadAll(r.Body)
	var basket Basket
	err := json.Unmarshal(reqBody, &basket)
	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	existingBaskets, err := client.Get(key).Result()
	if err == redis.Nil {
		//Create new
		baskets = append(baskets, basket)

	} else if err == nil {
		//Append to existing

		err = json.Unmarshal([]byte(existingBaskets), &baskets)
		if err != nil {
			fmt.Println(err)
			http.Error(w, err.Error(), http.StatusBadRequest)
		}

		exists := false
		for i := 0; i < len(baskets); i++ {
			attr := &baskets[i]
			if attr.MovieID == basket.MovieID {
				attr.Quantity++
				exists = true
			}
		}

		if !exists {
			baskets = append(baskets, basket)
		}
	}

	AddBasket(baskets, key)

	fmt.Printf("Add movie: %v to basketId: %v\n", basket.MovieID, key)
	w.WriteHeader(http.StatusCreated)
	w.Write([]byte(`OK`))
}

func delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	key := vars["id"]

	err := client.Del(key).Err()
	if err != nil {
		fmt.Println(err)

	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`OK`))
}

func main() {

	port := os.Getenv("DEFAULT_PORT")
	if port == "" {
		port = "9999"
	}

	redisURL := os.Getenv("REDIS_URL")
	if redisURL == "" {
		redisURL = "localhost:6379"
	}

	client = redis.NewClient(&redis.Options{
		Addr:     redisURL,
		Password: "",
		DB:       0,
	})

	pong, err := client.Ping().Result()
	fmt.Println(pong, err)
	fmt.Println("Redis: " + redisURL)

	r := mux.NewRouter()
	r.HandleFunc("/basket/{id}", get).Methods(http.MethodGet)
	r.HandleFunc("/basket/{id}", post).Methods(http.MethodPost)
	r.HandleFunc("/basket/{id}", delete).Methods(http.MethodDelete)

	fmt.Println("Starting basket api on port: " + port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
