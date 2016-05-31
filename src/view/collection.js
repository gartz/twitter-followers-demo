require('backbone.modelbinder/Backbone.CollectionBinder');
import Backbone from 'backbone';

export const UserList = Backbone.View.extend({
  template: '',

  initialize(options) {
    options = options || {};
    this.template = options.template || this.template;
    this.View = options.View;
  },

  render() {
    this.setElement(this.template);

    let elManagerFactory = new Backbone.CollectionBinder.ViewManagerFactory(model => new this.View({model}));
    let collectionBinder = new Backbone.CollectionBinder(elManagerFactory);

    let eventPropagation = (event, view) => {
      this.trigger(`child:${event}`, view);
    };

    collectionBinder.on('elCreated', (model, view) => {
      view.on('all', eventPropagation);
    });

    collectionBinder.on('elRemoved', (model, view) => {
      view.off('all', eventPropagation);
    });

    collectionBinder.bind(this.collection, this.$el);

    this.collectionBinder = collectionBinder;

    this.on('child:click', this.select);

    return this;
  },

  close() {
    this.collectionBinder.unbind();
  }
});

export default UserList;