import './user-list.css';
import CollectionView from '../collection';
import {FollowersCollection} from './model';
import template from './user-list.html';

export const UserList = CollectionView.extend({
  template: template,
  initialize() {
    this.collection = new FollowersCollection();
    CollectionView.prototype.initialize.apply(this, arguments);
  }
});

export default UserList;