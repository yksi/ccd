package main

import (
	"os"
	"encoding/json"
	"errors"
	"math/rand"
	"time"
	"strconv"
	"crypto/sha1"
	"fmt"
)

type Validator struct {
	Environment string
	Keys        []string
}

func (v *Validator) login (key string) (string, error) {
	for _, existingKey := range v.Keys {
		if existingKey == key {
			num := []byte(strconv.Itoa(rand.New(rand.NewSource(time.Now().UnixNano())).Int()))
			hash := sha1.Sum(num)

			return fmt.Sprintf("%x", hash), nil
		}
	}

	return "", errors.New("login is invalid")
}

func (v *Validator) verify (token string) error {
	filename := fmt.Sprintf("./resource/%s", token)

	if _, err := os.Stat(filename); err == nil {
		return nil
	}

	return errors.New("token invalid")
}

func makeValidator (environment string) (*Validator, error) {
	keys := make([]string, 0)
	file, _ := os.Open("config/keys.json")
	defer file.Close()
	decoder := json.NewDecoder(file)
	err := decoder.Decode(&keys)

	if nil != err {
		return nil, err
	}

	return &Validator{
		Environment: environment,
		Keys:        keys,
	}, nil
}