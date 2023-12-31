package main

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
	"sync"

	"github.com/dgraph-io/badger/v3"
	"github.com/gin-gonic/gin"
	clover "github.com/ostafen/clover/v2"
	d "github.com/ostafen/clover/v2/document"
	"github.com/ostafen/clover/v2/query"
	badgerstore "github.com/ostafen/clover/v2/store/badger"
)

var mutex sync.Mutex

type IPage struct {
	Type     string   `json:"type"`
	Site     string   `json:"site"`
	Lang     string   `json:"lang"`
	Link     string   `json:"link"`
	Tags     []string `json:"tags"`
	Title    string   `json:"title"`
	Notes    []string `json:"notes"`
	Length   int64    `json:"length"`
	Byline   string   `json:"byline"`
	Excerpt  string   `json:"excerpt"`
	Content  string   `json:"content"`
	CreateAt int64    `json:"createAt"`
	LastView int64    `json:"lastView"`
	Index    int64    `json:"index"`
}

type IAppState struct {
	IsNavBarOpen bool    `json:"isNavBarOpen"`
	CurrentLink  string  `json:"currentLink"`
	CurrentPage  IPage   `json:"currentPage"`
	Pages        []IPage `json:"pages"`
}

var db *clover.DB

func getURL(c *gin.Context) {
	encodedUrl := c.Param("link")
	decodedUrl, _ := url.QueryUnescape(encodedUrl)
	resp, _ := http.Get(decodedUrl)
	body, _ := io.ReadAll(resp.Body)
	c.Header("Access-Control-Allow-Origin", "*")
	c.String(200, string(body))
}

func pageDeal(doc *d.Document) IPage {
	var page IPage
	page.Type = doc.Get("type").(string)
	page.Site = doc.Get("site").(string)
	page.Lang = doc.Get("lang").(string)
	page.Link = doc.Get("link").(string)
	tag_slice, _ := doc.Get("tags").([]interface{})
	page.Tags = make([]string, len(tag_slice))
	for i, v := range tag_slice {
		page.Tags[i] = v.(string)
	}
	page.Title = doc.Get("title").(string)
	notes_slice, _ := doc.Get("notes").([]interface{})
	page.Notes = make([]string, len(notes_slice))
	for i, v := range notes_slice {
		page.Notes[i] = v.(string)
	}
	//page.Length = doc.Get("length").(int64)
	lengthValue := doc.Get("length")
	var lengthInt64 int64
	switch lengthValue := lengthValue.(type) {
	case float64:
		lengthInt64 = int64(lengthValue)
	case int64:
		lengthInt64 = lengthValue
	}
	page.Length = lengthInt64
	page.Byline = doc.Get("byline").(string)
	page.Excerpt = doc.Get("excerpt").(string)
	page.Content = doc.Get("content").(string)

	createAtValue := doc.Get("createAt")
	var createAtValueInt64 int64
	switch createAtValue := createAtValue.(type) {
	case float64:
		createAtValueInt64 = int64(createAtValue)
	case int64:
		createAtValueInt64 = createAtValue
	}
	page.CreateAt = createAtValueInt64

	lastViewValue := doc.Get("lastView")
	var lastViewValueInt64 int64
	switch lastViewValue := lastViewValue.(type) {
	case float64:
		lastViewValueInt64 = int64(lastViewValue)
	case int64:
		lastViewValueInt64 = lastViewValue
	}
	page.LastView = lastViewValueInt64
	//page.LastView = doc.Get("lastView").(int64)

	indexValue := doc.Get("index")
	var indexValueInt64 int64
	switch indexValue := indexValue.(type) {
	case float64:
		indexValueInt64 = int64(indexValue)
	case int64:
		indexValueInt64 = indexValue
	}
	page.Index = indexValueInt64
	return page
}

func getPage(c *gin.Context) { //get page from db
	mutex.Lock()
	db.ImportCollection("todos", "todos.json")
	encodedURL := c.Param("link")
	decodedURL, _ := url.QueryUnescape(encodedURL)
	fmt.Println(decodedURL)
	var page IPage
	query := query.NewQuery("todos").Where(query.Field("link").Eq(decodedURL))
	doc, err := db.FindFirst(query)
	if err != nil {
		fmt.Println(err)
		return
	}
	page = pageDeal(doc)
	c.Header("Access-Control-Allow-Origin", "*")
	db.ExportCollection("todos", "todos.json")
	c.JSON(200, page)
	defer mutex.Unlock()
}

