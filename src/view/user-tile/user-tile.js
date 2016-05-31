import Backbone from 'backbone';
import ModelBinder from 'backbone.modelbinder';
import template from './user-tile.html';
import './user-tile.css';

export const EVENT = {
  CLICK: 'click'
};

export const UserTile = Backbone.View.extend({
  events: {
    'click': 'onclick'
  },

  onclick() {
    this.trigger(EVENT.CLICK, this);
  },

  render() {
    this.setElement(template);

    let binder = new ModelBinder();
    this.modelBinder = binder;

    binder.bind(this.model, this.el);

    this.model.on('change:selected', model => {
      this.$el.toggleClass('selected', !!model.get('selected'));
    });

    return this;
  },

  close() {
    this.modelBinder.unbind();
  }
});

export default UserTile;