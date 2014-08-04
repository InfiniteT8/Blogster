var Blog = Parse.Object.extend({

	className: "BlogPost",
  idAttribute: 'objectId',

  defaults: {
    name: '',
    description: '',
    author: '',
    tags:[],
    read: false
  }

});

var BlogCollection = Parse.Collection.extend ({
  model: Blog,
  // url: 'http://tiy-atl-fe-server.herokuapp.com/collections/TerryBlackJS'
});
var SubmittedListView = Backbone.View.extend ({

  el: '.submitted_list', //sends data into defined html element.

  events: {
    'click .toggleRead' : 'toggleRead',
    'click li span' : 'removepost'
  },

  initialize: function () {
    this.render();
    this.collection.on('change', this.render, this);
    this.collection.on('add',this.render, this);
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
    var read = post.get('read');

    if (read) {
      post.set({ read: false }).save();
    } else {
      post.set({ read: true }).save();
    }
  },

  removePost: function () {}


});
//Edit view for my blog post.
var SubmittedEditView = Backbone.View.extend({

  el: '.submitted_edit', // The element I'll use

  events: {
    'submit #updateForm' : 'updatePost',
    'click .delete' : 'deletePost'
  },

  //initializing my attributes from the router so that I'm able to work with a select object.

  initialize: function (attrs) {
    this.post = this.collection.get(attrs.postid);
    this.render();
  },

  render: function () {
    var template = Handlebars.compile($('#single_post').html());
    var rendered = template(this.blog.toJSON()); 
    this.$el.prev().html('');
    this.$el.html(rendered);
  },

  //editing specified post
  updatePost: function (event) {
    event.preventDefault();
    event.stopPropagation();
    this.post.set({ // and again :)
      name: $('.edit_post_name').val(),
      description: $('.edit_post_desc').val()
    });
    this.post.save();
    window.blogrouter.navigate("", { trigger: true });
  },

  deletePost: function (event) {
    event.preventDefault();
    event.stopPropagation();
    // Standard JS confirm dialogue
    if (window.confirm("Are you sure?")) {
      this.post.destroy({success: function () { // and one more time :) - btw this destroys my this.whiskey object
        window.blog_router.navigate("", { trigger: true }); // E.T. Phone Home (route me home)
      }});
    }
  }

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
  // Loads a screen while editing the specific blog post from the id passed in the url (:id)
  edit: function (id) {
    new PostEditView({ postid: id, collection: submitted_list });
  }

});
Parse.initialize("GOjCCxKmvJmesh3NYbJbYWNuJmIKqhEl3PraAbGq", "wLEHDYQxMcK4UoaY1xWFEmyt4PSs42X5MgYSQ71p");

// Create an instance of my Collection
var submitted_list = new BlogCollection();

//creates a new view with data gathered from the server and defines global router.
submitted_list.fetch().done( function (){
  window.blog_router = new BlogRouter();
  Backbone.history.start();
});


// Submit Form
// Create a new blog post and add it to my collection
$('#newpost').on('submit', function (event) {

  event.preventDefault();

  // Creates an instance from my blog model.
  //temp because of refresh method.
  var temp_post = new Blog({
    name: $('.blog_title').val(),
    author: $('.author_name').val(),
    description: $('.postform').val(),
    tags: $('#tagsinput').val(),
  });

  //adds new blog post to my collection
  submitted_list.add(temp_post);
  temp_post.save();

  // Clears form of previously entered data
  $(this).trigger('reset');
});