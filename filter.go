package main

type Type string

const (
	Single Type = "single"
	List   Type = "list"
)

type Filter struct {
	Key      string        `json:"key"`
	Type     Type          `json:"type"`
	Value    []interface{} `json:"value"`
	Operator string        `json:"operator"`
}
