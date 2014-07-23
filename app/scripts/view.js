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