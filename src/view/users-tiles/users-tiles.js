import CollectionView from '../collection';
import template from './users-tiles.html';
import './users-tiles.css';

export const EVENT = {
  SELECT: 'select'
};

export const UsersTiles = CollectionView.extend({
  template: template,

  select(view) {
    this.collection
      .filter(model => model.get('selected'))
      .forEach(model => {
        model.set('selected', false);
      })
    ;
    view.model.set('selected', true);

    this.trigger(EVENT.SELECT, view);
  },

  render() {
    CollectionView.prototype.render.apply(this, arguments);

    this.on('child:click', this.select);
  }
});

export default UsersTiles;