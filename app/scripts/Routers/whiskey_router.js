// This is my router. It will react to the URL I visit and run a function based on that
// Right now I only have 2, but I could easily add a lot more.
// Also, both trigger a new view instance currently
var WhiskeyRouter = Backbone.Router.extend({

   // Defining my Routes
  routes: {
    '' : 'home',
    'edit/:id' : 'edit'
  },

  // What happens when I hit the url '/'
  // Loads my main list view
  home: function () {
    new WhiskeyListView({ collection: whiskey_list });
  },

  // My edit screen
  // Loads a screen while editing the specific whiskey from the id passed in the url (:id)
  edit: function (id) {
    new WhiskeyEditView({ postid: id, collection: whiskey_list });
  }

});