## Preparation
Ensure that `todos.json` is in the `src-go` folder before running main.go
```shell
$ cd src-go
$ go mod init src-go
$ go mod tidy
$ go run .
```

## Requests to server
To get html content under an url, use:
```go
http method = GET
localhost:1420/get/url
```
The return json body will be in form
```go
struct data {
    HtmlContent string
    CreateAt    int64
}
```
To get page according to link or all pages, use:
```go
http method = GET
localhost:1420/get/pages/:link
localhost:1420/get/pages
```
The return json body will be in form
```go
struct page {
    Type     string  
    Site     string  
    Lang     string  
    Link     string  
    Tags     []string
    Title    string  
    Notes    []string
    Length   int64   
    Byline   string  
    Excerpt  string  
    Content  string  
    CreateAt int64   
    LastView int64   
    Index    int64   
}
//or all pages
[]page
```
To delete a page according to link, use:
```go
http method = GET
localhost:1420/delete/pages/:link
```
The page holding the link will be discarded.

To update/add a page without link, use:
```go
http method = PUT/POST
localhost:1420/update
```
The page will be added/updated according to the json body with form the same as
```go
struct page{
    ...
}
```
## Debugging Features (To be added)
If you do not need the feature of loading previous record, change `drop_enabled` to `true` to drop pre-loaded former record.