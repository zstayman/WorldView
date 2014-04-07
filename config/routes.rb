WorldView::Application.routes.draw do
root "maps#index"
get "/articles", to: "articles#index"
end
