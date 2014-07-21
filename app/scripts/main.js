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