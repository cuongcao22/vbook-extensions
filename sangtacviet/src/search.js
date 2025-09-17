function execute(key, page) {
    if (!page) page = '1';
    
    let response = fetch('https://sangtacviet.app/?find=&findinname=' + key + '&minc=0&tag=&p=' + page);
    
    function toCapitalize(sentence) {
        if (!sentence) return "";
        const words = sentence.split(" ");
        return words.map((word) => {
            return word[0].toUpperCase() + word.substring(1);
        }).join(" ");
    }

    if (response.ok) {
        let doc = response.html();
        let next = doc.select(".pagination").select("li.active + li").text();
        let el = doc.select("div[endless-scroll] > a");
        let data = [];
        
        el.forEach(e => {
            let title = e.select("h4").first()?.text() || e.select(".text-lg").first()?.text() || "";
            let author = e.select("p").first()?.text() || "";
            let link = e.attr("href");
            let cover = e.select("img").first()?.attr("src") || "";
            let source = e.select(".badge").first()?.text() || "";
            
            if (cover && cover.startsWith('//')) {
                cover = 'https:' + cover;
            }
            
            if (title && link) {
                data.push({
                    name: toCapitalize(title),
                    link: link,
                    cover: cover,
                    description: author,
                    host: "https://sangtacviet.app"
                });
            }
        });
        
        return Response.success(data, next);
    }
    
    return null;
}