package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"syscall/js"
	"time"

	"golang.org/x/net/html"
)

type Page struct {
	Title             string `json:"title"`
	EstimatedReadTime int    `json:"estimatedReadTime"`
	CreateAt          string `json:"createAt"`
	HTMLContent       string `json:"htmlContent"`
}

func GetURLContent(this js.Value, args []js.Value) (any, error) {
	var url string = args[0].String()

	client := &http.Client{}

	fmt.Println("URL1:", url)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	fmt.Println("URL2:", url)

	resp, err := client.Do(req)

	resp.Header.Set("Access-Control-Allow-Origin", "*")
	fmt.Println("URL3:", url)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	fmt.Println("URL4:", url)

	var m map[string]interface{}
	doc, err := html.Parse(resp.Body)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	defer resp.Body.Close()

	var page Page

	var nTitle *html.Node
	var sTxt string
	var bufInnerHtml bytes.Buffer

	w := io.Writer(&bufInnerHtml)

	var f func(*html.Node)
	f = func(n *html.Node) {
		if n.Type == html.ElementNode && n.Data == "title" {
			nTitle = n
		}

		if nTitle != nil {
			if n != nTitle { // don't write the a tag and its attributes
				html.Render(w, n)
			}
			if n.Type == html.TextNode {
				sTxt += n.Data
			}
		}

		for c := n.FirstChild; c != nil; c = c.NextSibling {
			f(c)
		}

		if n == nTitle {
			fmt.Println("Text:", sTxt)
			fmt.Println("InnerHTML:", bufInnerHtml.String())
			if len(page.Title) == 0 {
				page.Title = sTxt
			}
			sTxt = ""
			bufInnerHtml.Reset()
			nTitle = nil
		}
	}

	f(doc)

	filteredMap := make(map[string]interface{})
	var totalWords int = 0
	for key, value := range m {
		str := value.(string)
		/*if len(str) >= 50 {
			filteredMap[key] = str
		}*/
		filteredMap[key] = str
		totalWords += len(str)
	}

	jsonData, _ := json.Marshal(filteredMap)

	page.HTMLContent = string(jsonData)
	currentTime := time.Now()
	timeString := currentTime.Format("2006-01-02 15:04:05")
	page.CreateAt = timeString
	page.EstimatedReadTime = totalWords / 200

	// doc, err := goquery.NewDocumentFromReader(resp.Body)
	// var title string
	// if err != nil {
	// 	title = ""
	// } else {
	// 	title = doc.Find("title").Text()
	// }
	// page.Title = title

	result := make(map[string]interface{})
	result["title"] = page.Title
	result["estimatedReadTime"] = page.EstimatedReadTime
	result["createAt"] = page.CreateAt
	result["htmlContent"] = page.HTMLContent
	return result, nil
}

// func registerCallbacks() {
// 	// TODO: Register the function GetURLContent
// 	js.Global().Set("GetURLContent", js.FuncOf(GetURLContent))
// }

// func main() {
// 	fmt.Println("Golang main function executed")
// 	registerCallbacks()

// 	//need block the main thread forever
// 	select {}
// }

type fn func(this js.Value, args []js.Value) (any, error)

var (
	jsErr     js.Value = js.Global().Get("Error")
	jsPromise js.Value = js.Global().Get("Promise")
)

func asyncFunc(innerFunc fn) js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) any {
		handler := js.FuncOf(func(_ js.Value, promFn []js.Value) any {
			resolve, reject := promFn[0], promFn[1]

			go func() {
				defer func() {
					if r := recover(); r != nil {
						reject.Invoke(jsErr.New(fmt.Sprint("panic:", r)))
					}
				}()

				res, err := innerFunc(this, args)
				if err != nil {
					reject.Invoke(jsErr.New(err.Error()))
				} else {
					resolve.Invoke(res)
				}
			}()

			return nil
		})

		return jsPromise.New(handler)
	})
}

func main() {
	js.Global().Set("GetURLContent", asyncFunc(GetURLContent))
	select {}
}
