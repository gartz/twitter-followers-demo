import './index.css';
import Backbone from 'backbone';
import UserListView from './view/user-list/user-list';
import UsersTiles from './view/users-tiles/users-tiles';
import UserTile from './view/user-tile/user-tile';

// Container with user lists
const userListView = new UserListView({
  View: Backbone.View.extend({
    className: 'user-list-item',
    render() {
      // Render the initial list
      let userTiles = new UsersTiles({
        View: UserTile,
        collection: this.model.get('followers')
      });
      userTiles.render();
      this.$el.append(userTiles.$el);

      // Add event to add new lists
      userTiles.on('select', (view) => {
        let screen_name = view.model.get('screen_name');

        let index = userListView.collection.findIndex(model => model.get('followers') === userTiles.collection);
        if (index === -1) {
          userListView.collection.add({screen_name});
          return;
        }

        let nextModel = userListView.collection.at(index + 1);
        let removeList;
        if (nextModel && nextModel.get('screen_name') === screen_name) {
          removeList = userListView.collection.slice(index + 2);
          userListView.collection.remove(removeList);
        } else {
          removeList = userListView.collection.slice(index + 1);
          userListView.collection.remove(removeList);
          userListView.collection.add({screen_name});
        }
      });
    }
  })
});
userListView.render();
userListView.$el.appendTo('body');

// Initial value
userListView.collection.add({screen_name: 'gartz'});

window.userListView = userListView;