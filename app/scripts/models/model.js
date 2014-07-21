var Posts = Backbone.Model.extend ({

  {
  "title": "", // String
  "content": "", // String
  "date": "", // String
  "status": "", // String
  "author": "", // String
  "tags": [] // Array of Strings
}

  idAttribute: ('_id'),
  initialize: function () {
    var title = this.get('title');
    console.log(title + ' has been added to your list of blog post.');
  }

});

var BlogPosts = Backbone.Collection.extend ({

  model: Blog,
  url: "http://tiy-atl-fe-server.herokuapp.com/collections/TerryBlog"
});

var all_blogs = new BlogPosts();