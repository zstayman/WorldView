describe("ArticleCollection", function(){
  it("contains all the information about an article", function(){
    var articles = new ArticleCollection;
    articles.fetch();
    expect(articles.model).toBe("Article")
  });
});
