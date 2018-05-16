package main

import (
	"encoding/json"
	"html/template"
	"log"
	"net/http"
	"os"
	"fmt"
	"os/exec"
	"bytes"
	"strings"
)

// Page structure
type Page struct {
	Environment string
	Allowed     bool
}

// Response structure
type Response struct {
	Message string `json:"message"`
	Ok      bool   `json:"ok"`
	Token   string `json:"token"`
}

var validator *Validator

func main() {
	validator, _ = makeValidator("Staging")
	handleHttp()
}

func handleHttp () {
	http.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("assets"))))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		t, _ := template.ParseFiles("assets/index.html", "assets/template/notification.html", "assets/template/deploy.html")
		t.Execute(w, nil)
	})

	http.HandleFunc("/login", func(w http.ResponseWriter, req *http.Request) {
		var hash string
		var err error

		var data LoginData

		response := &Response{
			Ok:      false,
			Message: "Login is invalid",
			Token:   hash,
		}

		if data, err = parseLogin(req); err != nil {
			response.Message = "Invalid login request"
		} else if hash, err = validator.login(data.Key); err == nil {
			response.Ok, response.Message = true, "Login Success"
			response.Token = hash
			os.OpenFile(fmt.Sprintf("./resource/%s", hash), os.O_RDONLY|os.O_CREATE, 0666)
		}

		w.Header().Add("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)

	})

	http.HandleFunc("/deploy-app", func(w http.ResponseWriter, req *http.Request) {
		response := &Response{
			Ok: false,
			Message: "Token invalid",
		}

		data, err := parseDeploy(req)

		if err = validator.verify(data.Token); err == nil {

			cmd := exec.Command("bash", "-c", data.Command)
			cmd.Stdin = strings.NewReader("some input")
			var output, errorMessage bytes.Buffer
			cmd.Stdout = &output
			cmd.Stderr = &errorMessage

			err := cmd.Run()
			fmt.Println(cmd)

			if nil != err {
				response.Ok = false
				response.Message = fmt.Sprintf("err: \"%s\"", err.Error())
			} else {
				response.Ok = true
				response.Message = output.String()
			}
		}

		w.Header().Add("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	})

	http.HandleFunc("/logout", func(w http.ResponseWriter, req *http.Request) {
		var err error

		response := &Response{
			Ok: true,
			Message: "No need",
		}

		data, err := parseLogout(req)

		if err = validator.verify(data.Token); err == nil {
			os.Remove(fmt.Sprintf("./resource/%s", data.Token))
			response.Message = "Logged out"
		}

		w.Header().Add("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	})

	log.Fatal(http.ListenAndServe(":80", nil))
}
