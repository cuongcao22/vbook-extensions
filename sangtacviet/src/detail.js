function execute(url) {
    let response = fetch(url);
    
    function toCapitalize(sentence) {
        if (!sentence) return "";
        const words = sentence.split(" ");
        return words.map((word) => {
            return word[0].toUpperCase() + word.substring(1);
        }).join(" ");
    }

    if (response.ok) {
        let doc = response.html();
        
        // Lấy tên truyện
        let name = doc.select("h1").first()?.text() || "";
        
        // Lấy tác giả
        let author = doc.select("h2").first()?.text() || "Unknown";
        
        // Lấy ảnh bìa
        let cover = doc.select("img").first()?.attr("src") || "";
        if (cover && cover.startsWith('//')) {
            cover = 'https:' + cover;
        }
        
        // Lấy mô tả
        let description = doc.select("div:contains('Summary') + div").first()?.html() || 
                         doc.select(".summary").first()?.html() || "";
        
        // Lấy thông tin chi tiết
        let detail = "";
        let infoSection = doc.select("div:contains('Info')").parent();
        if (infoSection.length > 0) {
            detail = infoSection.text();
        }
        
        // Kiểm tra trạng thái (ongoing/completed)
        let ongoing = true;
        if (detail.indexOf("Completed") > -1 || detail.indexOf("Hoàn thành") > -1) {
            ongoing = false;
        }
        
        return Response.success({
            name: toCapitalize(name),
            cover: cover,
            author: author,
            description: description,
            detail: detail,
            ongoing: ongoing,
            host: "https://sangtacviet.app"
        });
    }
    
    return null;
}