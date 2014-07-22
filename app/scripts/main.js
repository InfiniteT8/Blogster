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