var Blog = Backbone.Model.extend({

  idAttribute: '_id',

  defaults: {
    name: '',
    description: '',
    author: '',
    read: false
  }

});

var BlogCollection = Backbone.Collection.extend ({
  model: Blog,
  url: 'http://tiy-atl-fe-server.herokuapp.com/collections/TerryBlackJS'
});
var SubmittedListView = Backbone.View.extend ({

  el: '.submitted_list', //sends data into defined html element.

  events: {
    'click li a' : 'toggleRead',
    'click li span' : 'removepost'
  },

  initialize: function () {
    this.render();
    this.collection.on('change', this.render, this);
  },

  render: function () {
    var template = Handlebars.compile($('#blog_template').html());
    var rendered = template({ posts: this.collection.toJSON() });
    this.$el.html(rendered);
  },
//enables the user to marked blog read or leave it default.
  toggleRead: function (event) {
    event.preventDefault();

    var item_clicked = $(event.target);
    var post_id = item_clicked.attr('id');
    var post = this.collection.get(post_id);

    if (item_clicked.parent().hasClass('read')) {
      post.set({ read: false }).save();
    } else {
      post.set({ read: true }).save();
    }
  },

  removePost: function () {}


});
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
// // this compiles my blog template, handlebars style.
// var template = Handlebars.compile($('#blog_template').html());
 
// // Pass the `data` to my compiled template to render it
// var rendered = template(data);
 
// // Choose a spot on my page and dump my rendered template HTML into it.
// $('#submitted_list').html(rendered);



// // Create an instance of my Collection
// var submitted_list = new BlogCollection();
// // Grab all my data from my server
// // After it's complete, create a new view with data
// submitted_list.fetch().done( function (){
//   // new SubmittedListView({ collection: submitted_list });
//   // Define Global Router && Start History
//   window.blog_router = new BlogRouter();
//   Backbone.history.start();
// });


// Create an instance of my Collection
var submitted_list = new BlogCollection();

//creates a new view with data gathered from the server.
submitted_list.fetch().done( function (){
  // Define Global Router && Start History
  window.blog_router = new BlogRouter();
  Backbone.history.start();
});


// Submit Form
// Create a new blog post and add it to my collection
$('#newpost').on('submit', function (event) {

  event.preventDefault();

  // Creates an instance (entry in my DB) of a whiskey model
  var temp_post = new Blog({
    name: $('.blog_title').val(),
    author: $('.author_name').val(),
    description: $('.postform').val()
  });

  //adds new blog post to my collection
  submitted_list.add(temp_post).save();

  // Clears form of previously entered data
  $(this).trigger('reset');

});