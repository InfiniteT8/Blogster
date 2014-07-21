var Blog = Backbone.Model.extend({

  idAttribute: '_id',

  defaults: {
    name: '',
    description: '',
    author: '',
    read: false
  }

});

var BlogCollection = Backbone.Collection.extend ({
  model: Blog,
  url: 'http://tiy-atl-fe-server.herokuapp.com/collections/TerryBlackJS'
});