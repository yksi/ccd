FROM golang:1.10

WORKDIR /go/src/app
COPY . .

RUN go build
CMD ./ccd