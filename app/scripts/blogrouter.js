//this router allows me to visit the submitted links of the blog
var BlogRouter = Backbone.Router.extend({

   // Defining my Routes
  routes: {
    '' : 'home',
    'edit/:id' : 'edit'
  },

  // What happens when I hit the url '/'
  // Loads my main list view
  home: function () {
    new SubmittedListView({ collection: submitted_list });
  },

  // My edit screen
  // Loads a screen while editing the specific whiskey from the id passed in the url (:id)
  edit: function (id) {
    new PostEditView({ postid: id, collection: submitted_list });
  }

});