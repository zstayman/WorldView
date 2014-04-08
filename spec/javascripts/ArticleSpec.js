describe("ArticleView#pinStyle", function(){
  it("defines the style of a pin for a specific section", function(){
    var articles = new ArticleCollection();
    var view = new ArticleView({collection: articles});
    expect(view.pinStyle("Business Day")).toBe("mobilephone")
  });
});
