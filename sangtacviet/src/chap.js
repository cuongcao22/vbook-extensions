function execute(url) {
    let browser = Engine.newBrowser();
    browser.launchAsync(url);
    
    var retry = 0;
    var content = "";
    
    while (retry < 10) {
        sleep(1000);
        let doc = browser.html();
        
        // Kiểm tra xem có nút "Nhấp vào để tải chương..." hay không
        let loadButton = doc.select("*:contains('Nhấp vào để tải chương')");
        if (loadButton.length > 0) {
            // Click vào nút để tải nội dung
            browser.callJs("document.querySelector('*:contains(\"Nhấp vào để tải chương\")').click();", 500);
            sleep(2000);
            doc = browser.html();
        }
        
        // Thử các selector khác nhau để lấy nội dung chương
        let contentElement = doc.select("#content-container .contentbox");
        if (contentElement.length === 0) {
            contentElement = doc.select(".chapter-content");
        }
        if (contentElement.length === 0) {
            contentElement = doc.select(".content");
        }
        if (contentElement.length === 0) {
            contentElement = doc.select("div[class*='content']");
        }
        
        if (contentElement.length > 0) {
            // Loại bỏ các element không mong muốn
            contentElement.select("script").remove();
            contentElement.select("style").remove();
            contentElement.select("i[hd]").remove();
            contentElement.select(".ads").remove();
            
            content = contentElement.html();
            
            // Kiểm tra xem content có đầy đủ hay không
            if (content && content.length > 100 && 
                content.indexOf("Đang tải nội dung chương") === -1 &&
                content.indexOf("Nhấp vào để tải chương") === -1) {
                break;
            }
        }
        
        // Thử scroll xuống để trigger lazy loading
        browser.callJs("window.scrollTo(0, document.body.scrollHeight);", 100);
        
        retry++;
    }
    
    browser.close();
    
    if (content) {
        return Response.success({
            content: content
        });
    }
    
    return null;
}