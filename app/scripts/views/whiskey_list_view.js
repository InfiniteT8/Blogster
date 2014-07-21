//creates view for list of Blog Post
var WhiskeyListView = Backbone.View.extend ({

  el: '.blogpost_list',

  events: {
    'click li a' : 'toggleDrank',
    'click li span' : 'removeWhiskey'
  },

  initialize: function () {
    this.render();
    this.collection.on('change', this.render, this);
  },

  render: function () {
    var template = Handlebars.compile($('#whiskey_items').html());
    var rendered = template({ drinks: this.collection.toJSON() });
    this.$el.html(rendered);
  },

  toggleDrank: function (event) {
    event.preventDefault();

    var item_clicked = $(event.target);
    var drink_id = item_clicked.attr('id');
    var drink = this.collection.get(drink_id);

    if (item_clicked.parent().hasClass('tried')) {
      drink.set({ tried: false }).save();
    } else {
      drink.set({ tried: true }).save();
    }
  },

  removeWhiskey: function () {}


});