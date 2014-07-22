var SubmittedBlogView = Backbone.View.extend ({

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