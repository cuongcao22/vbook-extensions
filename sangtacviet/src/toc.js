function execute(url) {
    if (url.slice(-1) !== "/") {
        url = url + "/";
    }
    
    let browser = Engine.newBrowser();
    browser.launchAsync(url);
    
    var retry = 0;
    while (retry < 5) {
        sleep(1000);
        let doc = browser.html();
        
        // Tìm danh sách chương trong phần "Table of Contents"
        let chapterElements = doc.select("div:contains('Table of Contents') ~ div a");
        
        // Nếu không tìm thấy, thử selector khác
        if (chapterElements.length === 0) {
            chapterElements = doc.select("div[class*='chapter'] a");
        }
        
        // Hoặc thử tìm các link chương theo pattern
        if (chapterElements.length === 0) {
            chapterElements = doc.select("a[href*='/truyen/']").filter(e => {
                let href = e.attr("href");
                // Chỉ lấy các link có cấu trúc: /truyen/{source}/{num}/{novel_id}/{chapter_id}/
                let parts = href.split("/");
                return parts.length >= 6 && parts[1] === "truyen" && parts[5];
            });
        }
        
        if (chapterElements.length > 0) {
            let list = [];
            for (let i = 0; i < chapterElements.length; i++) {
                let e = chapterElements.get(i);
                let chapterName = e.text();
                let chapterUrl = e.attr("href");
                
                if (chapterName && chapterUrl) {
                    // Đảm bảo URL là đầy đủ
                    if (!chapterUrl.startsWith("http")) {
                        chapterUrl = "https://sangtacviet.app" + chapterUrl;
                    }
                    
                    list.push({
                        name: chapterName,
                        url: chapterUrl
                    });
                }
            }
            
            browser.close();
            return Response.success(list);
        }
        
        retry++;
    }
    
    browser.close();
    return null;
}