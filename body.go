package main

import (
	"net/http"
	"encoding/json"
)

type LoginData struct {
	Key string `json:"key"`
}

type LogoutData struct {
	Token string `json:"token"`
}

type DeployData struct {
	Token 	   string `json:"token"`
	Command    string `json:"command"`
}

func decoder (req *http.Request) (*json.Decoder) {
	return json.NewDecoder(req.Body)
}

func parseLogin (req *http.Request) (LoginData, error) {
	var data LoginData
	err := decoder(req).Decode(&data)
	return data, err
}

func parseLogout (req *http.Request) (LogoutData, error) {
	var data LogoutData
	err := decoder(req).Decode(&data)
	return data, err
}

func parseDeploy (req *http.Request) (DeployData, error) {
	var data DeployData
	err := decoder(req).Decode(&data)
	return data, err
}