func getPages(c *gin.Context) { //get all pages from db
	mutex.Lock()
	pages := []IPage{}
	db.ImportCollection("todos", "todos.json")
	query := query.NewQuery("todos")
	docs, err := db.FindAll(query)
	if err != nil {
		fmt.Println(err)
		return
	}
	for _, doc := range docs {
		page := pageDeal(doc)
		pages = append(pages, page)
	}
	c.Header("Access-Control-Allow-Origin", "*")
	db.ExportCollection("todos", "todos.json")
	c.JSON(200, pages)
	defer mutex.Unlock()

}

func postURL(c *gin.Context) { //add something to db
	mutex.Lock()
	var newIPage IPage
	//fmt.Println("Inside postURL")

	if err := c.ShouldBindJSON(&newIPage); err != nil {
		fmt.Println(err)
		fmt.Println("Bind error")
		return
	}
	db.ImportCollection("todos", "todos.json")
	todo := make(map[string]interface{})
	todo["type"] = newIPage.Type
	todo["site"] = newIPage.Site
	todo["lang"] = newIPage.Lang
	todo["link"] = newIPage.Link
	todo["tags"] = newIPage.Tags
	todo["title"] = newIPage.Title
	todo["notes"] = newIPage.Notes
	todo["length"] = newIPage.Length
	todo["byline"] = newIPage.Byline
	todo["excerpt"] = newIPage.Excerpt
	todo["content"] = newIPage.Content
	todo["createAt"] = newIPage.CreateAt
	todo["lastView"] = newIPage.LastView
	todo["index"] = newIPage.Index

	doc := d.NewDocumentOf(todo)
	db.Delete(query.NewQuery("todos").Where(query.Field("link").Eq(newIPage.Link)))
	mapDocId, _ := db.InsertOne("todos", doc)
	fmt.Println(mapDocId)
	fmt.Print(newIPage.LastView)
	db.ExportCollection("todos", "todos.json")

	c.Header("Access-Control-Allow-Origin", "*")
	c.String(200, "add success")
	defer mutex.Unlock()
}

func deletePages(c *gin.Context) { //delete one pages from db
	mutex.Lock()
	encodedURL := c.Param("link")
	decodedURL, _ := url.QueryUnescape(encodedURL)
	db.ImportCollection("todos", "todos.json")
	fmt.Println(decodedURL)
	db.Delete(query.NewQuery("todos").Where(query.Field("link").Eq(decodedURL)))
	db.ExportCollection("todos", "todos.json")
	c.Header("Access-Control-Allow-Origin", "*")
	c.String(200, "delete success")
	defer mutex.Unlock()
}

func main() {

	my_badger := badger.DefaultOptions("").WithInMemory(true)
	store, _ := badgerstore.Open(my_badger) // opens a badger in memory database
	db, _ = clover.OpenWithStore(store)
	fmt.Println("db opened")
	defer db.Close()
	db.ImportCollection("todos", "todos.json")
	var drop_enabled = false

	if drop_enabled {
		db.DropCollection("todos")
	}

	collectionExists, err_collection := db.HasCollection("todos")
	if err_collection != nil {
		fmt.Println(err_collection)
		return
	}
	fmt.Println(collectionExists)
	if !collectionExists {
		err_db := db.CreateCollection("todos")
		if err_db != nil {
			fmt.Println(err_db)
			return
		}
		fmt.Println("Collection created in main")
	}
	r := gin.Default()
	r.RedirectFixedPath = true
	r.UseRawPath = true

	r.GET("/get/links/:link", getURL)
	r.GET("/get/pages/:link", getPage)
	r.GET("/get/pages", getPages)
	r.GET("/delete/pages/:link", deletePages)
	r.POST("/update", postURL)
	err := r.Run(":5000")
	if err != nil {
		db.ExportCollection("todos", "todos.json")
		return
	}
	defer db.ExportCollection("todos", "todos.json")
}
