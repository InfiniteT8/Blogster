// This is my edit view
// This allows me to edit a Whiskey and delete it
var WhiskeyEditView = Backbone.View.extend({

  el: '.whiskey_edit', // The element I'll use

  events: {
    'submit #updateForm' : 'updateWhiskey',
    'click .delete' : 'deleteWhiskey'
  },

  // My initialize function
  // Notice it takes attributes that I've passed in (from my router)
  // I then am setting my "this.whiskey" to equal the postid I passed in
  // ... and more specifically to the whiskey object model I want to work with
  // ... it is now reusable throuout this view.
  initialize: function (attrs) {
    this.whiskey = this.collection.get(attrs.postid);
    this.render();
  },

  render: function () {
    var template = Handlebars.compile($('#whiskey_single').html());
    var rendered = template(this.whiskey.toJSON()); // here is `this.whiskey` again :)
    this.$el.prev().html('');
    this.$el.html(rendered);
  },

  // This edits a specific whiskey object
  // You are doing great, here is a shark being tickled - http://goo.gl/YihJrK
  updateWhiskey: function (event) {
    event.preventDefault();
    event.stopPropagation();
    this.whiskey.set({ // and again :)
      name: $('.edit_whiskey_name').val(),
      description: $('.edit_whiskey_desc').val()
    });
    this.whiskey.save();
    window.whiskey_router.navigate("", { trigger: true });
  },

  deleteWhiskey: function (event) {
    event.preventDefault();
    event.stopPropagation();
    // Standard JS confirm dialogue
    if (window.confirm("Are you sure?")) {
      this.whiskey.destroy({success: function () { // and one more time :) - btw this destroys my this.whiskey object
        window.whiskey_router.navigate("", { trigger: true }); // E.T. Phone Home (route me home)
      }});
    }
  }

});