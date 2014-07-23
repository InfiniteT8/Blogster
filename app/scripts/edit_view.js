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