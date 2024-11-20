package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var client *mongo.Client
var db *mongo.Database

// Initialize MongoDB client globally
func initMongo() {
	// Load environment variables from .env file (optional)
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	// Get MongoDB URI from the environment variable
	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		log.Fatal("MONGO_URI environment variable is not set")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var err error
	client, err = mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))

	if err != nil {
		log.Fatalf("Failed to initiate MongoDB connection: %v", err)
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB server: %v", err)
	}

	println("Successfully connected to MongoDB!")
	db = client.Database(os.Getenv("DATABASE_NAME"))
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		next.ServeHTTP(w, r)
	})
}

func getBooksHandler(w http.ResponseWriter, r *http.Request) {
	// Use the global db object to access the collection
	collection := db.Collection("books")

	// Define a filter (optional)
	filter := bson.D{
		{"publication_year", bson.D{
			{"$gte", 2020},
			{"$lt", 2025},
		}},
	}

	page := 1
	pageSize := 20
	skip := (pageSize * (page - 1))

	// Define options (limit, skip, and sorting)
	options := options.Find().SetLimit(int64(pageSize)).SetSkip(int64(skip))
	// .SetSort(bson.D{{"title", 1}}) // @TODO: Sort is leading to very slow response

	// Perform the query
	cursor, err := collection.Find(context.Background(), filter, options)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error fetching books: %v", err), http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	// Fetch the books into a slice
	var books []bson.M
	for cursor.Next(context.Background()) {
		var book bson.M
		if err := cursor.Decode(&book); err != nil {
			http.Error(w, fmt.Sprintf("Error decoding book: %v", err), http.StatusInternalServerError)
			return
		}
		books = append(books, book)
	}

	response := map[string]interface{}{
		"data":       books,
		"totalCount": len(books),
	}

	// Return the results as JSON
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, fmt.Sprintf("Error encoding JSON: %v", err), http.StatusInternalServerError)
	}
}

func main() {
	initMongo()

	http.Handle("/api/books", corsMiddleware(http.HandlerFunc(getBooksHandler)))

	fmt.Println("Server started at port 4500")
	err := http.ListenAndServe(":4500", nil)

	if err != nil {
		fmt.Printf("error starting server: %v\n", err)
	}
}
