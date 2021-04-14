package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/go-redis/redis"
	"github.com/gorilla/mux"
)

var client *redis.Client

// BasketItem type
type BasketItem struct {
	MovieID    int    `json:"movieId"`
	Quantity   int    `json:"quantity"`
	PosterPath string `json:"posterPath"`
	Title      string `json:"title"`
	Date       int    `json:"date"`
}

// Basket type
type Basket struct {
	BasketItems []BasketItem `json:"basketItems"`
	Total       int          `json:"total"`
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

	baskets := []BasketItem{}
	err = json.Unmarshal([]byte(cacheEntry), &baskets)
	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	total := 0
	for i := 0; i < len(baskets); i++ {
		b := &baskets[i]
		total += b.Quantity
	}

	returnBasket := Basket{BasketItems: baskets, Total: total}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(returnBasket)
}

// AddBasket - Insert basket in Redis
func AddBasket(baskets []BasketItem, key string) Basket {
	cacheEntry, err := json.Marshal(&baskets)
	if err != nil {
		fmt.Println(err)

	}

	err = client.Set(key, cacheEntry, 1*time.Hour).Err()
	if err != nil {
		fmt.Println(err)

	}

	total := 0
	for i := 0; i < len(baskets); i++ {
		b := &baskets[i]
		total += b.Quantity
	}
	return Basket{BasketItems: baskets, Total: total}
}

func post(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	key := vars["id"]
	baskets := []BasketItem{}

	reqBody, _ := ioutil.ReadAll(r.Body)
	var basket BasketItem
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
			b := &baskets[i]
			if b.MovieID == basket.MovieID {
				b.Quantity++
				exists = true
			}
		}

		if !exists {
			baskets = append(baskets, basket)
		}
	}

	returnBasket := AddBasket(baskets, key)

	fmt.Printf("Add movie: %v to basketId: %v\n", basket.MovieID, key)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(returnBasket)
}

func delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	key := vars["id"]
	movieID, err := strconv.Atoi(vars["movieId"])

	cacheEntry, err := client.Get(key).Result()
	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	baskets := []BasketItem{}
	err = json.Unmarshal([]byte(cacheEntry), &baskets)
	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	baskets = removeIt(movieID, baskets)

	returnBasket := AddBasket(baskets, key)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(returnBasket)
}

func removeIt(movieID int, ssSlice []BasketItem) []BasketItem {
	for idx, v := range ssSlice {
		if v.MovieID == movieID {
			return append(ssSlice[0:idx], ssSlice[idx+1:]...)
		}
	}
	return ssSlice
}

func main() {

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
	r.HandleFunc("/basket/{id}/{movieId}", delete).Methods(http.MethodDelete)

	fmt.Println("Starting basket api")
	log.Fatal(http.ListenAndServe(":80", r))
}
