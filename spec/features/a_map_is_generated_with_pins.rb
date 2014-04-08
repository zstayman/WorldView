require 'spec_helper'
require 'capybara/rspec'

describe "map loads" do

  it "loads the map on page load" do
    visit("/")
    expect(page).to have_css("#map")
  end

  # it "shows markers" do
  #   visit("/")
  #   page.document.synchronize(50000) do
  #     expect("#map").to have_css(".leaflet-container")
  #   end
  #   find(".leaflet-clickable").click
  #   expect(page).to have_css(".leaflet-popup")
  # end
end
