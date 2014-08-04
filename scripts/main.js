//this router allows me to visit the submitted links of the blog
var BlogRouter = Backbone.Router.extend({

   // Defining my Routes
  routes: {
    '' : 'home',
    'edit/:id' : 'edit',
    'user' : 'signInUp'
  },

initialize: function () {
    this.appView = new App.View();
  },

  // What happens when I hit the url '/'
  // Loads my main list view
  home: function () {
    if(!App.currentUser) return App.router.navigate('user', {trigger: true});
    showUser(App.currentUser);
    var listView = new SubmittedListView();
    this.appView.showView(listView);
  },

  // My edit screen
  // Loads a screen while editing the specific whiskey from the id passed in the url (:id)
  edit: function (id) {
    if(!App.currentUser) return App.router.navigate('user', {trigger: true});
    showUser(App.currentUser);
    var editView = new SubmittedEditView({ postid: id });
    this.appView.showView(editView);
  },

  // Signin or Signup Page
  // This route is loaded when a user is not logged in
  register: function () {
    if(App.currentUser) return App.router.navigate('', {trigger: true});
    var RegisterMe = new UserView();
    this.appView.showView(RegisterMe);
  }

});

//Edit view for my blog post.
var SubmittedEditView = Backbone.View.extend({

  el: '.submitted_edit', // The element or class that I will use to set up an edit area.

  events: {
    'submit #updateForm' : 'updatePost',
    'click .delete' : 'deletePost'
  },

  //initializing my attributes from the router so that I'm able to work with a select object.

  initialize: function (attrs) {
    this.post = App.submitted_list.get(attrs.postid);
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
    var editField = this.collection.get($('.post_id').val());
    editField.set({
      name: $('.edit_post_name').val(),
      description: $('.edit_post_desc').val()
    });
    
    this.post.save();
    App.router.navigate("", { trigger: true });
    
    editField.save();
    App.router.navigate("", { trigger: true });
    $('.maincontain').show();
    $('#updateForm').hide();
  },

  deletePost: function (event) {
    event.preventDefault();
    event.stopPropagation();
    //confrimation of deleted post. 
    if (window.confirm("Delete or Nah?")) {
      var editField = this.collection.get($('.post_id').val());
      editField.destroy({success: function () { 
      //this destorys my this.blog object and routes me home.
        App.router.navigate("", { trigger: true }); 
        $('.maincontain').show();// E.T. Phone Home (route me home)
      }});
    }
  }

});
var Blog = Parse.Object.extend({

	className: 'BlogPost',


  validate: function (attrs) {
    if (!attrs.name) {
      return 'Enter A Title for your post!';
    }
    if(!attrs.description){
      return 'Please enter a blog description!';
    }
  },
  
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
  model: Blog
//   url: 'http://tiy-atl-fe-server.herokuapp.com/collections/TerryBlackJS'
// });


var RegView = Backbone.View.extend ({

    // el: '.maincontain', //defines element where data will be dumped

    events: {
        'submit #regUser' : 'userSignup',
        'submit #logmein' : 'userLogin'
    },
//initializes the signupform for user registration.
    initialize: function (){ 
        this.render();
        // $('.signupform').show();
    },

    render: function () {
        var template = Handlebars.compile($('#myblog_user').text());
        var rendered = template();
        $('.activeuserActions').hide();
        $('signupform').show();
        this.$el.html(rendered);
    },


    RegisterUser: function(event){

        event.preventDefault();
        var user,
                form = $(event.target),
                user_name = form.find('input[name="email"]').val(),
                user_password = form.find('input[name="password"]').val(),
                user_password2 = form.find('input[name="password2"]').val();

        // Check for Password Match
        if (user_password !== user_password2) return alert('Passwords do not match!');

        // Passwords Match, so Let's attempt to create a user
        user = new Parse.User({
            username: user_name,
            password: user_password
        });

        user.signUp(null, {
          success: function(user) {
            alert('Welcome Home' + user.get('username') + '!');
                App.currentUser = Parse.User.current();
                App.router.navigate('', {trigger: true});
                $('.activeuserActions').show();
          },
          error: function(user, error) {
            alert("Error: " + error.message);
                form.trigger('reset');
          }
        });

    },

    userLogin: function (event) {
        event.preventDefault();
        var form = $(event.target),
                user_name = form.find('input[name="email"]').val(),
                user_password = form.find('input[name="password"]').val();

        Parse.User.logIn(user_name, user_password, {
          success: function(user) {
            alert('Welcome Back ' + user.get('username') + '!');
                App.currentUser = Parse.User.current();
                App.router.navigate('', {trigger: true});
                $('.activeuserActions').show();
          },
          error: function(user, error) {
            alert("Error: " + error.message);
                form.trigger('reset');
          }
        });
    }

});
var SubmittedListView = Backbone.View.extend ({

  el: '.submitted_list', //sends data into defined html element.

  events: {
    'click .toggleRead' : 'toggleRead',
    'click .clickedit' : 'editPost'
  },

  // initialize: function () {
  //   this.render();
  //   this.collection.on('change', this.render, this);
  // },
  initialize: function () {
    var self = this;
    App.submitted_list = new BlogCollection();
    App.submitted_list.query = new Parse.Query(Submitted);
    App.submitted_list.comparator = function(object) {
      return object.get("read");
    };
    App.submitted_list.query.equalTo('user', App.currentUser);
    App.submitted_list.on('change', this.render, this); // This watches my collection for when I update a submitted
    App.submitted_list.on('add', this.render, this); // This watches my collection for when I add a submitted
    App.submitted_list.fetch().done( function () {
      self.render();
    });
  },
  
render: function () {
    App.submitted_list.sort(); 
    var template = Handlebars.compile($('#blog_template').html());
    var rendered = template({ posts: App.submitted_list.toJSON() });
    this.$el.html(rendered); // Throws my rendered data into my `el` using jQuery
  },

  //enables the user to marked blog read or leave it default.
  toggleRead: function (event) {
    event.preventDefault();
    event.stopPropagation();
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

  editPost: function (event) {
    event.preventDefault();
    event.stopPropagation();

    var post_id=$(event.currentTarget).attr('id');
    // window.blog_router.navigate('#edit/' + post_id, {trigger: true});
    App.router.navigate('#edit/'+post_id, {trigger: true});
    // $('.maincontain').hide();
    //    $('#updateForm').show();
  },

});



Parse.initialize("GOjCCxKmvJmesh3NYbJbYWNuJmIKqhEl3PraAbGq", "wLEHDYQxMcK4UoaY1xWFEmyt4PSs42X5MgYSQ71p");


// Initialize App & Checking Users
var App = {};
App.currentUser = Parse.User.current();

// Managing App Views
App.View = function (){
  this.showView = function(view) {
    if (this.currentView){
      this.currentView.remove();
    }
    this.currentView = view;
    this.currentView.render();
    $(".blog_cont").html(this.currentView.el);
  }
}

// Simple Script to update the userfield
var showUser = function (user) {
  var name = user.get('username');
  $('.userfield').text(name);
};

// Fireup the App
App.router = new BlogRouter();
Backbone.history.start();

// Submit Form
// Create a new Whiskey and add it to my collection
$('#newpost').on('submit', function (event) {
  
  event.preventDefault();

  // Creates an instance (entry in my DB) of a whiskey model
  var temp_post = new Blog();

  // Set Properties
  var validate = temp_post.set({
    name: $('.blog_title').val(),
    author: $('.author_name').val(),
    description: $('.postform').val(),
    tags: $('#tagsinput').val(),
    user: App.currentUser
  }, {validate:true});

  // Save your Parse Object
  if(validate !== false) {
    temp_post.setACL(new Parse.ACL(Parse.User.current()));
    temp_post.save(null, {
      success: function(temp_post) {
        // Adds to my collection
        App.submitted_list.add(temp_post);
        // Resets my form - skadoosh
        $(this).trigger('reset');
      }
    });
  } else {
    alert('You must fill out both fields!');
  }

});

// Logout
$('.logout button').on('click', function () {
  Parse.User.logOut();
  App.currentUser = Parse.User.current();
  App.router.navigate('user', {trigger: true});
});
