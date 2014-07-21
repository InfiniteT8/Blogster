var Whiskey = Backbone.Model.extend({

  idAttribute: '_id',

  defaults: {
    name: '',
    description: '',
    tried: false
  }

});

var WhiskeyCollection = Backbone.Collection.extend ({
  model: Whiskey,
  url: 'http://tiy-atl-fe-server.herokuapp.com/collections/whiskeyapp'
});