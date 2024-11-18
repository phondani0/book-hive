package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func getHello(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("got /hello request\n")
	io.WriteString(w, "Hello, Abhishek!\n")
}

func main() {

	http.HandleFunc("/hello", getBooks)

	http.ListenAndServe(":8080", nil)
}

// create an http server that listens on port 4500 and has a handler which will return books data with full details
func getBooks(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("got /books request\n")
	books := []struct {
		ID          string  `json:"id"`
		Title       string  `json:"title"`
		Author      string  `json:"author"`
		Price       float64 `json:"price"`
		ISBN        string  `json:"isbn"`
		PublishYear int     `json:"publishYear"`
	}{
		{
			ID:          "1",
			Title:       "The Great Gatsby",
			Author:      "F. Scott Fitzgerald",
			Price:       9.99,
			ISBN:        "978-0743273565",
			PublishYear: 1925,
		},
		{
			ID:          "2",
			Title:       "To Kill a Mockingbird",
			Author:      "Harper Lee",
			Price:       12.99,
			ISBN:        "978-0446310789",
			PublishYear: 1960,
		},
		{
			ID:          "3",
			Title:       "1984",
			Author:      "George Orwell",
			Price:       10.99,
			ISBN:        "978-0451524935",
			PublishYear: 1949,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(books)
}
