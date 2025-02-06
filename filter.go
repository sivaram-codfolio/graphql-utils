package main

import "fmt"

type FilterType string

const (
	Single FilterType = "single"
	List   FilterType = "list"
)

type Operator string

const (
	OperatorEq       Operator = "eq"
	OperatorNe       Operator = "ne"
	OperatorBetween  Operator = "between"
	OperatorContains Operator = "contains"
)

type Filter struct {
	Key      string     `json:"key"`
	Type     FilterType `json:"type"`
	Value    []any      `json:"value"`
	Operator Operator   `json:"operator,omitempty"`
}

func main() {
	filters := []Filter{
		{
			Key:   "name",
			Type:  Single,
			Value: []any{"qwerty"},
		},
	}
	fmt.Println("filters :: ", filters)
}
