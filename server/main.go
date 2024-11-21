package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
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

func validateRequest(params url.Values) error {
	var errors []string

	if offset, err := strconv.Atoi(params.Get("offset")); err != nil || offset < 0 {
		errors = append(errors, "offset must be a non-negative number")
	}

	if limit, err := strconv.Atoi(params.Get("limit")); err != nil || limit < 1 || limit > 1000 {
		errors = append(errors, "limit must be between 1 and 1000")
	}

	if len(errors) > 0 {
		return fmt.Errorf("validation failed: %v", strings.Join(errors, ", "))
	}
	return nil
}

func getBooksHandler(w http.ResponseWriter, r *http.Request) {
	// Use the global db object to access the collection
	collection := db.Collection("books")

	queryParams := r.URL.Query()
	err := validateRequest(queryParams)
	if err != nil {
		http.Error(w, fmt.Sprintf("Validation failed: %v", err), http.StatusBadRequest)
		return
	}

	offset, _ := strconv.ParseInt(queryParams.Get("offset"), 10, 64)
	limit, _ := strconv.ParseInt(queryParams.Get("limit"), 10, 64)
	search := queryParams.Get("search")
	authors := queryParams.Get("authors")

	// Define a filter (optional)
	filter := bson.D{}

	if search != "" {
		filter = append(filter, bson.E{
			Key: "$text",
			Value: bson.D{
				{Key: "$search", Value: search},
			},
		})
	}

	if publishedAfter := queryParams.Get("published-after"); publishedAfter != "" {
		if publishedAfter, err := strconv.Atoi(publishedAfter); err == nil {
			filter = append(filter, bson.E{
				Key:   "publication_year",
				Value: bson.D{{Key: "$gte", Value: publishedAfter}},
			})
		}
	}

	if publishedBefore := queryParams.Get("published-before"); publishedBefore != "" {
		if publishedBefore, err := strconv.Atoi(publishedBefore); err == nil {
			filter = append(filter, bson.E{
				Key:   "publication_year",
				Value: bson.D{{Key: "$lte", Value: publishedBefore}},
			})
		}
	}

	if authors != "" {
		authorsList := strings.Split(authors, ",")

		filter = append(filter, bson.E{
			Key:   "authors",
			Value: bson.D{{Key: "$in", Value: authorsList}},
		})
	}

	// Define options (limit, skip, and sorting)
	options := options.Find().SetLimit(limit).SetSkip(offset)
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
		"offset":     offset,
		"limit":      limit,
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
